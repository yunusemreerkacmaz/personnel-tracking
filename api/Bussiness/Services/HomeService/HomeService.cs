using Bussiness.Helper.Dtos;
using Bussiness.ServiceResults;
using Bussiness.Services.HomeService.Dtos;
using DataAccess.Abstract;

namespace Bussiness.Services.HomeService
{
    public interface IHomeService
    {
        Task<ServiceResult<DataGridDto<PersonnelDto>>> GetPersonnelIO(PaginationDto pagination); // personnel giriş ve çıkışlarını getir   
    }
    public class HomeService(IBarcodeDal barcodeDal) : IHomeService
    {
        private readonly IBarcodeDal _barcodeDal = barcodeDal;
        public async Task<ServiceResult<DataGridDto<PersonnelDto>>> GetPersonnelIO(PaginationDto pagination)
        {
            var barcodes = await _barcodeDal.GetAllAsync(x => x.UserId == pagination.LoginDto.UserDto.Id);
            var result = new DataGridDto<PersonnelDto>();
            barcodes = [.. barcodes.OrderByDescending(x => x.Id)];
            result.Pagination.Total = barcodes.Count;
            result.Pagination.PageSize = pagination.PageSize;
            result.Pagination.Page = pagination.Page;
            barcodes = [.. barcodes.Skip((pagination.Page) * pagination.PageSize).Take(pagination.PageSize)];

            int from = pagination.Page * pagination.PageSize + 1;
            int to = Math.Min((pagination.Page + 1) * pagination.PageSize, result.Pagination.Total) ;
            result.Pagination.From = from;
            result.Pagination.To = to;
            var mapToPersonnelDto = barcodes.Select(barcode => new PersonnelDto
            {
                Id = barcode.Id,
                LoginDto = pagination.LoginDto,
                Entrance = barcode.Entreance ?? false,
                Exit = barcode.Exit ?? false,
                DateRangeDto = new DateRangeDto
                {
                    StartDate = barcode.StartDate,
                    EndDate = barcode.EndDate,
                },
            }).ToList();

            result.Inputs = mapToPersonnelDto;
            if (mapToPersonnelDto.Count > 0)
            {
                return new ServiceResult<DataGridDto<PersonnelDto>> { ResponseStatus = ResponseStatus.IsSuccess, Result = result };
            }
            else
            {
                return new ServiceResult<DataGridDto<PersonnelDto>> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Tabloda gösterilecek veriniz yok" };
            }
        }
    }
}
