using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.UserService.Dtos;

namespace Bussiness.Services.LoginService.Dtos
{
    public class LoginDto
    {
        public UserDto UserDto { get; set; }
        public RoleDto RoleDto { get; set; }
        public bool? IsLoggedIn { get; set; }
        public bool RememberMe { get; set; }
    }
}
