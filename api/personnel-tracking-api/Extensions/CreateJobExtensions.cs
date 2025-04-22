using Quartz;
using Bussiness.Jobs;
using Quartz.Simpl;
namespace personnel_tracking_api.Extensions
{
    public static class CreateJobExtensions
    {
        public static void CreateJobExtensionsMiddleware(this IServiceCollection services)
        {
            services.AddQuartz(quartz =>
            {
                quartz.UseJobFactory<MicrosoftDependencyInjectionJobFactory>();

                var job1 = new JobKey("ListOfAbsentees");  // Endpoint adı
                quartz.AddJob<BackgroundJob>(opt => opt.WithIdentity(job1));
                quartz.AddTrigger(opt => opt.ForJob(job1).WithIdentity("ListOfAbsentees-trigger").WithCronSchedule("0 0 9 ? * 1-5")); // hafta içi her gün saat 09.00 da çalışacak ------ 0 0/1 * * * ?

                var job2 = new JobKey("DeleteNotifications"); // Endpoint adı
                quartz.AddJob<BackgroundJob>(opt => opt.WithIdentity(job2));
                quartz.AddTrigger(opt => opt.ForJob(job2).WithIdentity("DeleteNotifications-trigger").WithCronSchedule("0 20 0 ? * 1-5")); // hafta içi her gün saat 12.20 da çalışacak ------ 0 0/1 * * * ?

                var job3 = new JobKey("DeleteEmailJob"); // Endpoint adı
                quartz.AddJob<BackgroundJob>(opt => opt.WithIdentity(job3));
                quartz.AddTrigger(opt => opt.ForJob(job3).WithIdentity("DeleteForgottenPassword-trigger").WithCronSchedule("0 0/1 * * * ?")); // Pazartesi günü sadece 20:00'da ------ 0 0/1 * * * ?

                services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);   // uygulama dururken veya kapanırken job’ların tamamlanmasını bekler.
            });
        }
    }
}
