using Bussiness.Services.NotificationService;
using System.Net;

namespace personnel_tracking_api.Extensions
{
    public class WebSocketMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
    {
        private readonly RequestDelegate _next = next;
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path == "/ws")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    using var scope = _serviceProvider.CreateScope();
                    var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await notificationService.GetNotificationWithWebSocket(webSocket);
                }
                else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                }
            }
            else
            {
                await _next(context);
            }
        }

        // Program.cs de aşağıdaki gibi kullanabilirsin

        //app.Use(async (context, next) =>
        //{
        //    if (context.Request.Path == "/ws")
        //    {
        //        if (context.WebSockets.IsWebSocketRequest)
        //        {
        //            var websocketHandler = context.RequestServices.GetRequiredService<INotificationService>();
        //            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        //            await websocketHandler.GetNotificationWithWebSocket(webSocket);
        //        }
        //        else
        //        {
        //            context.Response.StatusCode = 400;
        //        }
        //    }
        //    else
        //    {
        //        await next();
        //    }

        //});
    }
}