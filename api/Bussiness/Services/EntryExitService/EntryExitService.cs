using Bussiness.Helper.Enums;
using Bussiness.ServiceResults;
using Bussiness.Services.EntryExitService.Dtos;
using DataAccess.Abstract;
using Entity;

namespace Bussiness.Services.EntryExitService
{
    public interface IEntryExitService
    {
        Task<ServiceResult<EntryExitDto>> EntryExitReadService(EntryExitDto entryExitDto);
        Task<ServiceResult<EntryExitDto>> EntryExitCheckService(EntryExitDto entryExitDto);
    }
    public class EntryExitService(IEntryExitDal entryExitDal, IDeviceDal deviceDal, IUserDal userDal, IStoreDal storeDal) : IEntryExitService
    {
        private readonly IEntryExitDal _entryExitDal = entryExitDal;
        private readonly IDeviceDal _deviceDal = deviceDal;
        private readonly IUserDal _userDal = userDal;
        private readonly IStoreDal _storeDal = storeDal;
        public async Task<ServiceResult<EntryExitDto>> EntryExitCheckService(EntryExitDto entryExitDto)
        {
            var locationStatus = entryExitDto?.LocationDto != null &&
               entryExitDto.LocationDto.Longitude != null &&
               entryExitDto.LocationDto.Latitude != null &&
               entryExitDto.LocationDto.AreaControl != null;

            var user = await _userDal.GetAsync(user => entryExitDto != null && user.Id == entryExitDto.UserId && user.IsActive && !user.IsDeleted);  // barkod bilgileri varsa kullanıcı bilgilerini al
            var device = await _deviceDal.GetAsync(device => device.UserId == user.Id && !device.IsDeleted);

            if (entryExitDto != null && locationStatus && user != null && device != null)
            {
                var entryExitRecords = await _entryExitDal.GetAllAsync(x => x.UserId == entryExitDto.UserId && (x.StartDate.HasValue && x.StartDate.Value.Date == DateTime.Now.Date) || (x.EndDate.HasValue && x.EndDate.Value.Date == DateTime.Now.Date));
                var lastRecord = entryExitRecords.LastOrDefault();
                entryExitDto.DeviceId = device.Id;
                entryExitDto.UserId = user.Id;
                entryExitDto.RoleId = user.RoleId;

                if (lastRecord == null)  // Herhangi bir giriş veya çıkış yapılmamışsa
                {
                    entryExitDto.BarcodeReadEnum = EntryExitEnum.Default;
                    entryExitDto.BiometricEnum = EntryExitEnum.Default;
                }
                else if (lastRecord != null && lastRecord.Entreance == true && lastRecord.Exit == false) // Giriş yapılmışsa 
                {
                    if (lastRecord.EntranceActionType == "Barkod")
                    {
                        entryExitDto.BarcodeReadEnum = EntryExitEnum.Entreance;
                        entryExitDto.BiometricEnum = null;
                    }
                    else if (lastRecord.EntranceActionType == "Biyometrik")
                    {
                        entryExitDto.BiometricEnum = EntryExitEnum.Entreance;
                        entryExitDto.BarcodeReadEnum = null;
                    }
                    else if (lastRecord.EntranceActionType == "Admin Onay")
                    {
                        entryExitDto.AdminApproveEnum = EntryExitEnum.Entreance;
                        entryExitDto.BarcodeReadEnum = null;
                    }
                    else
                    {
                        return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
                    }
                }
                else if (lastRecord != null && lastRecord.Entreance == true && lastRecord.Exit == true)  // Çıkış yapılmışsa
                {
                    if (lastRecord.ExitActionType == "Barkod")
                    {
                        entryExitDto.BarcodeReadEnum = EntryExitEnum.Exit;

                    }
                    else if (lastRecord.ExitActionType == "Biyometrik")
                    {
                        entryExitDto.BiometricEnum = EntryExitEnum.Exit;
                        entryExitDto.BarcodeReadEnum = null;
                    }
                    else if (lastRecord.EntranceActionType == "Admin Onay")
                    {
                        entryExitDto.AdminApproveEnum = EntryExitEnum.Exit;
                        entryExitDto.BarcodeReadEnum = null;
                    }
                    else
                    {
                        return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
                    }
                }
                else
                {
                    return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
                }
            }
            return new ServiceResult<EntryExitDto> { Result = entryExitDto, ResponseStatus = ResponseStatus.IsSuccess };
        }
        public async Task<ServiceResult<EntryExitDto>> EntryExitReadService(EntryExitDto entryExitDto)
        {
            var entryOrExitStatus =                                                                     // gönderilen barkod bilgileri varsa ve kullanıcı id si var mı
          entryExitDto != null &&
          (entryExitDto.BarcodeReadEnum != null || entryExitDto.BiometricEnum != null) &&
          entryExitDto.UserId > 0;

            var locationStatus = entryExitDto?.LocationDto != null &&
               entryExitDto.LocationDto.Longitude != null &&
               entryExitDto.LocationDto.Latitude != null;

            var user = await _userDal.GetAsync(user => entryOrExitStatus && user.Id == entryExitDto.UserId && user.IsActive && !user.IsDeleted);  // barkod bilgileri varsa kullanıcı bilgilerini al
            var device = await _deviceDal.GetAsync(device => device.UserId == user.Id && !device.IsDeleted);

            if (entryOrExitStatus && locationStatus && user != null && device != null)
            {
                var entryExitRecords = await _entryExitDal.GetAllAsync(x => x.UserId == entryExitDto.UserId && (x.StartDate.HasValue && x.StartDate.Value.Date == DateTime.Now.Date) || (x.EndDate.HasValue && x.EndDate.Value.Date == DateTime.Now.Date));
                var lastRecord = entryExitRecords.LastOrDefault();
                var store = await _storeDal.GetAsync(x => x.Id == user.StoreId && !x.IsDeleted && x.IsActive);
                var entity = new EntryExitRecord
                {
                    Id = lastRecord != null ? lastRecord.Id : 0,
                    UserId = user.Id,
                    RoleId = user.RoleId,
                    DeviceId = device.Id,
                    ApprovingAuthorityId = user.Id,
                    Latitude = entryExitDto.LocationDto.Latitude,
                    Longtitude = entryExitDto.LocationDto.Longitude
                };
                entryExitDto.UserId = user.Id;
                entryExitDto.RoleId = user.RoleId;
                entryExitDto.DeviceId = device.Id;
                var distance = CalculateDistance(entryExitDto.LocationDto.Latitude, entryExitDto.LocationDto.Longitude, store.Latitude, store.Longitude);

                if (distance.HasValue && distance != 0 && store.Radius != 0 && distance <= store.Radius)
                {
                    entryExitDto.LocationDto.AreaControl = true;      // barkodu okutan alan içinde 
                }
                else
                {
                    entryExitDto.LocationDto.AreaControl = false;       // barkodu okutan alan dışında 
                }

                if (lastRecord != null && lastRecord.Entreance && lastRecord.Exit==false && entryExitDto.BarcodeReadEnum == EntryExitEnum.Entreance)
                {
                    return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Giriş yapmıştınız" };
                }
                else if (lastRecord != null && lastRecord.Entreance && lastRecord.Exit && entryExitDto.BarcodeReadEnum == EntryExitEnum.Exit)
                {
                    return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Çıkış yapmıştınız" };
                }

                if ((lastRecord == null && (entryExitDto.BarcodeReadEnum == EntryExitEnum.Entreance || entryExitDto.BiometricEnum == EntryExitEnum.Entreance)) || (lastRecord != null && lastRecord.Exit == true && (entryExitDto.BarcodeReadEnum == EntryExitEnum.Entreance || entryExitDto.BiometricEnum == EntryExitEnum.Entreance))) // ilk defa giriş yapacaksa
                {
                    entity.Id = 0;
                    if (entryExitDto.BarcodeReadEnum == EntryExitEnum.Entreance)
                    {
                        entity.Entreance = true;
                        entity.StartDate = DateTime.Now;
                        entity.EntranceActionType = "Barkod";
                        entity.AreaControl = entryExitDto.LocationDto.AreaControl;
                    }
                    if (entryExitDto.BiometricEnum == EntryExitEnum.Entreance)
                    {
                        entity.Entreance = true;
                        entity.StartDate = DateTime.Now;
                        entity.EntranceActionType = "Biyometrik";
                        entity.AreaControl = entryExitDto.LocationDto.AreaControl;
                    }
                    var entryBarcode = await _entryExitDal.AddAsync(entity);
                    if (entryBarcode != null)
                    {
                        return new ServiceResult<EntryExitDto> { Result = entryExitDto, ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Giriş işlemi Başarılı" };
                    }
                    else
                    {
                        return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
                    }

                }
                else if (lastRecord != null && lastRecord.Entreance == true && lastRecord.Exit == false && (entryExitDto.BiometricEnum == EntryExitEnum.Exit || entryExitDto.BarcodeReadEnum == EntryExitEnum.Exit)) // Giriş yapılmışsa çıkış yapılmak isteniyorsa 
                {
                    if (entryExitDto.BarcodeReadEnum == EntryExitEnum.Exit)
                    {
                        lastRecord.Exit = true;
                        lastRecord.EndDate = DateTime.Now;
                        lastRecord.ExitActionType = "Barkod";
                        lastRecord.AreaControl = entryExitDto.LocationDto.AreaControl;
                    }
                    if (entryExitDto.BiometricEnum == EntryExitEnum.Exit)
                    {
                        lastRecord.Exit = true;
                        lastRecord.EndDate = DateTime.Now;
                        lastRecord.ExitActionType = "Biyometrik";
                        lastRecord.AreaControl = entryExitDto.LocationDto.AreaControl;
                        entryExitDto.BarcodeReadEnum = null;
                    }
                    var exitBarcode = await _entryExitDal.UpdateAsync(lastRecord);
                    if (exitBarcode)
                    {
                        return new ServiceResult<EntryExitDto> { Result = entryExitDto, ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Çıkış işlemi başarılı" };
                    }
                    else
                    {
                        return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
                    }
                }
                else if (lastRecord == null && entryExitDto.BarcodeReadEnum == EntryExitEnum.Exit)
                {
                    return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Giriş işlemi yapmadan çıkış işlemi yapamazsınız" };

                }
                else
                {
                    return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };

                }
            }
            else
            {
                return new ServiceResult<EntryExitDto> { ResponseStatus = ResponseStatus.IsError };
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
