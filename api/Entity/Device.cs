using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class Device: CrudTime, IEntity
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? DeviceModelName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? DeviceBrand { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? DeviceToken { get; set; }
        public bool? DistinctDevice { get; set; } // DeviceToken'i farklı olanlar( true ise cihaz değiştirilmiş false ise cihaz değişikliği reddedilmiş null ise ekranda gösterme)
        public bool IsDeleted { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? DistinctDeviceModelName { get; set; } // sonradan girdiği cihazın modeli
        [Column(TypeName = "varchar(100)")]
        public string? DistinctDeviceBrand { get; set; }    // sonradan girdiği cihazın markası
    }
}
