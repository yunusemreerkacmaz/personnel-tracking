namespace Bussiness.Helper.Dtos
{
    public class LocationDto
    {
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool? IsInArea { get; set; }
        public string? Address { get; set; }
    }
}
