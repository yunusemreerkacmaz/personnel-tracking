using Bussiness.ServiceResults;
using Bussiness.Services.Stores.Dtos;
using Bussiness.Token;
using DataAccess.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Bussiness.Services.Stores
{
    public interface IStoreService
    {
        Task<ServiceResult<StoreDto>> GetStores();
        Task<ServiceResult<StoreDto>> AddStore(StoreDto storeDto);
        Task<ServiceResult<StoreDto>> DeleteStore(List<StoreDto> storeDto);
        Task<ServiceResult<StoreDto>> UpdateStore(StoreDto storeDto);
    }
    public class StoreService(IStoreDal storeDal, IUserDal userDal, IHttpContextAccessor httpContextAccessor) : IStoreService
    {
        private readonly IStoreDal _storeDal = storeDal;
        private readonly IUserDal _userDal = userDal;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        public async Task<ServiceResult<StoreDto>> AddStore(StoreDto storeDto)
        {
            if (!string.IsNullOrEmpty(storeDto.StoreName) && storeDto.StoreTime.StartDate != null && storeDto.StoreTime.EndDate != null)
            {
                var isHaveStore = await _storeDal.GetAsync(x => x.StoreName != null && x.StoreName.ToLower().Trim() == storeDto.StoreName.ToLower().Trim());
                if (isHaveStore == null)
                {
                    var mapToStoreEntity = new Store
                    {
                        StoreName = storeDto.StoreName,
                        CreateTime = DateTime.Now,
                        StartDate = TimeOnly.Parse(storeDto.StoreTime.StartDate),
                        EndDate = TimeOnly.Parse(storeDto.StoreTime.EndDate),
                        Latitude = storeDto.StoreLocation.Latitude,
                        Longitude = storeDto.StoreLocation.Longitude,
                        LatitudeDelta = storeDto.StoreLocation.LatitudeDelta,
                        LongitudeDelta = storeDto.StoreLocation.LongitudeDelta,
                        Radius = storeDto.Radius
                    };
                    var addedStore = await _storeDal.AddAsync(mapToStoreEntity);
                    if (addedStore != null && addedStore.Id > 0)
                    {
                        return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Kurum Başarıyla Kaydedildi" };
                    }
                    else
                    {
                        return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kaydedilirken Hata Oluştu" };
                    }
                }
                else
                {
                    return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Kurum Sistemde mevcut olduğundan kayıt işlemi yapılamadı" };
                }
            }
            else
            {
                return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
            }
        }
        public async Task<ServiceResult<StoreDto>> DeleteStore(List<StoreDto> storeDtos)
        {
            var storeDtosIds = storeDtos.Select(x => x.Id);
            var stores = await _storeDal.GetAllAsync(x => !x.IsDeleted && storeDtosIds.Any(i => i == x.Id));
            var ishaveUsersThatStores = _userDal.GetAllQueryAble(x => storeDtosIds.Any(i => i == x.StoreId)); // Kullancılar tablosunda böyle bir bu mağaza id sine sahip birisi var mı
            int allDeletedNumber = 0;

            if (storeDtosIds.Any())
            {
                if (!ishaveUsersThatStores.Any())
                {
                    foreach (var store in stores)
                    {
                        store.IsDeleted = true;
                        store.DeleteTime = DateTime.Now;
                        var deletedStoreStatus = await _storeDal.UpdateAsync(store);

                        if (!deletedStoreStatus)
                        {
                            allDeletedNumber += 1;
                        }
                    }
                    if (storeDtosIds.Count() == allDeletedNumber)
                    {
                        return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Tüm Silme işlemi başarılı" };
                    }
                    else if (storeDtosIds.Count() > allDeletedNumber)
                    {
                        return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = $"{storeDtosIds.Count()} mağazadan {allDeletedNumber} tanesi silindi." };
                    }
                    else
                    {
                        return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Silme işleminde hata oluştu" };
                    }
                }
                else
                {
                    return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Mağaza sistemde aktif olarak kullanılıyor.Silinemez" };
                }
            }
            else
            {
                return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Hata Oluştu" };
            }
        }
        public async Task<ServiceResult<StoreDto>> GetStores()
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

            var stores = _storeDal.GetAllQueryAble(store => !store.IsDeleted ).Where(x => getUser.RoleId == 1 || x.Id == getUser.StoreId && x.Id != getUser.Id); // admin tümünü görsün mağaza yöneticileri sadece kendi mağazalarını görsün
            var storeList = new List<StoreDto>();
            
            if (stores.Any())
            {
                foreach (var store in stores)
                {
                    string showStartDateHour = store.StartDate.HasValue ? (store.StartDate.Value.Hour < 10 ? "0" + store.StartDate.Value.Hour.ToString() : store.StartDate.Value.Hour.ToString()) : "";
                    string showStartDateMinute = store.StartDate.HasValue ? (store.StartDate.Value.Minute < 10 ? "0" + store.StartDate.Value.Minute.ToString() : store.StartDate.Value.Minute.ToString()) : "";
                    string resultShowStartDateHourAndMinute = showStartDateHour + ":" + showStartDateMinute;

                    string showEndDateHour = store.EndDate.HasValue ? (store.EndDate.Value.Hour < 10 ? "0" + store.EndDate.Value.Hour.ToString() : store.EndDate.Value.Hour.ToString()) : "";
                    string showEndDateMinute = store.EndDate.HasValue ? (store.EndDate.Value.Minute < 10 ? "0" + store.EndDate.Value.Minute.ToString() : store.EndDate.Value.Minute.ToString()) : "";
                    string resultShowEndDateHourAndMinute = showEndDateHour + ":" + showEndDateMinute;

                    var storeDto = new StoreDto
                    {
                        Id = store.Id,
                        StoreName = store.StoreName,
                        IsActive = store.IsActive,
                        StoreLocation = new StoreLocationDto { Latitude = store.Latitude, Longitude = store.Longitude, LatitudeDelta = store.LatitudeDelta, LongitudeDelta = store.LongitudeDelta },
                        Radius = store.Radius,
                        StoreTime = new TimeDto
                        {
                            EndDate = store.EndDate.HasValue ? store.EndDate.Value.ToString("HH:mm") : null,
                            StartDate = store.StartDate.HasValue ? store.StartDate.Value.ToString("HH:mm") : null,
                        },
                    };
                    storeList.Add(storeDto);
                }
                storeList = [.. storeList.OrderByDescending(x => x.Id)];

                return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = storeList };
            }
            else
            {
                return new ServiceResult<StoreDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Lokasyon Verileri getirilemedi" };
            }
        }
        public async Task<ServiceResult<StoreDto>> UpdateStore(StoreDto storeDto)
        {
            var store = await _storeDal.GetAsync(x => storeDto.Id > 0 && x.Id == storeDto.Id);
            if (store != null && storeDto.StoreTime.StartDate != null && storeDto.StoreTime.EndDate != null && store.Id > 0)
            {
                store.StoreName = storeDto.StoreName;
                store.StartDate = TimeOnly.Parse(storeDto.StoreTime.StartDate);
                store.EndDate = TimeOnly.Parse(storeDto.StoreTime.EndDate);
                store.Longitude = storeDto.StoreLocation.Longitude;
                store.Latitude = storeDto.StoreLocation.Latitude;
                store.Radius = storeDto.Radius;
                store.UpdateTime = DateTime.Now;
                var updateStatus = await _storeDal.UpdateAsync(store);
                if (updateStatus)
                {
                    return new ServiceResult<StoreDto> { ResponseMessage = "Güncelleme İşlemi Başarılı", ResponseStatus = ResponseStatus.IsSuccess };
                }
                else
                {
                    return new ServiceResult<StoreDto> { ResponseMessage = "Güncelleme işleminde hata oluştu", ResponseStatus = ResponseStatus.IsError };
                }
            }
            else
            {
                return new ServiceResult<StoreDto> { ResponseMessage = "Veri Sistemde Bulunamadı", ResponseStatus = ResponseStatus.IsError };
            }
        }
    }
}
