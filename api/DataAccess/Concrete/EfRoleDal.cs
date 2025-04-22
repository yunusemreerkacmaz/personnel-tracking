using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfRoleDal : EfEntityRepository<Role, PersonnelTrackingContext>, IRoleDal
    {
        public EfRoleDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
