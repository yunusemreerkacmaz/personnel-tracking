using Entity.HelperEntity;
namespace Bussiness.Services.ShiftPlanService.Dtos
{
    public class ShiftPlanDto
    {
        public TableHeaderDto TableHeader { get; set; } = new TableHeaderDto();
        public List<TableBodyDto> TableBody { get; set; } = new List<TableBodyDto>();
    }
    public class TableBodyDto : CrudTime
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Monday { get; set; }     // vardiya saatleri 09:18:00
        public string? Tuesday { get; set; }
        public string? Wednesday { get; set; }
        public string? Thursday { get; set; }
        public string? Friday { get; set; }
        public string? Saturday { get; set; }
        public string? Sunday { get; set; }
        public bool IsDeleted { get; set; }
        public string? TotalTime { get; set; }      // haftada saat ve dakika toplamı 43:30 ---> 43 saat 30 dakika
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
    public class TableHeaderDto
    {
        public DateTime? MondayDate { get; set; }    // vardiya Tarihleri 26.05.2025
        public DateTime? TuesdayDate { get; set; }   // vardiya Tarihleri 27.05.2025
        public DateTime? WednesdayDate { get; set; } // vardiya Tarihleri 28.05.2025
        public DateTime? ThursdayDate { get; set; }  // vardiya Tarihleri 29.05.2025
        public DateTime? FridayDate { get; set; }    // vardiya Tarihleri 30.05.2025
        public DateTime? SaturdayDate { get; set; }  // vardiya Tarihleri 31.05.2025
        public DateTime? SundayDate { get; set; }    // vardiya Tarihleri 01.06.2025
    }
}
