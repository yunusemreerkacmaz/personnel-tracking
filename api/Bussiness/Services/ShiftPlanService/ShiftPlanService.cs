using Bussiness.ServiceResults;
using Bussiness.Services.ShiftPlanService.Dtos;
using DataAccess.Abstract;
using DataAccess.Concrete;
using Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bussiness.Services.ShiftPlanService
{
    public interface IShiftPlanService
    {
        Task<ServiceResult<ShiftPlanDto>> CreateShiftPlan(ShiftPlanDto shiftPlanDto);
        Task<ServiceResult<ShiftPlanDto>> UpdateShiftPlan(ShiftPlanDto shiftPlanDto);
        Task<ServiceResult<ShiftPlanDto>> GetShiftPlansService(int UserId);

    }
    public class ShiftPlanService(IShiftPlanDal shiftPlanDal, IUserDal userDal) : IShiftPlanService
    {
        private readonly IShiftPlanDal _shiftPlanDal = shiftPlanDal;
        private readonly IUserDal _userDal = userDal;

        public async Task<ServiceResult<ShiftPlanDto>> GetShiftPlansService(int UserId)
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


            IQueryable<ShiftPlan>? shiftPlans = null;
            var shiftPlanDto = new ShiftPlanDto();
            var startOfWeek = mondayDate;                        //  26.05.2025 - Pazartesi
            var endOfWeek = mondayDate;         //  01.05.2025 - Pazar
            if (UserId == 1)
            {
                endOfWeek = mondayDate.Value.AddDays(6);         //  01.05.2025 - Pazar
                shiftPlans = _shiftPlanDal.GetAllQueryAble(x => !x.IsDeleted && x.CreateTime >= startOfWeek && x.CreateTime <= endOfWeek);
            }
            else
            {
                endOfWeek = mondayDate.Value.AddDays(27);         //  01.05.2025 - Pazar
                shiftPlans = _shiftPlanDal.GetAllQueryAble(x => !x.IsDeleted && x.CreateTime >= startOfWeek && x.CreateTime <= endOfWeek && x.UserId == UserId);
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
                            UserId = shiftPlan.UserId,
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
        public async Task<ServiceResult<ShiftPlanDto>> CreateShiftPlan(ShiftPlanDto shiftPlanDto)
        {
            //if (shiftPlanDto != null)
            //{
            //    TimeSpan? rangeTime = null;
            //    string? result = null;
            //    if (shiftPlanDto.TableBody.Monday != null && (shiftPlanDto.Monday != "Ücretsiz İzin" || shiftPlanDto.Monday != "Ücretli İzin" || shiftPlanDto.Monday != "Yıllık İzin" || shiftPlanDto.Monday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Monday);
            //    }
            //    if (shiftPlanDto.Tuesday != null && (shiftPlanDto.Tuesday != "Ücretsiz İzin" || shiftPlanDto.Tuesday != "Ücretli İzin" || shiftPlanDto.Tuesday != "Yıllık İzin" || shiftPlanDto.Tuesday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Tuesday);
            //    }
            //    if (shiftPlanDto.Wednesday != null && (shiftPlanDto.Wednesday != "Ücretsiz İzin" || shiftPlanDto.Wednesday != "Ücretli İzin" || shiftPlanDto.Wednesday != "Yıllık İzin" || shiftPlanDto.Wednesday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Wednesday);
            //    }
            //    if (shiftPlanDto.Thursday != null && (shiftPlanDto.Thursday != "Ücretsiz İzin" || shiftPlanDto.Thursday != "Ücretli İzin" || shiftPlanDto.Thursday != "Yıllık İzin" || shiftPlanDto.Thursday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Thursday);
            //    }
            //    if (shiftPlanDto.Friday != null && (shiftPlanDto.Friday != "Ücretsiz İzin" || shiftPlanDto.Friday != "Ücretli İzin" || shiftPlanDto.Friday != "Yıllık İzin" || shiftPlanDto.Friday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Friday);
            //    }
            //    if (shiftPlanDto.Saturday != null && (shiftPlanDto.Saturday != "Ücretsiz İzin" || shiftPlanDto.Saturday != "Ücretli İzin" || shiftPlanDto.Saturday != "Yıllık İzin" || shiftPlanDto.Saturday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Saturday);
            //    }
            //    if (shiftPlanDto.Sunday != null && (shiftPlanDto.Sunday != "Ücretsiz İzin" || shiftPlanDto.Sunday != "Ücretli İzin" || shiftPlanDto.Sunday != "Yıllık İzin" || shiftPlanDto.Sunday != "Raporlu"))
            //    {
            //        rangeTime += CalculateTime(shiftPlanDto.Sunday);
            //    }
            //    if (rangeTime.HasValue)
            //    {
            //        result = $"{(int)rangeTime.Value.TotalHours:00}:{rangeTime.Value.Minutes:00}";
            //    }
            //    var shiftPlanEntity = new ShiftPlan
            //    {
            //        Id = 0,
            //        UserId = shiftPlanDto.UserId,
            //        IsDeleted = false,
            //        CreateTime = DateTime.Now,
            //        DeleteTime = null,
            //        UpdateTime = null,
            //        TotalTime = result,
            //        Monday = shiftPlanDto.Monday,
            //        Tuesday = shiftPlanDto.Tuesday,
            //        Wednesday = shiftPlanDto.Wednesday,
            //        Thursday = shiftPlanDto.Thursday,
            //        Friday = shiftPlanDto.Friday,
            //        Saturday = shiftPlanDto.Saturday,
            //        Sunday = shiftPlanDto.Sunday,
            //    };
            //    var entity = await _shiftPlanDal.AddAsync(shiftPlanEntity);
            //    if (entity != null)
            //    {
            //        return new ServiceResult<ShiftPlanDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Vardiya Ekleme İşlemi Başarılı" };
            //    }
            //    else
            //    {
            //        return new ServiceResult<ShiftPlanDto> { ResponseStatus = ResponseStatus.IsError };
            //    }
            //}
            //else
            //{
            //    return new ServiceResult<ShiftPlanDto> { ResponseStatus = ResponseStatus.IsError };
            //}

            return new ServiceResult<ShiftPlanDto> { ResponseStatus = ResponseStatus.IsError };   // Burayı sil
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


    }
}
