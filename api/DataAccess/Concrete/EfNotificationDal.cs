using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfNotificationDal : EfEntityRepository<Notification, PersonnelTrackingContext>, INotificationDal
    {
        public EfNotificationDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
