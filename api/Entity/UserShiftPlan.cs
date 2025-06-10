using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class UserShiftPlan : CrudTime, IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ShiftPlanId { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Monday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Tuesday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Wednesday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Thursday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Friday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Saturday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Sunday { get; set; }
        [Column(TypeName = "varchar(30)")]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? TotalWorkTime { get; set; } // haftada saat ve dakika toplamı 43:30 ---> 43 saat 30 dakika
    }
}
