using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfBarcodeDal : EfEntityRepository<Barcode, PersonnelTrackingContext>, IBarcodeDal
    {
        public EfBarcodeDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
