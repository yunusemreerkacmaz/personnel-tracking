using Bussiness.Helper.Dtos;
using System.Text.Json;

namespace Bussiness.Services.NotificationService.Dtos
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public bool ReadStatus { get; set; }
        public JsonElement MessageDto { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string RoleName { get; set; }
        public bool UpdateStatus { get; set; }
    }


    public class NotificationDto1
    {
        public int Id { get; set; }
        public bool ReadStatus { get; set; }
        public MessageDto MessageDto { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string RoleName { get; set; }
        public bool UpdateStatus { get; set; }
    }
    public class MessageDto
    {
        public string Header { get; set; }
        public string Body { get; set; }
        public string Footer { get; set; }
    }
    public class NotificationCrudStatusAndDataDto
    {
        public string CrudStatus { get; set; }
        public List<NotificationDto> Notifications { get; set; }
    }

    public class MessageDto1
    {
        public string Header { get; set; }
        public Body Body { get; set; }
        public string Footer { get; set; }
    }
    public class Body
    {
        public List<Absentiess> Absentiesses { get; set; }
    }

    public class Absentiess:CrudTimeDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string FirstName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
    }


}
