using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfUserDal : EfEntityRepository<User, PersonnelTrackingContext>, IUserDal
    {
        public EfUserDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
