using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;
namespace DataAccess.Concrete
{
    public class EfEntryExitDal : EfEntityRepository<EntryExitRecord, PersonnelTrackingContext>, IEntryExitDal
    {
        public EfEntryExitDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}

