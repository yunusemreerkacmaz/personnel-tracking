using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;
namespace DataAccess.Concrete
{
    public class EfStoreDal : EfEntityRepository<Store, PersonnelTrackingContext>, IStoreDal
    {
        public EfStoreDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
