using Core;
using Entity.HelperEntity;
namespace Entity
{
    public class Biometric : DateRangeEntity, IEntity
    {
        public int Id { get; set; }
        public bool? Entreance { get; set; }
        public bool? Exit { get; set; }
        public int? UserId { get; set; }
        public double? Latitude { get; set; }
        public double? Longtitude { get; set; }
        public bool? AreaControl { get; set; }
        public int? RoleId { get; set; }
        public int? DeviceId { get; set; }
        public int ApprovingAuthorityId { get; set; }  // Barcode Girişini onaylayan yetkili Id
        public Guid? EntranceOrExitId { get; set; } // Girişe yada çıkışa ait bir Id(barkod ile giriş yapmışsa biyometrik ile çıkış yapmışsa yada tam tersi ise bu id ikisinde de aynı olacak) giriş yaptığı anda eklenmeli
    }
}
