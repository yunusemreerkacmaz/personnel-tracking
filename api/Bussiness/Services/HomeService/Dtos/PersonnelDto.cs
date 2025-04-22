using Bussiness.Helper.Dtos;
using Bussiness.Services.LoginService.Dtos;
namespace Bussiness.Services.HomeService.Dtos
{
    public class PersonnelDto
    {
        public int Id { get; set; }
        public LoginDto LoginDto { get; set; }
        public bool? Entrance { get; set; }
        public bool? Exit { get; set; }
        public DateRangeDto DateRangeDto { get; set; }
    }
    public class PaginationDto
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int Total { get; set; }
        public LoginDto LoginDto { get; set; }
    }
    public class DataGridDto<T>
    {
        public List<T>? Inputs { get; set; }
        public PaginationDto Pagination { get; set; }

        public DataGridDto()
        {
            Pagination = new PaginationDto();
        }
    }
}
