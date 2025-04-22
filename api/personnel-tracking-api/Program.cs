using personnel_tracking_api.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();               // .NET 6+(buras� serviste headers bilgisini almak i�in eklendi)
builder.Logging.AddConsole();                           // Loglar konsola yazd�r�l�r
builder.Services.AddCors(options => // Cors eklemen laz�m
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                //.WithExposedHeaders("Authorization")
                .WithExposedHeaders("device-token");
            ;
        });
});
builder.Services.DatabaseExtensionMiddleware();         // Database Extension middleware
builder.JwtExtensionMiddleware();                       // JWT olu�turma middleware
builder.Services.CreateJobExtensionsMiddleware();       // Job Olu�turma servisi
builder.Services.AddServicesMiddleware();               // Servislerin ye adld��� extension

var app = builder.Build();

using (var scope = app.Services.CreateScope())          // Varsay�lan kullan�c�lar� ve rollerini ekleme(Admin vs...)
{
    var services = scope.ServiceProvider;
    await services.CreateUserAndRoles();
}

if (app.Environment.IsProduction())                     // Production
{
    app.UseHttpsRedirection();                          // Http olan bir url nin hppts olmas� i�in eklendi
}
else                                                    // Development
{
    builder.WebHost.UseUrls("http://0.0.0.0:5023");
}
app.UseExceptionHandler("/error");
app.UseHsts();
app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();                                       // Y�nedirme i�in �art
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseWebSockets();
app.UseMiddleware<WebSocketMiddleware>();               // webSocket(Bildirimler) i�lemi
app.UseMiddleware<ErrorHandlingMiddleware>();           // Log.txt dosyas� middleWare 
app.Run();


