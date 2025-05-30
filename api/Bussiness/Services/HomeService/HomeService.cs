using Bussiness.Helper.Dtos;
using Bussiness.Helper.Enums;
using Bussiness.ServiceResults;
using Bussiness.Services.HomeService.Dtos;
using DataAccess.Abstract;
using Microsoft.EntityFrameworkCore;

namespace Bussiness.Services.HomeService
{
    public interface IHomeService
    {
        Task<ServiceResult<DataGridDto<PersonnelDto>>> GetPersonnelIO(PaginationDto pagination); // personnel giriş ve çıkışlarını getir   
    }
    public class HomeService(IEntryExitDal entryExitDal) : IHomeService
    {
        private readonly IEntryExitDal _entryExitDal = entryExitDal;
        public async Task<ServiceResult<DataGridDto<PersonnelDto>>> GetPersonnelIO(PaginationDto pagination)
        {
            var date = DateTime.Now;
            int lastDay = DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month); // 29 ,30,31

            var startOfMonth = new DateTime(date.Year, date.Month, 1);                  //  01.05.2025
            var endOfMount = new DateTime(date.Year, date.Month, lastDay).AddMonths(3); //  31.08.2025

            var entryExitRecords = _entryExitDal.GetAllQueryAble(record => record.UserId == pagination.LoginDto.UserDto.Id && ((record.StartDate == null || record.StartDate >= startOfMonth) && (record.EndDate == null || record.EndDate <= endOfMount)));  // 3 aylık veriyi çekiyorum
            if (pagination.FilterDto != null)
            {
                string entryTypeString = ExitEntryConvert.EnumConvertToString(pagination.FilterDto.EntryTypeEnum);
                string exitTypeString = ExitEntryConvert.EnumConvertToString(pagination.FilterDto.ExitTypeEnum);

                TimeSpan? startTime = null;
                TimeSpan? endTime = null;

                if (pagination.FilterDto.TimeDto != null && !string.IsNullOrEmpty(pagination.FilterDto.TimeDto.StartDate))
                {
                    int startHour = int.Parse(pagination.FilterDto.TimeDto.StartDate.Split(':')[0]);
                    int startMinute = int.Parse(pagination.FilterDto.TimeDto.StartDate.Split(':')[1]);
                    startTime = new TimeSpan(startHour, startMinute, 0);
                }

                if (pagination.FilterDto.TimeDto != null && !string.IsNullOrEmpty(pagination.FilterDto.TimeDto.EndDate))
                {

                    int endHour = int.Parse(pagination.FilterDto.TimeDto.EndDate.Split(':')[0]);
                    int endMinute = int.Parse(pagination.FilterDto.TimeDto.EndDate.Split(':')[1]);
                    endTime = new TimeSpan(endHour, endMinute, 0);
                }

                var start = pagination.FilterDto.DateRangeDto?.StartDate?.Date;
                var end = pagination.FilterDto.DateRangeDto?.EndDate?.Date;

                entryExitRecords = entryExitRecords
                    .Where(record =>
                    (start == null && end == null) ||

                    // Sadece StartDate varsa
                    (start != null && end == null &&
                     record.StartDate.HasValue &&
                     record.StartDate.Value >= start.Value &&
                     record.StartDate.Value < start.Value.AddDays(1)) ||

                    // Sadece EndDate varsa
                    (start == null && end != null &&
                     record.EndDate.HasValue &&
                     record.EndDate.Value >= end.Value &&
                     record.EndDate.Value < end.Value.AddDays(1)) ||

                    // İkisi de varsa ve karşılaştırılabiliyorsa
                    (start != null && end != null &&
                     (
                       (record.StartDate.HasValue &&
                        record.StartDate.Value >= start.Value &&
                        record.StartDate.Value <= end.Value.AddDays(1))
                       ||
                       (record.EndDate.HasValue &&
                        record.EndDate.Value >= start.Value &&
                        record.EndDate.Value <= end.Value.AddDays(1))
                     )
                    )
                )
                        // Giriş ve çıkış tipi varsa 
                        .Where(record => string.IsNullOrEmpty(entryTypeString) || record.EntranceActionType == entryTypeString)
                        .Where(record => string.IsNullOrEmpty(exitTypeString) || record.ExitActionType == exitTypeString)

                            // Saat aralığı varsa 
                            //.Where(record =>
                            //        (startTime == null || (record.StartDate.HasValue && record.StartDate.Value.TimeOfDay >= startTime)) &&
                            //        (endTime == null || (record.EndDate.HasValue && record.EndDate.Value.TimeOfDay <= endTime)))

                            .Where(record =>
                                (startTime == null || endTime == null) || (record.StartDate.HasValue && record.StartDate.Value.TimeOfDay >= startTime && record.EndDate.HasValue && record.EndDate.Value.TimeOfDay <= endTime))

                         // sadece başlangıç saati varsa
                         .Where(record => pagination.FilterDto.TimeDto == null ||
                              (pagination.FilterDto.TimeDto != null && string.IsNullOrEmpty(pagination.FilterDto.TimeDto.StartDate)) ||
                              (pagination.FilterDto.TimeDto != null && !string.IsNullOrEmpty(pagination.FilterDto.TimeDto.EndDate)) ||
                              (pagination.FilterDto.TimeDto != null && record.StartDate.HasValue && startTime != null && record.StartDate.Value.TimeOfDay.Hours == startTime.Value.Hours && record.StartDate.Value.TimeOfDay.Minutes == startTime.Value.Minutes))

                        // sadece biitş saati varsa
                        .Where(record => pagination.FilterDto.TimeDto == null ||
                              (pagination.FilterDto.TimeDto != null && string.IsNullOrEmpty(pagination.FilterDto.TimeDto.EndDate)) ||
                              (pagination.FilterDto.TimeDto != null && !string.IsNullOrEmpty(pagination.FilterDto.TimeDto.StartDate)) ||
                              (pagination.FilterDto.TimeDto != null && record.EndDate.HasValue && endTime != null && record.EndDate.Value.TimeOfDay.Hours == endTime.Value.Hours && record.EndDate.Value.TimeOfDay.Minutes == endTime.Value.Minutes))
                    ;

            }

