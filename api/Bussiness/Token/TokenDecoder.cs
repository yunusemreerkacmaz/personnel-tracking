using Bussiness.Services.LoginService.Dtos;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.UserService.Dtos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bussiness.Token
{
    public class TokenDecoder(string env)
    {
        //private readonly string _env = env;
        private readonly string _url = env == "Production" ? "https://www.modalifebys.com" : "http://127.0.0.1:5023/";
        public LoginDto DecodeToken(string token)
        {

            if (!string.IsNullOrEmpty(token) && token.StartsWith("Bearer "))
            {
                token = token.Substring(7).Trim(); // "Bearer " kısmını kaldır
            }

            var bytes = Encoding.UTF8.GetBytes("personnel-tracking-control-and-entry-exit-control");
            SymmetricSecurityKey key = new(bytes);

            TokenValidationParameters tokenValidationParameters = new()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _url,
                ValidAudience = _url,
                ValidateLifetime = true,
                ValidateAudience = true,
            };

            JwtSecurityTokenHandler tokenHandler = new();
            string username = "";
            string roleName = "";
            string emailAddress = "";
            try
            {
                ClaimsPrincipal claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
                // Kullanıcı bilgilerine erişim sağlama 
                username = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value ?? "";
                roleName = claimsPrincipal.FindFirst(ClaimTypes.Role)?.Value ?? "";
                emailAddress = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value ?? "";
            }
            catch
            {
                return new LoginDto();
            }
            return new LoginDto
            {
                UserDto = new UserDto
                {
                    UserName = username,
                    Email = emailAddress,
                },
                RoleDto = new RoleDto { RoleName = roleName },
            };
        }
    }
}
