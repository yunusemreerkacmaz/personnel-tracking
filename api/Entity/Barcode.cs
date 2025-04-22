using Core;
using Entity.HelperEntity;
namespace Entity
{
    public class Barcode:DateRangeEntity,IEntity
    {
        public int Id { get; set; }
        public bool? Entreance { get; set; }
        public bool? Exit { get; set; }
        public int? UserId { get; set; }
        //[Column(TypeName = "decimal(25,15)")] // 9 basamak virgülden önce,15 basamak virgülden sonra 9+15=24
        public double? Latitude { get; set; }
        //[Column(TypeName = "decimal(25,15)")]
        public double? Longtitude { get; set; }
        public bool? AreaControl { get; set; }
        //[Column(TypeName = "varchar(100)")]
        //public string? DeviceModelName { get; set; }
        //[Column(TypeName = "varchar(100)")]
        //public string? DeviceBrand { get; set; }
        //[Column(TypeName = "varchar(500)")]
        //public string? DeviceToken { get; set; }
        public int? RoleId { get; set; }
        public int? DeviceId { get; set; }
    }
}
