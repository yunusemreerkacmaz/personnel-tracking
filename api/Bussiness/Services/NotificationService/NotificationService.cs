using Bussiness.Helper.Enums;
using Bussiness.ServiceResults;
using Bussiness.Services.NotificationService.Dtos;
using Bussiness.WebSocketManagement;
using DataAccess.Abstract;
using Entity;
using Microsoft.Extensions.Logging;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace Bussiness.Services.NotificationService
{
    public interface INotificationService
    {
        Task<ServiceResult<NotificationDto>> GetNotifications(NotificationDto notificationDto);
        Task<ServiceResult<NotificationDto>> CreateNotification(NotificationDto1 notificationDto);
        Task<ServiceResult<NotificationDto>> DeleteNotification(NotificationDto notificationDto);
        Task<ServiceResult<NotificationDto>> GetNotificationWithWebSocket(WebSocket webSocket);
        Task GetlAllNotifyAdminAsync();
        //Task UpdateNotifyAdminAsync(NotificationDto notificationDto);
    }
    public class NotificationService : INotificationService
    {
        private readonly INotificationDal _notificationDal;
        private readonly ILogger<NotificationService> _logger;
        private readonly WebSocketNotification _webSocketManager;
        public NotificationService(INotificationDal notificationDal, ILogger<NotificationService> logger, WebSocketNotification webSocketManager)
        {
            _notificationDal = notificationDal;
            _logger = logger;
            _webSocketManager = webSocketManager;
        }
        public async Task<ServiceResult<NotificationDto>> GetNotifications(NotificationDto notificationDto)
        {
            var notification = await _notificationDal.GetAllAsync();
            if (notification.Count > 0)
            {
                var mapToNotificationDto = notification.Select(notificationEntity => new NotificationDto
                {
                    Id = notificationEntity.Id,
                    ReadStatus = notificationEntity.ReadStatus ?? false,
                    UserId = notificationEntity.UserId ?? 0,
                    RoleId = notificationEntity.RoleId ?? 0,
                    FirstName = notificationEntity.FirstName,
                    LastName = notificationEntity.LastName,
                    RoleName = notificationEntity.RoleName,
                    UserName = notificationEntity.UserName,
                    MessageDto = JsonSerializer.Deserialize<JsonElement>(notificationEntity.Message),
                }).ToList();
                return new ServiceResult<NotificationDto> { ResponseStatus = ResponseStatus.IsSuccess, Results = mapToNotificationDto };
            }
            else
            {
                return new ServiceResult<NotificationDto> { ResponseStatus = ResponseStatus.IsError, ResponseMessage = "Bildirimlerin getirilmeside hata oluştu" };
            }
        }
        public async Task<ServiceResult<NotificationDto>> CreateNotification(NotificationDto1 notificationDto)
        {
            TimeZoneInfo turkeyTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            DateTime turkeyTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, turkeyTimeZone);
            var notificationEntity = new Notification
            {
                Id = notificationDto.Id,
                FirstName = notificationDto.FirstName,
                LastName = notificationDto.LastName,
                Message = JsonSerializer.Serialize(new MessageDto
                {
                    Body = notificationDto.MessageDto.Body,
                    Footer = notificationDto.MessageDto.Footer,
                    Header = notificationDto.MessageDto.Header
                }),
                ReadStatus = notificationDto.ReadStatus,
                RoleId = notificationDto.RoleId,
                RoleName = notificationDto.RoleName,
                UserId = notificationDto.UserId,
                UserName = notificationDto.UserName,
                CreateTime = DateTime.Now
            };
            var addedNotification = await _notificationDal.AddAsync(notificationEntity);
            if (addedNotification != null && addedNotification.Id > 0)
            {
                return new ServiceResult<NotificationDto> { ResponseStatus = ResponseStatus.IsSuccess };
            }
            else
            {
                return new ServiceResult<NotificationDto> { ResponseStatus = ResponseStatus.IsError };
            }
        }
        public async Task<ServiceResult<NotificationDto>> DeleteNotification(NotificationDto notificationDto)
        {
            var today = DateTime.Today;                                                                                          // Bulunduğun ayın 1 ile 30 yada 31 dahil seçme işlemi
            var startDate = new DateTime(today.Year, today.Month, 1); // 01.02.2025
            var endDate = startDate.AddMonths(-5);                    // 01.11.2025

            var notifications = await _notificationDal.GetAllAsync(x => startDate < x.CreateTime && x.CreateTime < endDate);
            foreach (var notification in notifications)
            {
                //await _notificationDal.DeleteAsync(notification);
            }

            return new ServiceResult<NotificationDto>();
        }
        public async Task<ServiceResult<NotificationDto>> GetNotificationWithWebSocket(WebSocket webSocket)
        {
            _webSocketManager.SetWebSocket(webSocket);

            var buffer = new byte[1024 * 4]; // 4 KB buffer
            var stringBuilder = new StringBuilder(); // Mesaj parçalarını birleştirmek için
            WebSocketReceiveResult receiveResult;

            do
            {
                // Mesaj parçasını al
                receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                // WebSocket bağlantısı açıkken gelen parçayı işle
                if (webSocket.State == WebSocketState.Open)
                {
                    // Gelen parçayı UTF-8 olarak çöz ve birleştir
                    var receivedMessage = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                    stringBuilder.Append(receivedMessage);

                    // Eğer mesajın son parçası geldiyse
                    if (receiveResult.EndOfMessage)
                    {
                        var completeMessage = stringBuilder.ToString(); // Tüm parçalar birleştirildi
                        Console.WriteLine($"Tam Mesaj: {completeMessage}");

                        try
                        {
                            var options = new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true, // Büyük/küçük harf duyarlılığı kaldırılır
                                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                            };

                            var messageData = JsonSerializer.Deserialize<dynamic>(completeMessage, options);
                            var value = messageData?.ToString();
                            // JSON çözümleme

                            if (value != null && value != ConvertNotificationToString.ConvertNotify(NotificationTypeEnum.GetNotifies))
                            {
                                var messageDataParse = (NotificationCrudStatusAndDataDto)JsonSerializer.Deserialize<NotificationCrudStatusAndDataDto>(value, options);

                                if (messageDataParse.CrudStatus == ConvertNotificationToString.ConvertNotify(NotificationTypeEnum.UpdateNotifies))
                                {
                                    //var notifications = messageDataParse.Notifications.Where(x => x.UpdateStatus == true).ToList();
                                    foreach (var notification in messageDataParse.Notifications)
                                    {
                                        var notificationEntity = await _notificationDal.GetAsync(x => x.Id == notification.Id);
                                        notificationEntity.ReadStatus = notification.ReadStatus;
                                        notificationEntity.UpdateTime = DateTime.Now;
                                        bool updateStatus = await _notificationDal.UpdateAsync(notificationEntity);
                                    }
                                }
                            }
                            Console.WriteLine($"Çözümlenmiş Veri: {messageData}");

                            // Burada JSON'dan işlemek istediğiniz veriyle devam edebilirsiniz
                        }
                        catch (JsonException ex)
                        {
                            Console.WriteLine($"JSON Hatası: {ex.Message}");
                            Console.WriteLine($"Orijinal Veri: {completeMessage}");
                        }
                        stringBuilder.Clear(); // Bir sonraki mesaj için temizle
                    }

                    // Gerekli işlemleri yap
                    await GetlAllNotifyAdminAsync();
                    Console.BackgroundColor = ConsoleColor.Magenta;
                    Console.WriteLine("Çalıştı");
                }
            }
            while (!receiveResult.CloseStatus.HasValue); // WebSocket kapanmadığı sürece devam et
            // WebSocket'i kapat
            await webSocket.CloseAsync(receiveResult.CloseStatus.Value, receiveResult.CloseStatusDescription, CancellationToken.None);
            _webSocketManager.RemoveWebSocket();
            return new ServiceResult<NotificationDto>();
        }
        public async Task GetlAllNotifyAdminAsync()
        {
            var notifications = await _notificationDal.GetAllAsync();

            var mapToNotificationsDto = notifications.OrderByDescending(x => !x.ReadStatus).Select(notificationEntity => new NotificationDto
            {
                Id = notificationEntity.Id,
                ReadStatus = notificationEntity.ReadStatus ?? false,
                UserId = notificationEntity.UserId ?? 0,
                RoleId = notificationEntity.RoleId ?? 0,
                FirstName = notificationEntity.FirstName ?? "",
                LastName = notificationEntity.LastName ?? "",
                RoleName = notificationEntity.RoleName ?? "",
                UserName = notificationEntity.UserName ?? "",
                MessageDto = notificationEntity.Message != null ? JsonSerializer.Deserialize<JsonElement>(notificationEntity.Message) : new JsonElement(),
                UpdateStatus = false
            }).ToList();

            var serverMsg = JsonSerializer.Serialize(mapToNotificationsDto);
            await _webSocketManager.SendMessageAsync(serverMsg);
        }
        //public async Task UpdateNotifyAdminAsync(NotificationDto notificationDto)
        //{
        //    var notification = await _notificationDal.GetAsync(x => x.Id == notificationDto.Id);

        //    notification.ReadStatus = notificationDto.ReadStatus;
        //    notification.UpdateTime = DateTime.Now;

        //    var updateStatus = await _notificationDal.UpdateAsync(notification);
        //    if (updateStatus)
        //    {
        //        var serverMsg = JsonSerializer.Serialize(notification);
        //        await _webSocketManager.SendMessageAsync(serverMsg);
        //    }
        //}
    }
}
