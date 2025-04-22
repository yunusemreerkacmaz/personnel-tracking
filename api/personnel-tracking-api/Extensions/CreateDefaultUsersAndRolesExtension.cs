using Bussiness.Services.RoleService;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.Stores;
using Bussiness.Services.Stores.Dtos;
using Bussiness.Services.UserService;
using Bussiness.Services.UserService.Dtos;

namespace personnel_tracking_api.Extensions
{
    public static class CreateDefaultUsersAndRolesExtension
    {
        public static async Task CreateUserAndRoles(this IServiceProvider provider)
        {
            var adminRoleService = provider.GetRequiredService<IRoleService>();
            var adminUserService = provider.GetRequiredService<IUserService>();
            var adminStoreService = provider.GetRequiredService<IStoreService>();

            var createAdminRole = await adminRoleService.AddRole(new RoleDto
            {
                Id = 1,
                RoleName = "Admin"
            });
            var createStoreAdminRole = await adminRoleService.AddRole(new RoleDto
            {
                Id = 2,
                RoleName = "Mağaza Yöneticisi"
            });
            var createAdminstore = await adminStoreService.AddStore(new StoreDto
            {
                Id = 1,
                IsActive = true,
                Radius = 42,
                StoreName = "Modalife Genel Merkezi",
                StoreTime = new TimeDto
                {
                    StartDate = "08:30:33.012000",
                    EndDate = "18:45:36.029000"
                },
                StoreLocation = new StoreLocationDto
                {
                    Latitude = 40.040698,
                    Longitude = 32.908165,
                    LatitudeDelta = 0.046381,
                    LongitudeDelta = 0.033206,
                },
            });

            var createAdminUser = await adminUserService.AddUser(new AddUserDto
            {
                Id = 0,
                UserName = "Admin",
                Password = "1",
                FirstName = "Admin",
                LastName = "Admin",
                CreateTime = DateTime.Now,
                Email = "yunusemre.erkacmaz@modalife.com.tr",
                Gender = "Erkek",
                IsActive = true,
                PhoneNumber = "444 222 33 11",
                RoleDto = new RoleDto
                {
                    Id = 1,
                    IsActive = true,
                    RoleName = "Admin"
                },
                StoreDto = new StoreDto
                {
                    Id = 1,
                },
                ShiftTime = new TimeDto
                {
                    StartDate = "08:30:33.012000",
                    EndDate = "18:45:36.029000"
                }
            });
        }
    }
}
