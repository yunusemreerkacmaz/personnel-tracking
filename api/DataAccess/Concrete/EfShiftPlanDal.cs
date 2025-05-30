using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;
namespace DataAccess.Concrete
{
    public class EfShiftPlanDal : EfEntityRepository<ShiftPlan, PersonnelTrackingContext>, IShiftPlanDal
    {
        public EfShiftPlanDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
