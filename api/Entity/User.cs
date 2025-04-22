using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class User : CrudTime, IEntity
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string UserName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Password { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string FirstName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string LastName { get; set; }
        public int RoleId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string RoleName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Gender { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Email { get; set; }
        public int StoreId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; } // Personel Çalışma durumu --->  true = çalışıyor false = çalışmıyor
        public TimeOnly? StartTime { get; set; } // personel vardiya başlangıç zamanı
        public TimeOnly? EndTime { get; set; }  // personel vardiya bitiş zamanı
        [Column(TypeName = "varchar(15)")]
        public string PhoneNumber { get; set; }
    }
}
