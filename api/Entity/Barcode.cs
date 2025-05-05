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
        public double? Longtitude { get; set; }
        public bool? AreaControl { get; set; }
        public int? RoleId { get; set; }
        public int? DeviceId { get; set; }
        public int ApprovingAuthorityId { get; set; }  // Barcode Girişini onaylayan yetkili Id
    }
}
