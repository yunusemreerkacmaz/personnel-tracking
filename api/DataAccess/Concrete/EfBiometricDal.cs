using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfBiometricDal : EfEntityRepository<Biometric, PersonnelTrackingContext>, IBiometricDal
    {
        public EfBiometricDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
