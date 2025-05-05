using Bussiness.ServiceResults;
using Bussiness.Services.BarcodeService.Dtos;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.Stores.Dtos;
using Bussiness.Services.UserService.Dtos;
using Bussiness.Token;
using DataAccess.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Bussiness.Services.UserService
{
    public interface IUserService
    {
        Task<ServiceResult<AddUserDto>> AddUser(AddUserDto addUserDto);
        Task<ServiceResult<GetUserDto>> GetUsers();
        Task<ServiceResult<DeleteUsersDto>> DeleteUsers([FromBody] List<DeleteUsersDto> deleteUsersDtos);
        Task<ServiceResult<AddUserDto>> UpdateUser(AddUserDto updateUserDto);
        Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLoginService();
        Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLogoutService();
        Task<ServiceResult<UserBarcodeLoginDto>> UpdateBarcodeUserService(UserBarcodeLoginDto updateUserDto);  // Aşağıya GetBarcodeUserService(bunu giriş bilgierini çeksin ama adını değiştir(GetBarcodeUserLoginService) bide çıkış yapacak olanlar içinde servis oluştur((GetBarcodeUserLogoutService)))
    }
    public class UserService(IUserDal userDal, IBarcodeDal barcodeDal, IStoreDal storeDal, IDeviceDal deviceDal, IHttpContextAccessor httpContextAccessor) : IUserService
    {
        private readonly IUserDal _userDal = userDal;
        private readonly IBarcodeDal _barcodeDal = barcodeDal;
        private readonly IStoreDal _storeDal = storeDal;
        private readonly IDeviceDal _deviceDal = deviceDal;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        public async Task<ServiceResult<AddUserDto>> AddUser(AddUserDto addUserDto)
        {
            if (!string.IsNullOrEmpty(addUserDto.UserName))
            {
                var user = await _userDal.GetAsync(user =>
                user != null &&
                user.UserName.Equals(addUserDto.UserName) &&
                user.Password.Equals(addUserDto.Password));
                if (user == null)
                {
                    var userEntity = new User
                    {
                        UserName = addUserDto.UserName,
                        Password = addUserDto.Password,
                        FirstName = addUserDto.FirstName,
                        LastName = addUserDto.LastName,
                        Gender = addUserDto.Gender,
                        RoleId = addUserDto.RoleDto.Id,
                        RoleName = addUserDto.RoleDto.RoleName,
                        CreateTime = DateTime.Now,
                        Email = addUserDto.Email,
                        PhoneNumber = addUserDto.PhoneNumber,
                        StoreId = addUserDto.StoreDto.Id,
                        StartTime = addUserDto.ShiftTime.StartDate != null ? TimeOnly.Parse(addUserDto.ShiftTime.StartDate) : null, // vardiya giriş zamanı
                        EndTime = addUserDto.ShiftTime.EndDate != null ? TimeOnly.Parse(addUserDto.ShiftTime.EndDate) : null,        // vardiya çıkış zamanı
                        IsActive = false                            // ilk eklendiğinde false olması lazım çünkü kişi silinebilmeli ayrıca admin güncellemeden kişiyi aktif yapabilir ve kişi sistemde giriş yapmışsa yine aktif olabilir
                    };
                    var addedUser = await _userDal.AddAsync(userEntity);
                    if (addedUser != null && addedUser.Id > 0)
                    {
                        var users = await GetUsers();
                        var maptoUsersDto = users.Results?.Select(user => new AddUserDto
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Gender = user.Gender,
                            Password = user.Password,
                            UserName = user.UserName,
                            Email = user.Email,
                            StoreDto = user.StoreDto,
                            ShiftTime = user.ShiftTime,
                            IsActive = user.IsActive,
                            RoleDto = user.RoleDto,
                        }).ToList();

                        return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = maptoUsersDto, ResponseMessage = "Yetki başarıyla eklendi" };
                    }
                    else
                    {
                        return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Ekleme işlemi sırasında hata oluştu" };
                    }
                }
                return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Yetki Sistemde Mevcut" };
            }
            else
            {
                return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Yetki adı boş bırakılamaz" };
            }
        }
        public async Task<ServiceResult<DeleteUsersDto>> DeleteUsers([FromBody] List<DeleteUsersDto> deleteUsersDtos)
        {
            int allDeletedNumber = 0;
            var users = _userDal.GetAllQueryAble(x => !x.IsDeleted);       // silinmeyen kullanıcıları getir
            var barcode = _barcodeDal.GetAllQueryAble();                    // barcode tablosundaki verileri getir
            var deletedUserIds = deleteUsersDtos.Select(x => x.Id);         // frontend den silinen veirlerin idlerini al
            var userEntites = users.Where(x => deletedUserIds.Any(i => i == x.Id)); // userlar içinde frontend den gelenlerle eşleşenleri al
            var willBeDeleteEntities = await userEntites.Where(user => !barcode.Any(i => i.UserId == user.Id)).ToListAsync();  // user tablosunda bu silinecekler arasında olmayanları barkod tablosunda olmayanları bul

            foreach (var user in willBeDeleteEntities)
            {
                user.DeleteTime = DateTime.Now;
                user.IsDeleted = true;
                var isDeleted = await _userDal.UpdateAsync(user);
                if (!isDeleted)
                {
                    allDeletedNumber++;
                }
            }
            if (willBeDeleteEntities.Count > 0 && allDeletedNumber == 0 && willBeDeleteEntities.Count == deletedUserIds.Count())
            {
                return new ServiceResult<DeleteUsersDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Tüm silme işlemi başarılı" };
            }
            else if (willBeDeleteEntities.Count > allDeletedNumber)
            {
                return new ServiceResult<DeleteUsersDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = $"Seçtiğiniz {deleteUsersDtos.Count} kullanıcıdan {deleteUsersDtos.Count - willBeDeleteEntities.Count} tanesi silinemedi.Silinmeyen personelleri silmek için güncelleme ekranında pasif'e almanız gerekiyor." };
            }
            else if (willBeDeleteEntities.Count == 0)
            {
                return new ServiceResult<DeleteUsersDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = $"Silinmeyen personelleri silmek için güncelleme ekranında pasif'e almanız gerekiyor." };
            }
            else
            {
                return new ServiceResult<DeleteUsersDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Silme işleminde hata oluştu" };
            }
        }
        public async Task<ServiceResult<GetUserDto>> GetUsers()
        {
            var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var loginDto = new TokenDecoder(environment).DecodeToken(headers != null ? headers.Authorization.ToString() : "");

            var getUser = await _userDal.GetAsync(user =>
            loginDto.UserDto != null &&
            loginDto.RoleDto != null &&
            loginDto.UserDto.UserName == user.UserName &&
            loginDto.UserDto.Email == user.Email &&
            loginDto.RoleDto.RoleName.ToLower().Trim() == user.RoleName.ToLower().Trim());

            var barcodeUserIds = _barcodeDal.GetAllQueryAble().Select(barcode => barcode.UserId);
            var users = _userDal.GetAllQueryAble(x => !x.IsDeleted).Where(x => getUser.RoleId == 1 || (x.StoreId == getUser.StoreId && x.RoleId != 1));  //Admin herkesi görsün ama mağaza yöneticileri altında çalışanları görsün ve admin o mağazaya dahilse gözükmesin

            var stores = _storeDal.GetAllQueryAble(x => !x.IsDeleted);
            var barcodesUserIds = _barcodeDal.GetAllQueryAble().Select(x => x.UserId);

            var storeAndUserJoin = users.Join(stores,
            user => user.StoreId,
            store => store.Id,
            (user, store) =>
            new GetUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive, // Önce kullanıcı aktif mi diye baksın .Eğer kullanıcı aktif ise barkod tablosuna baksın kullancı varsa silinemez gidip kullanıcı tablosunda pasife alması gerekir
                IsHaveBarcode = barcodesUserIds.Any(barcodeUserId => barcodeUserId == user.Id),
                Email = user.Email,
                Password = user.Password,
                Gender = user.Gender,
                CreateTime = user.CreateTime,
                DeleteTime = user.DeleteTime,
                UpdateTime = user.UpdateTime,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                RoleDto = new RoleDto { Id = user.RoleId, RoleName = user.RoleName },
                ShiftTime = new TimeDto
                {
                    StartDate = user.StartTime.HasValue ? user.StartTime.Value.ToString("HH:mm") : null,
                    EndDate = user.EndTime.HasValue ? user.EndTime.Value.ToString("HH:mm") : null,
                },
                StoreDto = new StoreDto
                {
                    StoreName = store.StoreName,
                    Id = store.Id,
                    StoreTime = new TimeDto
                    {
                        StartDate = store.StartDate.HasValue ? store.StartDate.Value.ToString("HH:mm") : null,
                        EndDate = store.EndDate.HasValue ? store.EndDate.Value.ToString("HH:mm") : null,
                    },
                    StoreLocation = new StoreLocationDto
                    {
                        Latitude = store.Latitude,
                        Longitude = store.Longitude,
                        LatitudeDelta = store.LatitudeDelta,
                        LongitudeDelta = store.LongitudeDelta,
                    }
                },

            }).OrderByDescending(x => x.Id);

            var mapToUsers = await storeAndUserJoin.ToListAsync();

            if (users.Any())
            {
                return new ServiceResult<GetUserDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = mapToUsers };
            }
            else
            {
                return new ServiceResult<GetUserDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Yetkilerin veileri getirilemedi" };
            }
        }
        public async Task<ServiceResult<AddUserDto>> UpdateUser(AddUserDto updateUserDto)
        {
            if (updateUserDto != null && updateUserDto.Id > 0)
            {
                var user = await _userDal.GetAsync(x => x.Id == updateUserDto.Id);

                if (updateUserDto.UserName != user.UserName ||              // Herhangi birşey güncellenmiş mi diye kontrol et
                    updateUserDto.FirstName != user.FirstName ||
                    updateUserDto.LastName != user.LastName ||
                    updateUserDto.Password != user.Password ||
                    updateUserDto.RoleDto.RoleName != user.RoleName ||
                    updateUserDto.StoreDto.Id != user.StoreId ||
                    updateUserDto.Email != user.Email ||
                    updateUserDto.Gender != user.Gender ||
                    updateUserDto.PhoneNumber != user.PhoneNumber ||
                    updateUserDto.IsActive != user.IsActive ||
                    updateUserDto.ShiftTime.StartDate != (user.StartTime.HasValue ? user.StartTime.Value.ToString("HH:mm") : null) ||
                    updateUserDto.ShiftTime.EndDate != (user.EndTime.HasValue ? user.EndTime.Value.ToString("HH:mm") : null)
                    )
                {
                    user.UserName = updateUserDto.UserName;
                    user.Password = updateUserDto.Password;
                    user.FirstName = updateUserDto.FirstName;
                    user.LastName = updateUserDto.LastName;
                    user.RoleName = updateUserDto.RoleDto.RoleName;
                    user.Email = updateUserDto.Email;
                    user.StoreId = updateUserDto.StoreDto.Id;
                    user.Gender = updateUserDto.Gender;
                    user.UpdateTime = DateTime.Now;
                    user.IsActive = updateUserDto.IsActive;
                    user.StartTime = updateUserDto.ShiftTime.StartDate != null ? TimeOnly.Parse(updateUserDto.ShiftTime.StartDate) : null;
                    user.EndTime = updateUserDto.ShiftTime.EndDate != null ? TimeOnly.Parse(updateUserDto.ShiftTime.EndDate) : null;
                    var update = await _userDal.UpdateAsync(user);
                    if (update)
                    {
                        return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Personel başarıyla güncellendi" };
                    }
                    else
                    {
                        return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Güncellenme esnasında hata oluştu" };
                    }
                }
                else
                {
                    return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Gönderilen veriler zaten sistem de mevcut güncelleme yapılmadı" };
                }
            }
            else
            {
                return new ServiceResult<AddUserDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Gönderilen bilgilerde hata var" };
            }
        }
        public async Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLoginService()
        {
            var results = await (from user in _userDal.GetAllQueryAble(x => !x.IsDeleted && x.IsActive)
                                 join barcode in _barcodeDal.GetAllQueryAble()
                                     on user.Id equals barcode.UserId into barcodeGroup
                                 from barcode in barcodeGroup
                                     .Where(b => b.StartDate.HasValue && b.StartDate.Value.Date == DateTime.Now.Date && b.Entreance == true) // barcode tablosu filtresi burada
                                     .DefaultIfEmpty()
                                 where barcode == null  // eşleşmeyenler (ya da şarta uymayanlar) ---> user.Id != barcode.UserId
                                 select new UserBarcodeLoginDto
                                 {
                                     UserDto = new UserDto
                                     {
                                         Id = user.Id,
                                         UserName = user.UserName,
                                         FirstName = user.UserName,
                                         LastName = user.UserName,
                                         Email = user.Email,
                                         Gender = user.Gender,
                                         Password = user.Password,
                                         PhoneNumber = user.PhoneNumber,
                                         CreateTime = user.CreateTime,
                                         DeleteTime = user.DeleteTime,
                                         UpdateTime = user.UpdateTime,
                                     },
                                     IsApproval = null,
                                 }).ToListAsync();
            if (results.Count > 0)
            {
                return new ServiceResult<UserBarcodeLoginDto> { Results = results, ResponseStatus = ResponseStatus.IsSuccess };
            }
            else
            {
                return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Kullanıcı Bulunamadı" };
            }
        }
        public async Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLogoutService()
        {
            var results = await (from user in _userDal.GetAllQueryAble(x => !x.IsDeleted && x.IsActive)
                                 join barcode in _barcodeDal.GetAllQueryAble()
                                     on user.Id equals barcode.UserId into barcodeGroup
                                 from barcode in barcodeGroup
                                     .Where(b => b.StartDate.HasValue && b.StartDate.Value.Date == DateTime.Now.Date && b.Entreance == true && b.Exit == null) // barcode tablosu filtresi burada
                                 select new UserBarcodeLoginDto
                                 {
                                     UserDto = new UserDto
                                     {
                                         Id = user.Id,
                                         UserName = user.UserName,
                                         FirstName = user.UserName,
                                         LastName = user.UserName,
                                         Email = user.Email,
                                         Gender = user.Gender,
                                         Password = user.Password,
                                         PhoneNumber = user.PhoneNumber,
                                         CreateTime = user.CreateTime,
                                         DeleteTime = user.DeleteTime,
                                         UpdateTime = user.UpdateTime,
                                     },
                                     IsApproval = null,
                                 }).ToListAsync();
            if (results.Count > 0)
            {
                return new ServiceResult<UserBarcodeLoginDto> { Results = results, ResponseStatus = ResponseStatus.IsSuccess };
            }
            else
            {
                return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Kullanıcı Bulunamadı" };
            }
        }
        public async Task<ServiceResult<UserBarcodeLoginDto>> UpdateBarcodeUserService(UserBarcodeLoginDto updateUserDto)
        {
            var user = await _userDal.GetAsync(user => user.Id == updateUserDto.UserDto.Id && !user.IsDeleted && user.IsActive);
            if (user != null)
            {
                var device = await _deviceDal.GetAsync(device => device.UserId == user.Id && !device.IsDeleted);
                var store = await _storeDal.GetAsync(store => store.Id == user.StoreId);
                if (device != null && store != null)
                {
                    if (updateUserDto.IsApproval == true) // Admin kullanıcı girişi onayı
                    {
                        var willAddBarcode = new Barcode
                        {
                            Id = 0,
                            AreaControl = true,
                            DeviceId = device.Id,
                            StartDate = DateTime.Now,
                            EndDate = null,
                            Entreance = true,
                            Exit = null,
                            Latitude = store.Latitude,
                            Longtitude = store.Longitude,
                            RoleId = user.RoleId,
                            UserId = user.Id,
                            ApprovingAuthorityId = 1, // buradaki metoda sadece admin istek atabildiğinden dolayı
                        };
                        var addBarcode = await _barcodeDal.AddAsync(willAddBarcode);
                        if (addBarcode != null)
                        {
                            return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Kullanıcının Girişi Başarılı" };
                        }
                        else
                        {
                            return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kullanıcının Girişi Yapılamadı" };
                        }
                    }
                    else if (updateUserDto.IsApproval == false)  // Admin kullanıcı çıkışı onayı
                    {
                        var barcode = await _barcodeDal.GetAllAsync(barcode => barcode.UserId == updateUserDto.UserDto.Id && barcode.StartDate.HasValue && barcode.StartDate.Value.Date == DateTime.Now.Date);
                        if (barcode != null)
                        {
                            var lastBarcode = barcode.LastOrDefault();

                            if (lastBarcode != null)
                            {
                                lastBarcode.Id = lastBarcode.Id;
                                lastBarcode.AreaControl = lastBarcode.AreaControl;
                                lastBarcode.DeviceId = lastBarcode.DeviceId;
                                lastBarcode.StartDate = lastBarcode.StartDate;
                                lastBarcode.EndDate = DateTime.Now;
                                lastBarcode.Entreance = lastBarcode.Entreance;
                                lastBarcode.Exit = true;
                                lastBarcode.Latitude = lastBarcode.Latitude;
                                lastBarcode.Longtitude = lastBarcode.Longtitude;
                                lastBarcode.RoleId = lastBarcode.RoleId;
                                lastBarcode.UserId = lastBarcode.UserId;
                                lastBarcode.ApprovingAuthorityId = 1;       // buradaki metoda sadece admin istek atabildiğinden dolayı
                                var updateLastBarcode = await _barcodeDal.UpdateAsync(lastBarcode);
                                if (updateLastBarcode)
                                {
                                    return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Çıkış işlemi Başarılı" };
                                }
                                else
                                {
                                    return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Çıkış işleminde Hata Oluştu" };
                                }
                            }
                        }
                        return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsSuccess };
                    }
                    else
                    {
                        return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
                    }
                }
                else
                {
                    string resultMessage = $"Kullanıcının sistemde {(device == null ? "cihaz" : "mağaza")} bilgisi yok, giriş yapılamadı.";
                    return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = resultMessage };
                }
            }
            else
            {
                return new ServiceResult<UserBarcodeLoginDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kullanıcının Girişi Yapılamadı" };
            }
        }
    }
}
