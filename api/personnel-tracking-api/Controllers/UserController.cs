using Bussiness.ServiceResults;
using Bussiness.Services.UserService;
using Bussiness.Services.UserService.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet("GetUsers")]
        public async Task<ServiceResult<GetUserDto>> GetUsers()
        {
            var users = await _userService.GetUsers();
            return users;
        }
        [HttpPost("AddUser")]
        public async Task<ServiceResult<AddUserDto>> AddUser([FromBody] AddUserDto userDto)
        {
            var addedUser = await _userService.AddUser(userDto);
            return addedUser;
        }
        [HttpPost("UpdateUser")]
        public async Task<ServiceResult<AddUserDto>> UpdateUser([FromBody] AddUserDto userDto)
        {
            var addedUser = await _userService.UpdateUser(userDto);
            return addedUser;
        }
        //[HttpPost("DeleteUsers")]
        //public async Task<ServiceResult<DeleteUsersDto>> DeleteUsers([FromBody] List<DeleteUsersDto> deleteUsersDtos)
        //{
        //    var deletedUsers = await _userService.DeleteUsers(deleteUsersDtos);
        //    return deletedUsers;
        //}
        [Authorize(Roles ="Admin")]  // Admin Id
        [HttpGet("GetEntryExitUserLogin")]
        public async Task<ServiceResult<UserEntryExitLoginDto>> GetEntryExitUserLogin()
        {
            var getBarcodeUsers = await _userService.GetEntryExitUserLoginService();
            return getBarcodeUsers;
        }

        [Authorize(Roles = "Admin")]  // Admin Id
        [HttpGet("GetEntryExitUserLogout")]
        public async Task<ServiceResult<UserEntryExitLoginDto>> GetEntryExitUserLogoutService()
        {
            var getBarcodeUsers = await _userService.GetEntryExitUserLogoutService();
            return getBarcodeUsers;
        } 
        [Authorize(Roles = "Admin")]  // Admin Id
        [HttpPost("UpdateEntryExitUser")]
        public async Task<ServiceResult<UserEntryExitLoginDto>> UpdateEntryExitUser([FromBody] UserEntryExitLoginDto userDto)
        {
            var addedUser = await _userService.UpdateEntryExitUserService(userDto);
            return addedUser;
        }

    }
}
