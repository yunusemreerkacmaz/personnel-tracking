using Core;
using Entity.HelperEntity;
namespace Entity
{
    public class Store : CrudTime, IEntity
    {
        public int Id { get; set; }
        public string? StoreName { get; set; }  // Kurum Adı
        public TimeOnly? StartDate { get; set; } // Kurum saatinin başlangıç tarihi
        public TimeOnly? EndDate { get; set; } // Kurum saatinin bitiş tarihi
        //[Column(TypeName = "decimal(25,15)")]
        public double Latitude { get; set; }   // Enlem
        //[Column(TypeName = "decimal(25,15)")]
        public double Longitude { get; set; }  // Boylam
        //[Column(TypeName = "decimal(25,15)")]
        public double LatitudeDelta  { get; set; } // yakınlaştıma boyutu (enlem)
        //[Column(TypeName = "decimal(25,15)")]
        public double LongitudeDelta { get; set; } // yakınlaştıma boyutu (boylam)
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; } // Kurum Çalışma durumu --->  true = çalışıyor false = çalışmıyor
        public byte Radius { get; set; }
    }
}
