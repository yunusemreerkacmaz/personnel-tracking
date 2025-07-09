using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;
namespace Entity
{
    public class EntryExitRecord : DateRangeEntity, IEntity
    {
        public int Id { get; set; }
        public bool Entreance { get; set; }
        public bool Exit { get; set; }
        public int? UserId { get; set; }
        //[Column(TypeName = "decimal(25,15)")] // 9 basamak virgülden önce,15 basamak virgülden sonra 9+15=24
        public double? Latitude { get; set; }
        public double? Longtitude { get; set; }
        public bool? IsInEntryArea { get; set; }         // Alan içinde ise true değilse false (Giriş)
        public bool? IsInExitArea { get; set; }         // Alan içinde ise true değilse false (Çıkış)
        public int? RoleId { get; set; }
        public int? DeviceId { get; set; }
        public int ApprovingAuthorityId { get; set; }  // Barcode Girişini onaylayan yetkili Id
        [Column(TypeName = "varchar(100)")]
        public string? EntranceActionType { get; set; }  // Biometrik mi Barkod mu Giriş ?
        [Column(TypeName = "varchar(100)")]
        public string? ExitActionType { get; set; }  // Biometrik mi Barkod mu Çıkış ?
        [Column(TypeName = "varchar(300)")]
        public string? EntryAddress { get; set; }
        [Column(TypeName = "varchar(300)")]
        public string? ExitAddress { get; set; }

    }
}
