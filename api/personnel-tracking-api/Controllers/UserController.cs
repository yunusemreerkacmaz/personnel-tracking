using Bussiness.ServiceResults;
using Bussiness.Services.UserService;
using Bussiness.Services.UserService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

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

       
    }
}
