using Core;
using Entity.HelperEntity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public class Role : CrudTime, IEntity
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string RoleName { get; set; }
        public bool IsDeleted { get; set; }
    }
}
