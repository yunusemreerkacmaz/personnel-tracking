using Bussiness.ServiceResults;
using Bussiness.Services.ShiftPlanService.Dtos;
using Bussiness.Services.UserService.Dtos;
using DataAccess.Abstract;
using Entity;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Bussiness.Services.ShiftPlanService
{
    public interface IShiftPlanService
    {
        Task<ServiceResult<CreateShiftDto>> CreateShiftPlanService(CreateShiftDto shiftPlanDto);
        Task<ServiceResult<ShiftPlanDto>> UpdateShiftPlan(ShiftPlanDto shiftPlanDto);
        Task<ServiceResult<ShiftPlanDto>> GetUserShiftPlansService(int UserId);
        Task<ServiceResult<TableBodyDto>> GetShiftPlansService();

        Task<ServiceResult<UserDto>> GetUsersService(FilterShiftPlanDto filterDto);

    }
    public class ShiftPlanService(IShiftPlanDal shiftPlanDal, IUserShiftPlanDal userShiftPlanDal, IUserDal userDal) : IShiftPlanService
    {
        private readonly IShiftPlanDal _shiftPlanDal = shiftPlanDal;
        private readonly IUserShiftPlanDal _userShiftPlanDal = userShiftPlanDal;
        private readonly IUserDal _userDal = userDal;

        public async Task<ServiceResult<ShiftPlanDto>> GetUserShiftPlansService(int UserId)
        {
            var date = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            DateTime? mondayDate = null;

            DayOfWeek dayName = date.DayOfWeek;
            if (dayName == DayOfWeek.Monday)
            {
                mondayDate = date;
            }
            else if (dayName == DayOfWeek.Tuesday)
            {
                mondayDate = date.AddDays(-1);
            }
            else if (dayName == DayOfWeek.Wednesday)
            {
                mondayDate = date.AddDays(-2);
            }
            else if (dayName == DayOfWeek.Thursday)
            {
                mondayDate = date.AddDays(-3);
            }
            else if (dayName == DayOfWeek.Friday)
            {
                mondayDate = date.AddDays(-4);
            }
            else if (dayName == DayOfWeek.Saturday)
            {
                mondayDate = date.AddDays(-5);
            }
            else if (dayName == DayOfWeek.Sunday)
            {
                mondayDate = date.AddDays(-6);
            }


            IQueryable<UserShiftPlan>? shiftPlans = null;
            var shiftPlanDto = new ShiftPlanDto();
            var startOfWeek = mondayDate;                        //  26.05.2025 - Pazartesi
            var endOfWeek = mondayDate;         //  01.05.2025 - Pazar
            if (UserId == 1)
            {
                endOfWeek = mondayDate.Value.AddDays(6);         //  01.05.2025 - Pazar
                shiftPlans = _userShiftPlanDal.GetAllQueryAble(x => !x.IsDeleted && x.CreateTime >= startOfWeek && x.CreateTime <= endOfWeek);
            }
            else
            {
                endOfWeek = mondayDate.Value.AddDays(27);         //  01.05.2025 - Pazar
                shiftPlans = _userShiftPlanDal.GetAllQueryAble(x => !x.IsDeleted && x.CreateTime >= startOfWeek && x.CreateTime <= endOfWeek && x.UserId == UserId);
            }
            var shiftPlansList = await shiftPlans.ToListAsync();
            TimeSpan? rangeTime = null;
            if (shiftPlans != null)
            {
                foreach (var shiftPlan in shiftPlansList)
                {
                    var user = await _userDal.GetAsync(x => x.Id.Equals(shiftPlan.UserId));
                    var totalHours = CalculateTime(shiftPlan.Monday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Tuesday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Wednesday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Thursday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Friday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Saturday).Value.Hours;
                    totalHours += CalculateTime(shiftPlan.Sunday).Value.Hours;

                    var totalMinutes = CalculateTime(shiftPlan.Monday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Tuesday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Wednesday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Thursday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Friday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Saturday).Value.Minutes;
                    totalMinutes += CalculateTime(shiftPlan.Sunday).Value.Minutes;

                    if (user is not null)
                    {
                        shiftPlanDto.TableBody.Add(new TableBodyDto
                        {
                            Id = shiftPlan.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            IsDeleted = shiftPlan.IsDeleted,
                            CreateTime = shiftPlan.CreateTime,
                            DeleteTime = shiftPlan.DeleteTime,
                            UpdateTime = shiftPlan.UpdateTime,
                            Monday = shiftPlan.Monday,
                            Tuesday = shiftPlan.Tuesday,
                            Wednesday = shiftPlan.Wednesday,
                            Thursday = shiftPlan.Thursday,
                            Friday = shiftPlan.Friday,
                            Saturday = shiftPlan.Saturday,
                            Sunday = shiftPlan.Sunday,
                            TotalTime = $"{totalHours}:{(totalMinutes == 0 ? "00" : totalMinutes.ToString("D2"))}"
                        });
                    }
                }

                shiftPlanDto.TableHeader.MondayDate = mondayDate;
                shiftPlanDto.TableHeader.TuesdayDate = mondayDate.Value.AddDays(1);
                shiftPlanDto.TableHeader.WednesdayDate = mondayDate.Value.AddDays(2);
                shiftPlanDto.TableHeader.ThursdayDate = mondayDate.Value.AddDays(3);
                shiftPlanDto.TableHeader.FridayDate = mondayDate.Value.AddDays(4);
                shiftPlanDto.TableHeader.SaturdayDate = mondayDate.Value.AddDays(5);
                shiftPlanDto.TableHeader.SundayDate = mondayDate.Value.AddDays(6);
                return new ServiceResult<ShiftPlanDto> { Result = shiftPlanDto, ResponseStatus = ResponseStatus.IsSuccess };
            }
            else
            {
                return new ServiceResult<ShiftPlanDto> { Result = shiftPlanDto, ResponseStatus = ResponseStatus.IsError };
            }
        }
        public async Task<ServiceResult<CreateShiftDto>> CreateShiftPlanService(CreateShiftDto shiftPlanDto)
        {
            var isHaveSameshift = await _shiftPlanDal.GetAsync(shift => shift.ShiftPlanName.ToLower().Trim().Equals(shiftPlanDto.ShiftPlanName.ToLower().Trim()));
            if (isHaveSameshift != null)
            {
                return new ServiceResult<CreateShiftDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Vardiya sistemde mevcut" };
            }

            if (!string.IsNullOrEmpty(shiftPlanDto.Permissions.Monday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Tuesday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Wednesday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Thursday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Friday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Saturday) &&
                !string.IsNullOrEmpty(shiftPlanDto.Permissions.Sunday)
                )
            {
                int totalHours = 0;
                int totalMinutes = 0;
                if (shiftPlanDto.Permissions.Monday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Monday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Monday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Tuesday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Tuesday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Tuesday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Wednesday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Wednesday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Wednesday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Thursday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Thursday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Thursday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Friday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Friday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Friday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Saturday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Saturday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Saturday).Value.Minutes;
                }
                if (shiftPlanDto.Permissions.Sunday.Contains("-"))
                {
                    totalHours += CalculateTime(shiftPlanDto.Permissions.Sunday).Value.Hours;
                    totalMinutes += CalculateTime(shiftPlanDto.Permissions.Sunday).Value.Minutes;
                }
                if (totalMinutes > 60)
                {
                    totalHours += totalMinutes / 60;
                    totalMinutes = totalMinutes % 60;
                }
                var shiftPlanEntity = new ShiftPlan
                {
                    Id = 0,
                    ShiftPlanName = shiftPlanDto.ShiftPlanName,
                    Monday = shiftPlanDto.Permissions.Monday,
                    Tuesday = shiftPlanDto.Permissions.Tuesday,
                    Wednesday = shiftPlanDto.Permissions.Wednesday,
                    Thursday = shiftPlanDto.Permissions.Thursday,
                    Friday = shiftPlanDto.Permissions.Friday,
                    Saturday = shiftPlanDto.Permissions.Saturday,
                    Sunday = shiftPlanDto.Permissions.Sunday,
                    CreateTime = DateTime.Now,
                    IsDeleted = false,
                    TotalShiftTime = $"{totalHours}:{(totalMinutes == 0 ? "00" : totalMinutes.ToString("D2"))}"
                };
                var entity = await _shiftPlanDal.AddAsync(shiftPlanEntity);
                if (entity != null)
                {
                    return new ServiceResult<CreateShiftDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Vardiya Ekleme İşlemi Başarılı" };
                }
                else
                {
                    return new ServiceResult<CreateShiftDto> { ResponseStatus = ResponseStatus.IsError };
                }
            }
            else
            {
                return new ServiceResult<CreateShiftDto> { ResponseStatus = ResponseStatus.IsError };
            }
        }

        public Task<ServiceResult<ShiftPlanDto>> UpdateShiftPlan(ShiftPlanDto shiftPlanDto)
        {
            throw new NotImplementedException();
        }

        private static TimeSpan? CalculateTime(string time)  // "09:00-18:00"
        {
            TimeSpan? result = null;
            if (time != null && time.Contains(':'))
            {
                string startTimeString = time.Split('-')[0];
                string endTimeString = time.Split('-')[1];
                DateTime startTime = DateTime.ParseExact(startTimeString, "HH:mm", CultureInfo.InvariantCulture);
                DateTime endTime = DateTime.ParseExact(endTimeString, "HH:mm", CultureInfo.InvariantCulture);
                //TimeSpan rangeTime = endTime - startTime;
                result = endTime - startTime;
            }
            else
            {
                result = new TimeSpan(00, 00, 00);
            }
            return result;

        }

        public async Task<ServiceResult<UserDto>> GetUsersService(FilterShiftPlanDto filterDto)
        {
            var users = await _userDal.GetAllAsync();
            var mapToUserDto = users.Select(user => new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Gender = user.Gender,
                Password = user.Password,
                CreateTime = user.CreateTime,
                DeleteTime = user.DeleteTime,
                PhoneNumber = user.PhoneNumber,
                UpdateTime = user.UpdateTime,
                UserName = user.UserName
            }).ToList();

            if (users.Count > 0)
            {
                return new ServiceResult<UserDto> { Results = mapToUserDto, ResponseStatus = ResponseStatus.IsSuccess };
            }
            else
            {
                return new ServiceResult<UserDto> { ResponseStatus = ResponseStatus.IsError };

            }
        }

        public async Task<ServiceResult<TableBodyDto>> GetShiftPlansService()
        {
            var shiftPlans = await _shiftPlanDal.GetAllAsync();
            var mapToShiftPlanDto = shiftPlans.Select(shift => new TableBodyDto
            {


                Id = shift.Id,
                ShiftPlanName = shift.ShiftPlanName,
                Monday = shift.Monday,
                Tuesday = shift.Tuesday,
                Wednesday = shift.Wednesday,
                Thursday = shift.Thursday,
                Friday = shift.Friday,
                Saturday = shift.Saturday,
                Sunday = shift.Sunday,
                IsDeleted = shift.IsDeleted,
                UpdateTime = shift.UpdateTime,
                CreateTime = shift.CreateTime,
                DeleteTime = shift.DeleteTime,
            }).ToList();
            return new ServiceResult<TableBodyDto> { Results = mapToShiftPlanDto, ResponseStatus = ResponseStatus.IsSuccess };

        }
    }
}
