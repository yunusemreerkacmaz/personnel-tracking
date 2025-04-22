using DataAccess.Contexts;
using Microsoft.EntityFrameworkCore;

namespace personnel_tracking_api.Extensions
{
    public static class DatabaseExtension
    {
        public static void DatabaseExtensionMiddleware(this IServiceCollection services)
        {
            try
            {
                services.AddDbContext<PersonnelTrackingContext>((serviceProvider, options) =>
                {
                    var connectionString = serviceProvider.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection");
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).EnableDetailedErrors().EnableSensitiveDataLogging();
                    //options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                }, ServiceLifetime.Scoped);
            }
            catch (Exception ex)
            {

                throw ex;
            }
     
        }
    }
}
