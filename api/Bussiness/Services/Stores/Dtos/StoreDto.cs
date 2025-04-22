namespace Bussiness.Services.Stores.Dtos
{
    public class StoreDto
    {
        public int Id { get; set; }
        public string? StoreName { get; set; }
        public TimeDto StoreTime { get; set; }
        public StoreLocationDto StoreLocation { get; set; }
        public bool IsActive { get; set; }
        public byte Radius { get; set; }
    }
    public class TimeDto
    {
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
    }
    public class StoreLocationDto
    {
        public double Latitude { get; set; }
        public double LatitudeDelta { get; set; }
        public double Longitude { get; set; }
        public double LongitudeDelta { get; set; }
    }
    public class StoreFilterDto
    {
        public string searchValue { get; set; }
    }
   
}