            var entryExitRecordMapToPersonelDto = await entryExitRecords.OrderByDescending(x => x.Id).Select(record => new PersonnelDto
            {
                Id = record.Id,
                Entrance = record.Entreance,
                Exit = record.Exit,
                EntranceTypeEnum = ExitEntryConvert.StringConvertToEnum(record.EntranceActionType),
                ExitTypeEnum = ExitEntryConvert.StringConvertToEnum(record.ExitActionType),
                DateRangeDto = new DateRangeDto
                {
                    StartDate = record.StartDate,
                    EndDate = record.EndDate
                }
            }).ToListAsync();

            var result = new DataGridDto<PersonnelDto>
            {
                Inputs = entryExitRecordMapToPersonelDto,
                Pagination = new PaginationDto
                {
                    Page = pagination.Page,
                    PageSize = pagination.PageSize,
                    LoginDto = pagination.LoginDto,
                    Total = entryExitRecordMapToPersonelDto.Count,
                }
            };
            result.Inputs = [.. result.Inputs.Skip((pagination.Page) * pagination.PageSize).Take(pagination.PageSize)];
            result.Pagination.From = pagination.Page * pagination.PageSize + 1;
            result.Pagination.To = Math.Min((pagination.Page + 1) * pagination.PageSize, result.Pagination.Total);
            result.Pagination.FilterDto = pagination.FilterDto;
            if (result.Inputs.Count > 0)
            {
                return new ServiceResult<DataGridDto<PersonnelDto>> { ResponseStatus = ResponseStatus.IsSuccess, Result = result };
            }
            else
            {
                return new ServiceResult<DataGridDto<PersonnelDto>> { Result = result, ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Tabloda gösterilecek veriniz yok" };
            }
        }
    }
}
