using Bussiness.ServiceResults;
using Bussiness.Services.BarcodeService.Dtos;
using Bussiness.Services.NotificationService;
using Bussiness.Services.NotificationService.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;

namespace personnel_tracking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpPost("GetNotifications")]
        public async Task<ServiceResult<NotificationDto>> GetNotifications([FromBody] NotificationDto notificationDto)
        {
            var barcode = await _notificationService.GetNotifications(notificationDto);
            return barcode;
        }
       

    }
}
