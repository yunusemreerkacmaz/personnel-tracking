using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Contexts;
using Entity;

namespace DataAccess.Concrete
{
    public class EfForgottenPasswordDal : EfEntityRepository<ForgottenPassword, PersonnelTrackingContext>, IForgottenPasswordDal
    {
        public EfForgottenPasswordDal(PersonnelTrackingContext context) : base(context)
        {
        }
    }
}
