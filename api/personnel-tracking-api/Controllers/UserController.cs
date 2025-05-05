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
        [HttpPost("DeleteUsers")]
        public async Task<ServiceResult<DeleteUsersDto>> DeleteUsers([FromBody] List<DeleteUsersDto> deleteUsersDtos)
        {
            var deletedUsers = await _userService.DeleteUsers(deleteUsersDtos);
            return deletedUsers;
        }
        [Authorize(Roles ="Admin")]
        [HttpGet("GetBarcodeUserLoginService")]
        public async Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLogin()
        {
            var getBarcodeUsers = await _userService.GetBarcodeUserLoginService();
            return getBarcodeUsers;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetBarcodeUserLogoutService")]
        public async Task<ServiceResult<UserBarcodeLoginDto>> GetBarcodeUserLogout()
        {
            var getBarcodeUsers = await _userService.GetBarcodeUserLogoutService();
            return getBarcodeUsers;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("UpdateBarcodeUser")]
        public async Task<ServiceResult<UserBarcodeLoginDto>> UpdateBarcodeUser([FromBody] UserBarcodeLoginDto userDto)
        {
            var addedUser = await _userService.UpdateBarcodeUserService(userDto);
            return addedUser;
        }

    }
}
