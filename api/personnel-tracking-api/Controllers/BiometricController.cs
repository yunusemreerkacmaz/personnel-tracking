//using Bussiness.ServiceResults;
//using Bussiness.Services.BiometricService;
//using Bussiness.Services.BiometricService.Dtos;
//using Microsoft.AspNetCore.Mvc;

//namespace personnel_tracking_api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class BiometricController(IBiometricService biometricService) : ControllerBase
//    {
//        private readonly IBiometricService _biometricService = biometricService;

//        [HttpPost("ReadBiometric")]
//        public async Task<ServiceResult<BiometricDto>> ReadBiometric([FromBody]BiometricDto biometricDto)
//        {
//            var readBiometric= await _biometricService.ReadBiometricService(biometricDto);
//            return readBiometric;
//        }
//        [HttpPost("CheckBiometric")]
//        public async Task<ServiceResult<BiometricDto>> CheckBiometric([FromBody] BiometricDto biometricDto)
//        {
//            var readBiometric = await _biometricService.CheckBiometricService(biometricDto);
//            return readBiometric;
//        }
//    }
//}
