using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfUserShiftPlanDal : EfEntityRepository<UserShiftPlan, PersonnelTrackingContext>, IUserShiftPlanDal
    {
        public EfUserShiftPlanDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
