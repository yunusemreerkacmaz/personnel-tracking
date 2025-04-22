using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bussiness.ServiceResults
{
    public class ServiceResult<T>
    {
        public T? Result { get; set; } // Obje verisi
        public List<T>? Results { get; set; } // Liste Verisi
        public ResponseStatus ResponseStatus { get; set; }  // Dönüş Durumu 
        public string? ResponseMessage { get; set; }        //  Mesaj yazılmak istenirse
    }
    public enum ResponseStatus
    {
        IsSuccess = 1,
        IsError = 2,
        IsWarning = 3,
    }
}
