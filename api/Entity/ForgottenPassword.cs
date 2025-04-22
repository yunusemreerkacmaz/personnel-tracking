using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class ForgottenPassword:CrudTime,IEntity
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Email { get; set; }
        [Column(TypeName = "varchar(10)")]
        public string EmailConfirmNumber { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
