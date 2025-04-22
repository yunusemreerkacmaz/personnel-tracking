using Bussiness.ServiceResults;
using Bussiness.Services.RoleService;
using Bussiness.Services.RoleService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController(IRoleService roleService) : ControllerBase
    {
        private readonly IRoleService _roleService = roleService;

        [HttpGet("GetRoles")]
        public async Task<ServiceResult<RoleDto>> GetRoles()
        {
            var roles = await _roleService.GetRoles();
            return roles;
        }

        [HttpPost("AddRole")]
        public async Task<ServiceResult<RoleDto>> AddRole([FromBody] RoleDto roleDto)
        {
            var addRole = await _roleService.AddRole(roleDto);
            return addRole;
        }
        [HttpPost("DeleteRole")]
        public async Task<ServiceResult<RoleDto>> DeleteRole([FromBody] List<RoleDto> roleDto)
        {
            var addRole = await _roleService.DeleteRole(roleDto);
            return addRole;
        }


    }
}
