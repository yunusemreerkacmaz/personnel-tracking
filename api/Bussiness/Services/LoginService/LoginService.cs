using Bussiness.ServiceResults;
using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.NotificationService;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Bussiness.Token;
using DataAccess.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text.Json;
namespace Bussiness.Services.LoginService
{
    public interface ILoginService
    {
        Task<ServiceResult<LoginDto>> LoginCheck();
        Task<ServiceResult<LoginDto>> LoginAsync(LoginDto UserDto);
        Task<ServiceResult<ForgottenPasswordDto>> ForgottenPassword(ForgottenPasswordDto emailDto);
        Task<ServiceResult<UserDto>> ListofAbsentees();
        Task<ServiceResult<bool>> DeleteEmailJob();
    }
    public class LoginService(
        IUserDal userDal,
        IForgottenPasswordDal forgottenPasswordDal,
        INotificationDal notificationDal,
        IBarcodeDal barcodeDal,
        INotificationService notificationService,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration
        ) : ILoginService
    {
        private readonly IUserDal _userDal = userDal;
        private readonly IForgottenPasswordDal _forgottenPasswordDal = forgottenPasswordDal;
        private readonly INotificationDal _notificationDal = notificationDal;
        private readonly IBarcodeDal _barcodeDal = barcodeDal;
        private readonly INotificationService _notificationService = notificationService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IConfiguration _configuration = configuration;
        public async Task<ServiceResult<LoginDto>> LoginCheck()
        {
            var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var loginDto = new TokenDecoder(environment).DecodeToken(headers.Authorization);

            var getUser = await _userDal.GetAsync(user =>
            loginDto.UserDto != null &&
            loginDto.RoleDto != null &&
            loginDto.UserDto.UserName == user.UserName &&
            loginDto.UserDto.Email == user.Email &&
            loginDto.RoleDto.RoleName.ToLower().Trim() == user.RoleName.ToLower().Trim());

            if (getUser != null && getUser?.Id > 0)
            {
                if (loginDto.UserDto != null)
                {
                    loginDto.UserDto.Id = getUser.Id;
                    loginDto.UserDto.FirstName = getUser.FirstName ?? "";
                    loginDto.UserDto.LastName = getUser.LastName ?? "";
                    loginDto.UserDto.UserName = getUser.UserName ?? "";
                    loginDto.UserDto.Gender = getUser.Gender;
                    loginDto.UserDto.Email = getUser.Email;
                    loginDto.UserDto.Password = getUser.Password;
                    loginDto.UserDto.CreateTime = getUser.CreateTime;
                    loginDto.UserDto.UpdateTime = getUser.UpdateTime;
                    loginDto.UserDto.UpdateTime = getUser.UpdateTime;
                    loginDto.UserDto.PhoneNumber = getUser.PhoneNumber;
                }
                if (loginDto.RoleDto != null)
                {
                    loginDto.RoleDto.Id = getUser.RoleId;
                    loginDto.RoleDto.RoleName = getUser.RoleName ?? "";
                }
                return new ServiceResult<LoginDto> { ResponseStatus = ResponseStatus.IsSuccess, Result = loginDto };
            }
            else
            {
                return new ServiceResult<LoginDto> { ResponseStatus = ResponseStatus.IsError };
            }
        }
        public async Task<ServiceResult<LoginDto>> LoginAsync(LoginDto loginDto)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var headers = _httpContextAccessor.HttpContext?.Response?.Headers;
            var user = await _userDal.GetAsync(x => x.UserName == loginDto.UserDto.UserName && x.Password == loginDto.UserDto.Password);

            if (user == null)
            {
                return new ServiceResult<LoginDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Kullanıcı adı yada şifre yanlış" };
            }
            if (!user.IsActive)  // Kullanıcı aktif değilse giriş yapamasın
            {
                return new ServiceResult<LoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kullanıcı Aktif olmadığından giriş yapılamaz" };
            }

            var maptologinDto = new LoginDto();

            maptologinDto.UserDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                Gender = user.Gender,
                LastName = user.LastName,
                Password = user.Password,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            maptologinDto.RoleDto = new RoleDto { Id = user.RoleId, RoleName = user.RoleName };

            if (headers?.ContainsKey("authorization") == true)
            {
                headers.Remove("authorization");
                //headers.Authorization = $"Bearer {new BuildToken(environment).CreateToken(maptologinDto)}";
            }
            else
            {
                headers?.Append("Authorization", $"Bearer {new BuildToken(environment).CreateToken(maptologinDto)}");
            }
            maptologinDto.IsLoggedIn = true;
            maptologinDto.RememberMe = loginDto.RememberMe;
            await _notificationService.GetlAllNotifyAdminAsync();
            return new ServiceResult<LoginDto> { ResponseStatus = ResponseStatus.IsSuccess, Result = maptologinDto };

        }
        public async Task<ServiceResult<ForgottenPasswordDto>> ForgottenPassword(ForgottenPasswordDto emailDto) // frontend den EmailConfirmStatus u false gönder
        {
            var user = await _userDal.GetAsync(x => x.Email.ToLower().Trim().Equals(emailDto.Email.ToLower().Trim()));
            var forgotten = await _forgottenPasswordDal.GetAllQueryAble(x => x.Email.Equals(emailDto.Email) && emailDto.EmailConfirmNumber.Equals(emailDto.EmailConfirmNumber)).OrderByDescending(x => x.Id).Take(1).FirstOrDefaultAsync();
            if (user != null && user.Id > 0)
            {
                var result = new ForgottenPasswordDto
                {
                    Email = user.Email,
                    //EmailConfirmStatus = forgotten != null ? forgotten.EmailConfirmStatus : false,
                    Password = emailDto.Password,
                    UserName = emailDto.UserName,
                    EmailConfirmNumber = emailDto.EmailConfirmNumber.Replace(" ", "").Trim(),
                };
                if (string.IsNullOrEmpty(emailDto.EmailConfirmNumber))                                  // 1. aşama email girildi ve emaile buton gönderildi
                {
                    Random generator = new();
                    var randomNumber = generator.Next(0, 1000000).ToString("D6");                       // 6 haneli sayı üretildi
                    var emailResponse = await SendMailAsync(emailDto.Email, randomNumber, _configuration);

                    if (emailResponse.ResponseStatus == ResponseStatus.IsSuccess)
                    {
                        var addToForgottenPassword = await _forgottenPasswordDal.AddAsync(new ForgottenPassword
                        {
                            CreateTime = DateTime.Now,
                            Email = user.Email,
                            RoleId = user.RoleId,
                            UserId = user.Id,
                            EmailConfirmNumber = randomNumber,
                        });
                        if (addToForgottenPassword != null)
                        {
                            return new ServiceResult<ForgottenPasswordDto> { ResponseMessage = emailResponse.ResponseMessage, Result = result, ResponseStatus = ResponseStatus.IsSuccess };
                        }
                        else
                        {
                            return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kişi ekleme işleminde hata oluştu" };
                        }
                    }
                    else
                    {
                        return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = emailResponse.ResponseMessage };
                    }
                }
                else if (forgotten != null && forgotten.EmailConfirmNumber != null && forgotten.EmailConfirmNumber == result.EmailConfirmNumber && string.IsNullOrEmpty(emailDto.UserName) && string.IsNullOrEmpty(emailDto.Password))
                {
                    return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsSuccess, Result = result };
                }
                else if (forgotten != null && !string.IsNullOrEmpty(forgotten.EmailConfirmNumber) && !string.IsNullOrEmpty(emailDto.UserName) && !string.IsNullOrEmpty(emailDto.Password))   // 3. aşama emaildeki butona tıklanma durumunu kontrol.Tıklanmışsa kişi bilgilerini kaydet aksi takdirde emailinizi onaylayın toastını göster
                {
                    user.Password = emailDto.Password;
                    user.UserName = emailDto.UserName;
                    user.UpdateTime = DateTime.Now;
                    var updateNewRegister = await _userDal.UpdateAsync(user);
                    var forgottenPassword = await _forgottenPasswordDal.GetAsync(x => x.Id == user.Id && emailDto.EmailConfirmNumber == x.EmailConfirmNumber);
                    if (forgottenPassword != null)
                    {
                        forgottenPassword.UpdateTime = DateTime.Now;
                        await _forgottenPasswordDal.UpdateAsync(forgottenPassword);
                    }
                    if (updateNewRegister)
                    {
                        //await _notificationDal.AddAsync(new Notification
                        //{
                        //    FirstName = user.FirstName,
                        //    LastName = user.LastName,
                        //    RoleId = user.RoleId,
                        //    ReadStatus = false,
                        //    RoleName = user.RoleName,
                        //    UserId = user.Id,
                        //    UserName = user.UserName,
                        //    Message = $@"{{""Header"":""Şifre Yenileme İşlemi"",""Body"":""Adı Soyadı:{user.FirstName} {user.LastName}"",""Footer"":""""}}"
                        //});

                        await _notificationService.GetlAllNotifyAdminAsync();

                        return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Kişi bilgileri başarıyla güncellendi", Result = result };
                    }
                    else
                    {
                        return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Güncelleme işlemi sırasında bir hata oluştu." };
                    }
                }
                else
                {
                    if (forgotten != null && !string.IsNullOrEmpty(forgotten.EmailConfirmNumber) && forgotten.EmailConfirmNumber != emailDto.Password)
                    {
                        return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "şifre Hatalı" };
                    }
                    else
                    {
                        return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
                    }
                }
            }
            else
            {
                return new ServiceResult<ForgottenPasswordDto> { ResponseStatus = ResponseStatus.IsError };
            }
        }
        public static async Task<ServiceResult<bool>> SendMailAsync(string targetMail, string? emailConfirmNumber, IConfiguration _configuration)
        {
            if (emailConfirmNumber != null)
            {
                //var template = _configuration.GetSection("EmailTemplates:PasswordReset").Value;
                var template = _configuration["EmailTemplates:PasswordReset"]; // appsettings dosyasından PasswordReset değerini oku 
                bool mailStatus;
                try
                {
                    var fromMail = "pdks@modalife.com.tr";                          // Gönderici Mail
                    var pw = "IiqjA8Bi85";
                    var client = new SmtpClient("proxy.uzmanposta.com", 587)
                    {
                        EnableSsl = true,
                        Credentials = new NetworkCredential(fromMail, pw),
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromMail),
                        IsBodyHtml = true,
                        Subject = "Şifre Yenileme",
                        Body = template != null ? template.Replace("{{CODE}}", string.Join(" ", emailConfirmNumber.ToCharArray())) : "Hata Oluştu tekrar deneyin" // appsetttings dosyasında yer alan Html deki CODE kısmıyla gönderdiğim şifreyi değiştir
                    };
                    mailMessage.To.Add(targetMail);                                 // Alıcı mail
                    await client.SendMailAsync(mailMessage);
                    mailStatus = true;
                }
                catch
                {
                    mailStatus = false;

                }
                if (mailStatus)
                {
                    return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Şifre Emailinize Gönderildi" };
                }
                else
                {
                    return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Email gönderme işleminde hata oluştu" };
                }
            }
            else
            {
                return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Email Numarası emailde gönderilemedi" };
            }
        }
        public async Task<ServiceResult<UserDto>> ListofAbsentees()
        {
            var startWorkDate = DateTime.Now;

            if (startWorkDate.Hour > 8)
            {
                var users = _userDal.GetAllQueryAble();
                var barcodes = _barcodeDal.GetAllQueryAble();
                var barcodesPressentUserIds = await barcodes.Where(x => x.StartDate.HasValue && x.StartDate.Value.Date.Equals(DateTime.Now.Date) && x.Entreance == true).Select(x => x.UserId).ToListAsync();
                var ListofAbsentees = await users.Where(x => !barcodesPressentUserIds.Any(i => i == x.Id)).ToListAsync();

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true, // Büyük/küçük harf duyarlılığı kaldırılır
                    DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                };

                if (ListofAbsentees != null && ListofAbsentees.Count > 0)
                {
                    string jsonString = JsonSerializer.Serialize<dynamic>(ListofAbsentees, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true, // Büyük/küçük harf duyarlılığı kaldırılır
                        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                    });

                    var admin = await _userDal.GetAsync(x => x.Id == 1);

                    string header = "İşe Gelmeyenlerin Listesi";
                    string bodyListName = "ListofAbsentees";
                    string footer = "";


                    var notificationStatus = await _notificationDal.AddAsync(new Notification
                    {
                        RoleId = admin.RoleId,
                        RoleName = admin.RoleName,
                        FirstName = admin.FirstName,
                        UserId = admin.Id,
                        LastName = admin.LastName,
                        UserName = admin.UserName,
                        ReadStatus = false,
                        Message = $@"{{""Header"":""{header}"",""Body"":{{""{bodyListName}"":{jsonString}}},""Footer"":""{footer}""}}",
                        CreateTime = DateTime.Now
                    });

                    if (notificationStatus != null && notificationStatus.Id > 0)
                    {
                        await _notificationService.GetlAllNotifyAdminAsync();
                    }
                }
            }
            return new ServiceResult<UserDto>();
        }
        public async Task<ServiceResult<bool>> DeleteEmailJob()
        {
            //var threeMonthsAgo = DateTime.Now.AddMonths(-3);
            //var allforgottenPassword = await _forgottenPasswordDal.GetAllAsync(password =>
            //password.CreateTime.HasValue &&
            //password.CreateTime.Value < threeMonthsAgo
            //);

            var allforgottenPassword = await _forgottenPasswordDal.GetAllAsync(x => x.Id == 69 || x.Id == 70);

            foreach (var item in allforgottenPassword)
            {
                await _forgottenPasswordDal.DeleteAsync(item);
            }

            return new ServiceResult<bool>();
        }
    }
}
