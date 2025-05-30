using Bussiness.Services.DeviceService;
using Bussiness.Services.EntryExitService;
using Bussiness.Services.HomeService;
using Bussiness.Services.LoginService;
using Bussiness.Services.NotificationService;
using Bussiness.Services.RoleService;
using Bussiness.Services.ShiftPlanService;
using Bussiness.Services.Stores;
using Bussiness.Services.UserService;
using Bussiness.WebSocketManagement;
using Core.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete;

namespace personnel_tracking_api.Extensions
{
    public static class ServiceMiddleware
    {
        public static void AddServicesMiddleware(this IServiceCollection services)
        {
            services.AddScoped(typeof(EfEntityRepository<,>));
            services.AddScoped<IUserDal, EfUserDal>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<IBarcodeDal, EfBarcodeDal>();
            services.AddScoped<IHomeService, HomeService>();
            services.AddScoped<IRoleDal, EfRoleDal>();
            services.AddScoped<IUserDal, EfUserDal>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IForgottenPasswordDal, EfForgottenPasswordDal>();
            services.AddScoped<INotificationDal, EfNotificationDal>();
            services.AddSingleton<WebSocketNotification>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IStoreDal, EfStoreDal>();
            services.AddScoped<IStoreService, StoreService>();
            services.AddScoped<IDeviceDal, EfDeviceDal>();
            services.AddScoped<IDeviceService, DeviceService>();
            services.AddScoped<IBiometricDal, EfBiometricDal>();
            services.AddScoped<IEntryExitDal, EfEntryExitDal>();
            services.AddScoped<IEntryExitService, EntryExitService>();
            services.AddScoped<IShiftPlanDal, EfShiftPlanDal>();
            services.AddScoped<IShiftPlanService, ShiftPlanService>();

        }
    }
}
