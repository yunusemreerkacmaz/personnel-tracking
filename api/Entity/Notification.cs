using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class Notification : CrudTime, IEntity
    {
        public int Id { get; set; }
        public bool? ReadStatus { get; set; }
        public int? UserId { get; set; }
        public int? RoleId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? UserName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? RoleName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? FirstName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? LastName { get; set; }
        [Column(TypeName = "varchar(8000)")]
        public string? Message { get; set; }
    }
}
