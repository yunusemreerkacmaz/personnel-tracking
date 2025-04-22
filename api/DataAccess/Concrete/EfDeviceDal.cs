using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfDeviceDal : EfEntityRepository<Device, PersonnelTrackingContext>, IDeviceDal
    {
        public EfDeviceDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
