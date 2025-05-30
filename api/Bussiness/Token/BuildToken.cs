using Bussiness.Services.LoginService.Dtos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bussiness.Token
{
    public class BuildToken(string env)  // burda constructor olduğunu gösterir
    {
        private readonly string _url = env == "Production" ? "https://www.modalifebys.com" : "http://127.0.0.1:5023/";
        public string CreateToken(LoginDto loginDto)
        {
            var bytes = Encoding.UTF8.GetBytes("personnel-tracking-control-and-entry-exit-control");
            SymmetricSecurityKey key = new(bytes);
            SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.Name,loginDto.UserDto?.UserName ?? ""),
                new(ClaimTypes.Role,loginDto.RoleDto?.RoleName ?? ""),
                new (ClaimTypes.Email,loginDto.UserDto?.Email ?? "")
            };
            DateTime startDate = DateTime.Now;
            DateTime expires = startDate.AddDays(1);

            JwtSecurityToken token = new(
                issuer: _url,
                audience: _url,
                claims: claims,
                notBefore: startDate,
                expires: expires,
                signingCredentials: credentials);

            JwtSecurityTokenHandler handler = new();
            return handler.WriteToken(token);
        }
    }
}
