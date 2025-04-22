using personnel_tracking_api.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();               // .NET 6+(burasý serviste headers bilgisini almak için eklendi)
builder.Logging.AddConsole();                           // Loglar konsola yazdýrýlýr
builder.Services.AddCors(options => // Cors eklemen lazým
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
builder.JwtExtensionMiddleware();                       // JWT oluþturma middleware
builder.Services.CreateJobExtensionsMiddleware();       // Job Oluþturma servisi
builder.Services.AddServicesMiddleware();               // Servislerin ye adldýðý extension

var app = builder.Build();

using (var scope = app.Services.CreateScope())          // Varsayýlan kullanýcýlarý ve rollerini ekleme(Admin vs...)
{
    var services = scope.ServiceProvider;
    await services.CreateUserAndRoles();
}

if (app.Environment.IsProduction())                     // Production
{
    app.UseHttpsRedirection();                          // Http olan bir url nin hppts olmasý için eklendi
}
else                                                    // Development
{
    builder.WebHost.UseUrls("http://0.0.0.0:5023");
}
app.UseExceptionHandler("/error");
app.UseHsts();
app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();                                       // Yönedirme için þart
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseWebSockets();
app.UseMiddleware<WebSocketMiddleware>();               // webSocket(Bildirimler) iþlemi
app.UseMiddleware<ErrorHandlingMiddleware>();           // Log.txt dosyasý middleWare 
app.Run();


