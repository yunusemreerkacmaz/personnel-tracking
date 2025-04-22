using Bussiness.ServiceResults;
using Bussiness.Services.LoginService;
using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoginController(ILoginService loginService) : ControllerBase
    {
        private readonly ILoginService _loginService = loginService;

        [HttpGet("LoginCheckAsync")]
        public async Task<ServiceResult<LoginDto>> LoginCheckAsync()
        {
            //var token = Request.Headers.Authorization;
            var user = await _loginService.LoginCheck();
            return user;
        }
        [AllowAnonymous]                // Herkes buraya erişebilmeli
        [HttpPost("LoginAsync")]
        public async Task<ServiceResult<LoginDto>> LoginAsync([FromBody] LoginDto userDto)
        {
            var user = await _loginService.LoginAsync(userDto);
            //string token = user.Result?.Token ?? "";
            //if (!string.IsNullOrEmpty(token))
            //{
                //Response.Headers.Append("Authorization", $"Bearer {token}");
            //}
            return user;
        }
        [HttpPost("ForgottenPassword")]
        public async Task<ServiceResult<ForgottenPasswordDto>> ForgottenPassword([FromBody] ForgottenPasswordDto emailDto)
        {
            var user = await _loginService.ForgottenPassword(emailDto);
            return user;
        }
        [AllowAnonymous]
        //[Authorize(Roles = "Admin")]
        [HttpHead("health-check")]
        [HttpGet("health-check")]
        public bool Get()
        {

            //Response.Headers.ContentType="sdasd";
            //Response.Headers.Append("key", "Yunus");
            return true;
        }
        [HttpGet("ListofAbsentees")]
        public async Task<ServiceResult<UserDto>> ListofAbsentees()
        {
            var user = await _loginService.ListofAbsentees();
            return user;
        }
    }
}
