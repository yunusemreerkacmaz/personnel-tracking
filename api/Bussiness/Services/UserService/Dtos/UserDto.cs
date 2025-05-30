using Bussiness.Helper.Dtos;
using Bussiness.Services.RoleService.Dtos;
using Bussiness.Services.Stores.Dtos;

namespace Bussiness.Services.UserService.Dtos
{
    public class UserDto : CrudTimeDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
  
    public class AddUserDto : UserDto
    {
        public TimeDto ShiftTime { get; set; } // Personel vardiya saatleri 
        public RoleDto RoleDto { get; set; }
        public bool IsActive { get; set; }
        public StoreDto StoreDto { get; set; }
    }
    public class DeleteUsersDto : AddUserDto
    {
    }
    public class GetUserDto : AddUserDto
    {
        public bool IsHaveBarcode { get; set; }
    }
    public class ForgottenPasswordDto 
    {
        public string Email { get; set; }
        //public bool EmailConfirmStatus { get; set; } // Emaile gönderilen butonun tıklanma durumu
        public string EmailConfirmNumber { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }

    public class UserEntryExitLoginDto
    {
        public UserDto UserDto { get; set; }
        public bool? IsApproval { get; set; }  // Admin giriş - çıkış onayı
    }
}
