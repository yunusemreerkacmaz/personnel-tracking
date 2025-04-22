using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace personnel_tracking_api.Extensions
{
    public static class JwtExtension
    {
        public static void JwtExtensionMiddleware(this WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(x =>  // Authentication işlemi için Jwt Token ekleme yapıldı
            {
                x.RequireHttpsMetadata = false;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = builder.Environment.IsProduction() ? "https://www.modalifebys.com" : "http://127.0.0.1:5023/",   // oluşturucu
                    ValidAudience = builder.Environment.IsProduction() ? "https://www.modalifebys.com" : "http://127.0.0.1:5023/",  // tüketici
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("personnel-tracking-control-and-entry-exit-control")), // Key adı
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true, // tokeni istediği kadar kullanabiliyor hiç expire olmuyor
                    ClockSkew = TimeSpan.Zero,
                    //ValidateIssuer=true,
                    //ValidateAudience=true,
                };
            });
        }
    }
}
