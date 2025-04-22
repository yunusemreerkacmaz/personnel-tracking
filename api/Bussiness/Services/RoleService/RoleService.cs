using Bussiness.ServiceResults;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Token;
using DataAccess.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Bussiness.Services.RoleService
{
    public interface IRoleService
    {
        Task<ServiceResult<RoleDto>> GetRoles();
        Task<ServiceResult<RoleDto>> AddRole(RoleDto roleDto);
        Task<ServiceResult<RoleDto>> DeleteRole(List<RoleDto> roleDto);
    }
    public class RoleService(IRoleDal roleDal, IUserDal userDal, IHttpContextAccessor httpContextAccessor) : IRoleService
    {
        private readonly IRoleDal _roleDal = roleDal;
        private readonly IUserDal _userDal = userDal;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<ServiceResult<RoleDto>> AddRole(RoleDto roleDto)
        {
            if (!string.IsNullOrEmpty(roleDto.RoleName))
            {
                var role = await _roleDal.GetAsync(x => x.RoleName.Contains(roleDto.RoleName));

                if (role == null)
                {
                    var roleEntity = new Role
                    {
                        RoleName = roleDto.RoleName,
                        CreateTime = DateTime.Now,
                    };
                    var addedRole = await _roleDal.AddAsync(roleEntity);
                    if (addedRole != null && addedRole.Id > 0)
                    {
                        var roles = await GetRoles();

                        var maptoRolesDto = roles.Results?.Select(x => new RoleDto
                        {
                            Id = x.Id,
                            RoleName = x.RoleName,
                            IsActive = x.IsActive,
                        }).ToList();

                        return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = maptoRolesDto, ResponseMessage = "Yetki başarıyla eklendi" };
                    }
                    else
                    {
                        return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Ekleme işlemi sırasında hata oluştu" };
                    }

                }
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsWarning, ResponseMessage = "Yetki Sistemde Mevcut" };
            }
            else
            {
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Yetki adı boş bırakılamaz" };
            }

        }
        public async Task<ServiceResult<RoleDto>> DeleteRole(List<RoleDto> rolesDto)
        {

            var roles = _roleDal.GetAllQueryAble(x => !x.IsDeleted).AsNoTracking();
            var rolesDtoId = rolesDto.Where(x => x.IsActive == false).Select(x => x.Id);
            roles = roles.Where(role => rolesDtoId.Any(roleId => roleId == role.Id));
            var filteredRoles = await roles.ToListAsync();
            int allDeletedNumber = 0;

            foreach (var role in filteredRoles)
            {
                role.IsDeleted = true;
                role.DeleteTime = DateTime.Now;
                var deletedRole = await _roleDal.UpdateAsync(role);
                if (!deletedRole)
                {
                    allDeletedNumber++;
                }
            }
            if (allDeletedNumber == rolesDto.Count)
            {
                var allRoles = await GetRoles();
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = allRoles.Results, ResponseMessage = "Tüm Silme işlemi başarılı" };
            }
            else if (rolesDto.Count > allDeletedNumber)
            {
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = $"Seçtiğiniz{rolesDto.Count}yetkiden sadece {allDeletedNumber} tanesi silindi" };
            }
            else
            {
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Silinme işlemi başarısız" };
            }
        }
        public async Task<ServiceResult<RoleDto>> GetRoles()
        {
            var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var loginDto = new TokenDecoder(environment).DecodeToken(headers.Authorization);

            var getUser = await _userDal.GetAsync(user =>
            loginDto.UserDto != null &&
            loginDto.RoleDto != null &&
            loginDto.UserDto.UserName == user.UserName &&
            loginDto.UserDto.Email == user.Email &&
            loginDto.RoleDto.RoleName.ToLower().Trim() == user.RoleName.ToLower().Trim());

            var roles = _roleDal.GetAllQueryAble(role => !role.IsDeleted).Where(x => getUser.Id == 1 || x.Id != 1 && x.Id != 2); // Admin dışındaki kullanıcıların ekranına admin ve mağaza yöneticisi gelmesin
            var user = _userDal.GetAllQueryAble(role => !role.IsDeleted);
            var activeRoles = roles.Where(role => user.Any(user => user.RoleId == role.Id));

            if (roles.Any() && activeRoles.Any())
            {
                var maptoRoleDto = await roles.Select(roleEntity => new RoleDto
                {
                    Id = roleEntity.Id,
                    RoleName = roleEntity.RoleName,
                    IsActive = activeRoles.Any(x => x.Id.Equals(roleEntity.Id)),
                }).OrderByDescending(x => x.Id).ToListAsync();

                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = maptoRoleDto };
            }
            else
            {
                return new ServiceResult<RoleDto> { ResponseStatus = ResponseStatus.IsSuccess, ResponseMessage = "Yetkilerin veileri getirilemedi" };
            }
        }
    }
}
