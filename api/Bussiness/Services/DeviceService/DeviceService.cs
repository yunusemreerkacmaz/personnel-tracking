using Bussiness.ServiceResults;
using Bussiness.Services.DeviceService.Dtos;
using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Bussiness.Token;
using DataAccess.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Bussiness.Services.DeviceService
{
    public interface IDeviceService
    {
        Task<ServiceResult<UserDto>> GetDevicesService();
        Task<ServiceResult<DeviceDto>> GetDistinctDevicesService();
        Task<ServiceResult<DeviceDto>> CheckDeviceService(DeviceDto deviceDto);
        Task<ServiceResult<DeviceDto>> CreateDeviceService(DeviceDto deviceDto);
        Task<ServiceResult<DeviceDto>> UpdateDeviceService(DeviceDto deviceDto);
        Task<ServiceResult<bool>> DeleteDeviceService(int userId);
    }
    public class DeviceService(IHttpContextAccessor httpContextAccessor, IUserDal userDal, IBarcodeDal barcodeDal, IDeviceDal deviceDal) : IDeviceService
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IUserDal _userDal = userDal;
        private readonly IDeviceDal _deviceDal = deviceDal;
        private static readonly string DeviceKey = "device-token";
        public async Task<ServiceResult<DeviceDto>> CheckDeviceService(DeviceDto deviceDto)
        {
            var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var loginDto = new LoginDto();
            var deviceToken = new StringValues();

            if (headers != null && headers.Authorization.Count > 0)
            {
                deviceToken = headers[DeviceKey];
                loginDto = new TokenDecoder(environment).DecodeToken(headers.Authorization.ToString());
            }
            var getUser = await _userDal.GetAsync(user => loginDto != null && loginDto.UserDto.UserName == user.UserName && loginDto.UserDto.Email == user.Email && !user.IsDeleted);
            var getDevice = await _deviceDal.GetAsync(device => device.UserId == getUser.Id && !device.IsDeleted);

            if (getDevice != null && !string.IsNullOrEmpty(deviceToken)) // kullanıcının veritabanında cihazı kayıtlıysa ve telefonda tokeni varsa kontrol et (Tokenini kontrol et)
            {
                deviceDto.IsDeleted = getDevice.IsDeleted;

                if (getDevice.DeviceToken == deviceToken)  // Kullanıcı başka bir cihazdan girmişse Cihaz Onaylama ekranına gönder
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                }
                else
                {
                    if (getDevice.DistinctDevice == null)                               // Farklı bir cihazdan giriş yaptı
                    {
                        getDevice.DistinctDeviceBrand = deviceDto.DeviceBrand;
                        getDevice.DistinctDeviceModelName = deviceDto.DeviceModelName;
                        getDevice.DistinctDevice = true;
                        var update = _deviceDal.UpdateAsync(getDevice);
                    }
                    if (getDevice.DistinctDevice == false)  // // Admin Cihaz onayı vermemişse
                    {
                        return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Yöneticiniz bu cihaz ile işlem yapabilmenizi engelledi." };

                    }
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Cihaz bilgisi eşleşmedi.Lüften yönetici ile görüşüp cihazınızı onaylatın" };
                }
            }
            else if (getDevice != null && string.IsNullOrEmpty(deviceToken))  // kullanıcının veritabanında cihazı kayıtlıysa ama tokeni yoksa cihaz değişikliği onayı gönder Admine (Kullanıcı Telefonunu Formatlarsa)
            {
                deviceDto.IsDeleted = getDevice.IsDeleted;
                if (getDevice.DistinctDevice == null && getDevice.DeviceToken != null)                                  // Kullanıcı kendi cihazından giriş yapmışsa
                {
                    getDevice.DistinctDeviceBrand = deviceDto.DeviceBrand;
                    getDevice.DistinctDeviceModelName = deviceDto.DeviceModelName;
                    getDevice.DistinctDevice = true;
                    var update = await _deviceDal.UpdateAsync(getDevice);
                    if (update)
                    {
                        return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Cihaz bilgisi eşleşmedi.Lüften yönetici ile görüşüp cihazınızı onaylatın" };
                    }
                    else
                    {
                        return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                    }
                }
                else if (getDevice.DistinctDevice == null && getDevice.DeviceToken != null)
                {
                    getDevice.DeviceToken = deviceToken;
                    var update = await _deviceDal.UpdateAsync(getDevice);
                    if (update)
                    {
                        return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                    }
                    else
                    {
                        return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                    }
                }
                else
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                }
            }
            else if (getDevice == null && !string.IsNullOrEmpty(deviceToken)) // Kullanıcıyı veritabanından biri silerse ve telefonunda hala tokeni varsa
            {
                var isUsingTokenByAnotherPerson = _deviceDal.GetAllQueryAble(x => x.DeviceToken == deviceToken.ToString() && !x.IsDeleted);
                if (!isUsingTokenByAnotherPerson.Any())                     // Kişi kendi telefonundan giriş yapmışsa
                {
                    var deviceHashDto = new DeviceHashDto
                    {
                        UserId = deviceDto.UserDto.Id,
                        UserName = deviceDto.UserDto.UserName,
                        Password = deviceDto.UserDto.Password,
                        DeviceBrand = deviceDto.DeviceBrand,
                        DeviceModelName = deviceDto.DeviceModelName,
                    };
                    string? json = JsonSerializer.Serialize(deviceHashDto);
                    var generateDeviceToken = CreateHS256(json, deviceDto.UserDto.Id.ToString());
                    if (generateDeviceToken == deviceDto.DeviceToken)       // benim ürettiğim token onun telefonundan gelen token ile aynıysa direkt ekle değilse yeniden üretip ekle
                    {
                        var added = await _deviceDal.AddAsync(new Device
                        {
                            Id = 0,
                            UserId = deviceDto?.UserDto?.Id,
                            DeviceToken = deviceToken,
                            CreateTime = DateTime.Now,
                            DeviceBrand = deviceDto?.DeviceBrand,
                            DeviceModelName = deviceDto?.DeviceModelName,
                            DistinctDevice = null,
                        });

                        if (added.Id > 0)
                        {
                            return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                        }
                        else
                        {
                            return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                        }
                    }
                    else
                    {
                        var create = await CreateDeviceService(new DeviceDto
                        {
                            UserDto = new UserDto { Id = getUser.Id, UserName = getUser.UserName, Password = getUser.Password },
                            DeviceModelName = deviceDto.DeviceModelName,
                            DeviceBrand = deviceDto.DeviceBrand,
                        });

                        if (create.ResponseStatus == ResponseStatus.IsSuccess)
                        {
                            return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                        }
                        else
                        {
                            return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                        }
                    }
                }
                else
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Lüften kendi cihazınızdan giriş yapın" };
                }
            }

            else if (getDevice == null && string.IsNullOrEmpty(deviceToken)) // Kullanıcının cihazı veritabanında kayıtlı değilse ve tokeni de yoksa (ilk kez cihaz kaydı oluşturuluyorsa)
            {
                var response = await CreateDeviceService(deviceDto);

                if (response.ResponseStatus == ResponseStatus.IsError)
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Barkod okuma işlemi yapamazsınız cihazınız sisteme Eklenemiyor" };
                }
                else
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                }
            }
            else
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
            }
        }
        public async Task<ServiceResult<DeviceDto>> CreateDeviceService(DeviceDto deviceDto)
        {
            var headers = _httpContextAccessor.HttpContext?.Response?.Headers;  // Respons'a ait header
            string? generateDeviceToken = null;
            if (deviceDto != null && deviceDto.UserDto != null)
            {
                var deviceHashDto = new DeviceHashDto
                {
                    UserId = deviceDto.UserDto.Id,
                    UserName = deviceDto.UserDto.UserName,
                    Password = deviceDto.UserDto.Password,
                    DeviceBrand = deviceDto.DeviceBrand,
                    DeviceModelName = deviceDto.DeviceModelName,
                };
                string? json = JsonSerializer.Serialize(deviceHashDto);
                generateDeviceToken = CreateHS256(json, deviceDto.UserDto.Id.ToString());
            }

            if (generateDeviceToken != null)
            {
                if (headers?.ContainsKey(DeviceKey) == true)
                {
                    headers.Remove(DeviceKey);
                }
                else
                {
                    headers?.Append(DeviceKey, generateDeviceToken);
                }
                var added = await _deviceDal.AddAsync(new Device
                {
                    Id = 0,
                    UserId = deviceDto?.UserDto?.Id,
                    DeviceToken = generateDeviceToken,
                    CreateTime = DateTime.Now,
                    DeviceBrand = deviceDto?.DeviceBrand,
                    DeviceModelName = deviceDto?.DeviceModelName,
                    DistinctDevice = null,
                });
                if (added.Id > 0)
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess };
                }
                else
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
                }
            }
            else
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError };
            }
        }
        public static bool VerifyHS256(string originalMessage, string hash, string key)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(originalMessage));
            var computedHashString = Convert.ToBase64String(computedHash);
            return computedHashString == hash;
        }
        public static string CreateHS256(string originalMessage, string key)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(originalMessage));
            var computedHashString = Convert.ToBase64String(computedHash);
            return computedHashString;
        }
        public async Task<ServiceResult<DeviceDto>> GetDistinctDevicesService()
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

            var userQuery = _userDal.GetAllQueryAble(x => !x.IsDeleted).Where(x => getUser.RoleId == 1 || getUser.StoreId == x.StoreId && x.Id != getUser.Id && x.RoleId != 1); ;
            var deviceQuery = _deviceDal.GetAllQueryAble(x => x.DistinctDevice == true && !x.IsDeleted);

            if (userQuery.Any() && deviceQuery.Any())
            {
                var joinQuery = userQuery.Join(deviceQuery, user => user.Id, device => device.UserId, (user, device) =>
                new DeviceDto
                {
                    Id = device.Id,
                    TokenDeletionStatus = false,
                    DeviceToken = device.DeviceToken,
                    UserDto = new UserDto
                    {
                        Id = user.Id,
                        Password = user.Password,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        UserName = user.UserName,
                        CreateTime = user.CreateTime,
                        DeleteTime = user.DeleteTime,
                        Email = user.Email,
                        Gender = user.Gender,
                        UpdateTime = user.UpdateTime,
                        PhoneNumber=user.PhoneNumber,
                    },
                    DeviceBrand=device.DeviceBrand,
                    DeviceModelName=device.DeviceModelName,
                    DistinctDeviceBrand = device.DistinctDeviceBrand,
                    DistinctDeviceModelName = device.DistinctDeviceModelName
                });

                var join = await joinQuery.ToListAsync();
                if (join != null && join.Count > 0)
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = join };
                }
                else
                {
                    return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Gösterilecek veri yok", Results = [] };
                }
            }
            else
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Gösterilecek veri yok", Results = [] };
            }
        }
        public async Task<ServiceResult<DeviceDto>> UpdateDeviceService(DeviceDto deviceDto)
        {
            User? user = null;
            Device? device = null;
            bool update = false;
            if (deviceDto.UserDto != null)
            {
                user = await _userDal.GetAsync(x => x.Id == deviceDto.UserDto.Id);
                device = await _deviceDal.GetAsync(x => x.Id == deviceDto.Id);
            }
            if (device != null && deviceDto.TokenDeletionStatus == true && device.DistinctDeviceBrand != null && device.DistinctDeviceModelName != null && user != null)            // cihaz varsa ve cihaz değişimi onaylanmışsa
            {
                device.DeviceModelName = device.DistinctDeviceModelName;
                device.DeviceBrand = device.DistinctDeviceBrand;
                var deviceHashDto = new DeviceHashDto
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Password = user.Password,
                    DeviceBrand = device.DistinctDeviceBrand,
                    DeviceModelName = device.DistinctDeviceModelName,
                };
                string? json = JsonSerializer.Serialize(deviceHashDto);
                var generateDeviceToken = CreateHS256(json, user.Id.ToString());

                device.DeviceToken = generateDeviceToken;
                device.DistinctDevice = null;
                device.DeviceToken = generateDeviceToken;
            }
            else if (device != null && deviceDto.TokenDeletionStatus == false)      // cihaz varsa  ve cihaz değişimi reddedilmişse
            {
                device.DistinctDevice = false;
            }
            else
            {
                deviceDto.TokenDeletionStatus = deviceDto.TokenDeletionStatus;
            }
            if (device != null)
            {
                update = await _deviceDal.UpdateAsync(device);
            }
            if (update && deviceDto.TokenDeletionStatus == true)
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Kullanıcının cihaz değişimi onaylandı.Kullanıcı cihazı aktif kullanabilir" };
            }
            else if (update && deviceDto.TokenDeletionStatus == false)
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kullanıcının cihaz değişimi reddedildi.Kullanıcı önceki cihazından devam etmek zorunda." };
            }
            else
            {
                return new ServiceResult<DeviceDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
            }
        }
        public async Task<ServiceResult<bool>> DeleteDeviceService(int userId)
        {
            var device = await _deviceDal.GetAsync(x => x.UserId == userId && !x.IsDeleted);

            if (device != null && device.Id > 0)
            {
                device.IsDeleted = true;
                device.DeleteTime = DateTime.Now;
                var deletedDevice = await _deviceDal.UpdateAsync(device);
                if (deletedDevice)
                {
                    return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Kullanıcı Cihazı başarıyla silindi.Kullanıcı profiline giriş yaptığında sistemde aktif olacak" };
                }
                else
                {
                    return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Kullanıcı Cihazı Silinemedi." };
                }
            }
            else
            {
                return new ServiceResult<bool> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kullanıcı Cihazı Silinemedi." };
            }
        }
        public async Task<ServiceResult<UserDto>> GetDevicesService()
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

            var userQuery = _userDal.GetAllQueryAble(x => !x.IsDeleted).Where(x => getUser.RoleId == 1 || getUser.StoreId == x.StoreId && x.Id != getUser.Id && x.RoleId != 1); // Admin ise tüm verileri getir değilse mağazasına bak ve kendi verisini getirme ayrıca admin ile aynı olan yerdeki kullancıya admini gösterme
            var deviceQuery = _deviceDal.GetAllQueryAble(x => !x.IsDeleted).Select(x => x.UserId);          // cihazı olan ve aktif olan cihazların kullanıcı idlerini getir 
            var query = userQuery.Where(user => deviceQuery.Any(deviceUserId => deviceUserId == user.Id));  // cihazı olan kullancıların bilgilerini getir

            if (query != null && query.Any())
            {
                var users = await query.Select(user => new UserDto
                {
                    Id = user.Id,
                    CreateTime = user.CreateTime,
                    DeleteTime = user.DeleteTime,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    Gender = user.Gender,
                    LastName = user.LastName,
                    Password = user.Password,
                    UpdateTime = user.UpdateTime,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                }).ToListAsync();
                return new ServiceResult<UserDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = users };
            }
            return new ServiceResult<UserDto> { ResponseStatus = ResponseStatus.IsSuccess };
        }
    }
}
