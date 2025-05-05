using Bussiness.Helper.Enums;
using Bussiness.ServiceResults;
using Bussiness.Services.BarcodeService.Dtos;
using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.Stores.Dtos;
using Bussiness.Services.UserService.Dtos;
using DataAccess.Abstract;
using Entity;

namespace Bussiness.Services.BarcodeService
{
    public interface IBarcodeService
    {
        Task<ServiceResult<BarcodeDto>> BarcodeReadAsync(BarcodeDto barcodeDto);
        Task<ServiceResult<BarcodeDto>> BarcodeCheckAsync(BarcodeDto barcodeDto);
    }
    public class BarcodeService(IBarcodeDal barcodeDal, IUserDal userDal, IStoreDal storeDal, IRoleDal roleDal, IDeviceDal deviceDal) : IBarcodeService
    {
        private readonly IBarcodeDal _barcodeDal = barcodeDal;
        private readonly IUserDal _userDal = userDal;
        private readonly IStoreDal _storeDal = storeDal;
        private readonly IRoleDal _roleDal = roleDal;
        private readonly IDeviceDal _deviceDal = deviceDal;
        public async Task<ServiceResult<BarcodeDto>> BarcodeCheckAsync(BarcodeDto barcodeDto)
        {
            var barcodeStatus =                                                                     // gönderilen barkod bilgileri varsa ve kullanıcı id si var mı
                barcodeDto != null &&
                barcodeDto.BarcodeReadEnum != null &&
                barcodeDto.Data != null &&
                barcodeDto.LoginDto.UserDto.Id > 0;

            var user = await _userDal.GetAsync(x => barcodeStatus && barcodeDto != null && x.Id == barcodeDto.LoginDto.UserDto.Id);  // barkod bilgileri varsa kullanıcı bilgilerini al

            var locationStatus = barcodeDto?.LocationDto != null &&
                barcodeDto.LocationDto.Longitude != null &&
                barcodeDto.LocationDto.Latitude != null &&
                barcodeDto.LocationDto.AreaControl != null;

            if (barcodeStatus && locationStatus)                                    // Barkod,Konum ve cihaz bilgileri varsa 
            {
                var mapToBarcodeDto = new BarcodeDto();
                var barcode = await _barcodeDal.GetAllAsync(x => barcodeDto != null && x.UserId == barcodeDto.LoginDto.UserDto.Id && x.StartDate != null && x.StartDate.Value.Date == DateTime.Now.Date);
                var device = await _deviceDal.GetAsync(device => device.UserId == user.Id && !device.IsDeleted);
                var lastBarcode = barcode.LastOrDefault();
                if (lastBarcode != null && device != null && device.DeviceToken != null && lastBarcode.StartDate.HasValue && lastBarcode.StartDate.Value.Date == DateTime.Now.Date) // cihaz'ın tokeni varsa ve bugüne aitse
                {
                    var storeEntity = await _storeDal.GetAsync(x => user != null && x.Id == user.StoreId);
                    mapToBarcodeDto.Id = lastBarcode.Id;
                    mapToBarcodeDto.LocationDto = new LocationDto { Latitude = lastBarcode.Latitude, Longitude = lastBarcode.Longtitude };
                    mapToBarcodeDto.LoginDto = new LoginDto
                    {
                        UserDto = new UserDto
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
                        },
                        RoleDto = new RoleDto
                        {
                            Id = user.RoleId,
                            IsActive = user.IsActive,
                            RoleName = user.RoleName,
                        },
                        IsLoggedIn = true,
                    };
                    mapToBarcodeDto.StoreDto = storeEntity != null ? new StoreDto
                    {
                        Id = storeEntity.Id,
                        IsActive = storeEntity.IsActive,
                        Radius = storeEntity.Radius,
                        StoreLocation = new StoreLocationDto
                        {
                            Latitude = storeEntity.Latitude,
                            Longitude = storeEntity.Longitude,
                            LatitudeDelta = storeEntity.LatitudeDelta,
                            LongitudeDelta = storeEntity.LongitudeDelta
                        },
                        StoreName = storeEntity.StoreName,
                        StoreTime = new TimeDto
                        {
                            StartDate = storeEntity.StartDate.HasValue ? storeEntity.StartDate.Value.ToString("HH:mm") : null,
                            EndDate = storeEntity.EndDate.HasValue ? storeEntity.EndDate.Value.ToString("HH:mm") : null
                        }
                    }
                    : new StoreDto();
                    if (lastBarcode.Entreance == true && lastBarcode.StartDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Entreance) // Sisteme Giriş Yapmamışsa
                    {
                        return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Giriş işlemi öncesinde yapıldı." };
                    }
                    else if (lastBarcode.Entreance != true && lastBarcode.StartDate == null) // Sisteme Giriş Yapmışsa
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Entreance;
                        mapToBarcodeDto.Data = "Modalife Giriş";
                    }
                    else if (lastBarcode.Entreance == true && lastBarcode.StartDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Exit && lastBarcode.EndDate == null)  // Sisteme giriş yapmışsa ve çıkış yapmak istiyorsa
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Exit;
                        mapToBarcodeDto.Data = "Modalife Çıkış";
                    }
                    else if (lastBarcode.Exit == true && lastBarcode.EndDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Exit)  // Sistemden çıkış yapmışsa
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Exit;
                        return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Çıkış işlemi öncesinde yapıldı." };
                    }
                    else if (lastBarcode.Entreance == true && lastBarcode.StartDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Default && lastBarcode.Exit == null && lastBarcode.EndDate == null) // Profil sayfasında istek attığında giriş yapılmışsa
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Entreance;
                        return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsWarning };
                    }
                    else if (lastBarcode.Exit == true && lastBarcode.EndDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Default) // Profil sayfasında istek attığında çıkış yapılmışsa
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Exit;
                        return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsWarning };
                    }
                    else if (lastBarcode.Exit == true && lastBarcode.EndDate != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Default && DateTime.Now.Date > lastBarcode.EndDate) // Profil sayfasındayken bir sonraki güne geçtiğinde Giriş veya çıkış yapılmadı yazısını yaz
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Default;
                        return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Lütfen giriş yapın" };
                    }
                    else
                    {
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata oluştu" };
                    }
                    return new ServiceResult<BarcodeDto> { Result = mapToBarcodeDto, ResponseStatus = ResponseStatus.IsSuccess };
                }
                else
                {
                    if (barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Entreance)
                    {
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsSuccess }; // Burasının ResponseStatus 'u Success olmalı çünkü barkod yoksa oluşturması gerekir
                    }
                    else
                    {
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Sunucuda barkod bilgisi bulunamadı" };
                    }
                }
            }
            else
            {
                return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Gönderilen barkod bilgilerinde hata oluştu" };
            }
        }
        public async Task<ServiceResult<BarcodeDto>> BarcodeReadAsync(BarcodeDto barcodeDto)
        {
            var barcodeStatus =                                                                     // gönderilen barkod bilgileri varsa ve kullanıcı id si var mı
                 barcodeDto != null &&
                 barcodeDto.BarcodeReadEnum.HasValue &&
                 barcodeDto.Data != null &&
                 barcodeDto.LoginDto.UserDto.Id > 0;

            var user = await _userDal.GetAsync(x => barcodeStatus && barcodeDto != null && x.Id == barcodeDto.LoginDto.UserDto.Id);  // barkod bilgileri varsa kullanıcı bilgilerini al
            var store = await _storeDal.GetAsync(x => x.Id == user.StoreId);

            var locationStatus = barcodeDto?.LocationDto != null &&
                barcodeDto.LocationDto.Longitude != null &&
                barcodeDto.LocationDto.Latitude != null &&
                barcodeDto.LocationDto.AreaControl != null;

            var device = await _deviceDal.GetAsync(x => x.UserId == user.Id && !x.IsDeleted);
            var deviceStatus = user != null && user.Id > 0 && device?.DeviceBrand != null && device.DeviceModelName != null;       // veritabanında kullanıcı bilgileri ve frontend den gönderilen cihaz bigileri var mı

            if (barcodeStatus && locationStatus && deviceStatus)
            {
                var mapToBarcodeDto = new BarcodeDto();

                var barcode = await _barcodeDal.GetAllAsync(x => barcodeDto != null && x.UserId == barcodeDto.LoginDto.UserDto.Id && x.StartDate != null && x.StartDate.Value.Date == DateTime.Now.Date);
                var lastBarcode = barcode.LastOrDefault();
                var barcodeEntity = new Barcode();
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                barcodeEntity.UserId = barcodeDto?.LoginDto.UserDto.Id;
                barcodeEntity.Longtitude = barcodeDto?.LocationDto?.Longitude;
                barcodeEntity.Latitude = barcodeDto?.LocationDto?.Latitude;
                barcodeEntity.AreaControl = barcodeDto?.LocationDto?.AreaControl;
                barcodeEntity.ApprovingAuthorityId = user!=null ? user.Id : 0;

                if ((lastBarcode == null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Entreance) || (lastBarcode != null && barcodeDto != null && lastBarcode.Entreance == true && lastBarcode.Exit == true && barcodeDto.BarcodeReadEnum!=BarcodeReadEnum.Exit))    // ilk defa giriş yapıyorsa                                                                
                {
                    barcodeEntity.Entreance = true;
                    barcodeEntity.StartDate = DateTime.Now;
                    barcodeEntity.DeviceId = device?.Id;

                    var distance = CalculateDistance(barcodeDto.LocationDto.Latitude, barcodeDto.LocationDto.Longitude, barcodeDto.StoreDto.StoreLocation.Latitude, barcodeDto.StoreDto.StoreLocation.Longitude);
                    if (distance.HasValue && distance != 0 && barcodeDto.StoreDto.Radius != 0 && distance <= barcodeDto.StoreDto.Radius)
                    {
                        barcodeDto.LocationDto.AreaControl = true;      // barkodu okutan alan içinde 
                        barcodeEntity.AreaControl = true;
                    }
                    else
                    {
                        barcodeDto.LocationDto.AreaControl = false;       // barkodu okutan alan dışında 
                        barcodeEntity.AreaControl = false;
                    }

                    var addedEntity = await _barcodeDal.AddAsync(barcodeEntity);
                    if (addedEntity != null && addedEntity.Id > 0)
                    {
                        if (user != null)                           // Kullanıcı barkodu okuttuğunda sistemden silinemesin(Pasife alınırsa silinebilsin)
                        {
                            user.IsActive = true;
                            await _userDal.UpdateAsync(user);
                        }

                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Entreance;
                        mapToBarcodeDto.Data = "Modalife Giriş";
                        mapToBarcodeDto.Id = addedEntity.Id;
                        var storeEntity = await _storeDal.GetAsync(x => user != null && x.Id == user.StoreId);
                        var roleEntity = await _roleDal.GetAsync(x => user != null && x.Id == user.RoleId && !x.IsDeleted);

                        mapToBarcodeDto.LoginDto = user?.Id > 0 ? new LoginDto
                        {
                            IsLoggedIn = barcodeDto.LoginDto.IsLoggedIn,
                            RoleDto = new RoleDto
                            {
                                Id = user.RoleId,
                                IsActive = roleEntity != null,
                                RoleName = user.RoleName
                            },
                            UserDto = new UserDto
                            {
                                CreateTime = user.CreateTime,
                                DeleteTime = user.DeleteTime,
                                Email = user.Email,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Gender = user.Gender,
                                Id = user.Id,
                                Password = user.Password,
                                UpdateTime = user.UpdateTime,
                                UserName = user.UserName,
                            }
                        } : new LoginDto();
                        mapToBarcodeDto.StoreDto = new StoreDto
                        {
                            Id = storeEntity.Id,
                            IsActive = storeEntity.IsActive,
                            StoreLocation = new StoreLocationDto
                            {
                                Latitude = storeEntity.Latitude,
                                Longitude = storeEntity.Longitude,
                                LatitudeDelta = storeEntity.LatitudeDelta,
                                LongitudeDelta = storeEntity.LongitudeDelta
                            },
                            Radius = storeEntity.Radius,
                            StoreName = storeEntity.StoreName,
                            StoreTime = new TimeDto
                            {
                                StartDate = storeEntity.StartDate.HasValue ? storeEntity.StartDate.Value.ToString("HH:mm") : null,
                                EndDate = storeEntity.EndDate.HasValue ? storeEntity.EndDate.Value.ToString("HH:mm") : null
                            }
                        };
                        mapToBarcodeDto.LocationDto = new LocationDto { Latitude = addedEntity.Latitude, Longitude = addedEntity.Longtitude, AreaControl = addedEntity.AreaControl };
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsSuccess, Result = mapToBarcodeDto, ResponseMessage = "Giriş işlemi başarılı" };
                    }
                    else
                    {
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu emre" };
                    }
                }
                else if (lastBarcode != null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Exit)       // Barkod okutulmuşsa ve çıkış işlemi yapılıyorsa güncelleme yapılacak
                {
                    if (lastBarcode!=null && lastBarcode.Id > 0 && lastBarcode.Exit == true && barcodeDto.BarcodeReadEnum == BarcodeReadEnum.Exit && lastBarcode.EndDate != null)
                    {
                        return new ServiceResult<BarcodeDto> { ResponseMessage = "Çıkış işlemini tekrar yapmanıza gerek yok", ResponseStatus = ResponseStatus.IsWarning };
                    }

                    var isUserOffShift = lastBarcode!=null &&  lastBarcode.EndDate == null && user != null && user.EndTime != null && DateTime.Now.TimeOfDay < user.EndTime.Value.ToTimeSpan();
                    // yukarıdaki kodda saatleri barcode'un önce gününü kontrol et eğer gün uyuşuyorsa saatini ve kullanıcının saatini kontrol et eğer barcode un saati yoksa yani çıkış yapmamışsa 

                    if (isUserOffShift && barcodeDto.Data != "isUserOffShift")
                    {
                        mapToBarcodeDto.StoreDto = barcode != null && barcodeDto.StoreDto != null ? barcodeDto.StoreDto : new StoreDto();
                        mapToBarcodeDto.StoreDto.StoreLocation = barcode != null && barcodeDto.StoreDto != null && barcodeDto.StoreDto.StoreLocation != null ? barcodeDto.StoreDto.StoreLocation : new StoreLocationDto();
                        mapToBarcodeDto.StoreDto.StoreTime = barcodeDto.StoreDto != null && barcodeDto.StoreDto.StoreTime != null ? barcodeDto.StoreDto.StoreTime : new TimeDto();
                        mapToBarcodeDto.LocationDto = barcode != null && barcodeDto.LocationDto != null ? barcodeDto.LocationDto : new LocationDto();
                        mapToBarcodeDto.LoginDto = barcode != null && barcodeDto.LoginDto != null ? barcodeDto.LoginDto : new LoginDto();
                        mapToBarcodeDto.LoginDto.UserDto = barcodeDto != null && barcodeDto.LoginDto != null && barcodeDto.LoginDto.UserDto != null ? barcodeDto.LoginDto.UserDto : new UserDto();
                        mapToBarcodeDto.LoginDto.RoleDto = barcodeDto != null && barcodeDto.LoginDto != null && barcodeDto.LoginDto.RoleDto != null ? barcodeDto.LoginDto.RoleDto : new RoleDto();
                        mapToBarcodeDto.Data = "isUserOffShift";
                        return new ServiceResult<BarcodeDto> { ResponseMessage = "Vardiyanız dolmadan çıkış işlemi yapmak üzeresiniz.Çıkış yapmak istediğinizden emin misiniz ?", ResponseStatus = ResponseStatus.IsWarning, Result = mapToBarcodeDto };
                    }
                    lastBarcode.Exit = true;
                    lastBarcode.EndDate = DateTime.Now;

                    var distance = CalculateDistance(barcodeDto.LocationDto.Latitude, barcodeDto.LocationDto.Longitude, barcodeDto.StoreDto.StoreLocation.Latitude, barcodeDto.StoreDto.StoreLocation.Longitude);
                    if (distance.HasValue && distance != 0 && barcodeDto.StoreDto.Radius != 0 && distance <= barcodeDto.StoreDto.Radius)
                    {
                        barcodeDto.LocationDto.AreaControl = true;
                        lastBarcode.AreaControl = true;
                    }
                    else
                    {
                        barcodeDto.LocationDto.AreaControl = false;
                        lastBarcode.AreaControl = false;
                    }

                    var updateEntity = await _barcodeDal.UpdateAsync(lastBarcode);
                    if (updateEntity)
                    {
                        mapToBarcodeDto.BarcodeReadEnum = BarcodeReadEnum.Exit;
                        mapToBarcodeDto.Data = "Modalife Çıkış";
                        mapToBarcodeDto.Id = lastBarcode.Id;
                        mapToBarcodeDto.LoginDto = new LoginDto
                        {
                            IsLoggedIn = barcodeDto.LoginDto.IsLoggedIn,
                            RoleDto = new RoleDto
                            {
                                Id = user != null ? user.RoleId : 0,
                                //IsActive = roleEntity == null ? false : true,   // burayı kontrol et
                                IsActive = true,
                                RoleName = user != null ? user.RoleName : ""
                            },
                            UserDto = new UserDto
                            {
                                CreateTime = user?.CreateTime,
                                DeleteTime = user?.DeleteTime,
                                UpdateTime = user?.UpdateTime,
                                Email = user?.Email ?? "",
                                FirstName = user?.FirstName ?? "",
                                LastName = user?.LastName ?? "",
                                Gender = user?.Gender ?? "",
                                Id = user?.Id ?? 0,
                                Password = user?.Password ?? "",
                                UserName = user?.UserName ?? ""
                            }
                        };
                        mapToBarcodeDto.LocationDto = new LocationDto { Latitude = lastBarcode.Latitude, Longitude = lastBarcode.Longtitude };
                        mapToBarcodeDto.StoreDto = new StoreDto
                        {
                            Id = lastBarcode.Id,
                            IsActive = store.IsActive,
                            Radius = store.Radius,
                            StoreName = store.StoreName,
                            StoreLocation = new StoreLocationDto
                            {
                                Longitude = store.Longitude,
                                LatitudeDelta = store.LatitudeDelta,
                                Latitude = store.Latitude,
                                LongitudeDelta = store.LongitudeDelta
                            },
                            StoreTime = new TimeDto
                            {
                                EndDate = store.EndDate.HasValue ? store.EndDate.Value.ToString("HH:mm") : null,
                                StartDate = store.StartDate.HasValue ? store.StartDate.Value.ToString("HH:mm") : null,
                            }
                        };
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsSuccess, Result = mapToBarcodeDto, ResponseMessage = "Çıkış işlemi başarılı" };
                    }
                    else
                    {
                        return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Barkod Güncelleme Hatası" };
                    }
                }
                else if ((barcode != null || lastBarcode?.Entreance == null) && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Exit)
                {
                    return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Giriş işleminiz olmadığından çıkış yapamazsınız" };
                }
                else if (barcode != null && lastBarcode.Entreance==true && lastBarcode.Exit==null && barcodeDto?.BarcodeReadEnum == BarcodeReadEnum.Entreance)
                {
                    return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Giriş işlemini tekrar yapmanıza gerek yok" };
                }
                else
                {
                    barcodeEntity.Entreance = false;
                    return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu cane" };
                }
            }
            else
            {
                return new ServiceResult<BarcodeDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Barkod verisi yok" };
            }
        }
        public static double? CalculateDistance(double? lat1, double? lon1, double lat2, double? lon2)
        {
            const double R = 6371000; // Dünya'nın yarıçapı (metre cinsinden)
            static double ToRadians(double degree) => (degree * Math.PI) / 180;

            double? dLat = lat1.HasValue ? ToRadians(lat2 - lat1.Value) : (double?)null;
            double? dLon = lon1.HasValue && lon2.HasValue ? ToRadians(lon2.Value - lon1.Value) : (double?)null;

            double? a = dLat.HasValue && dLon.HasValue
                ? Math.Sin(dLat.Value / 2) * Math.Sin(dLat.Value / 2) +
                  Math.Cos(ToRadians(lat1.Value)) *
                  Math.Cos(ToRadians(lat2)) *
                  Math.Sin(dLon.Value / 2) *
                  Math.Sin(dLon.Value / 2)
                : (double?)null;

            double? c = a.HasValue ? 2 * Math.Atan2(Math.Sqrt(a.Value), Math.Sqrt(1 - a.Value)) : (double?)null;

            return c.HasValue ? R * c.Value : (double?)null; // Mesafeyi metre cinsinden döndürür
        }
    }
}
