using Entity;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Contexts
{
    public class PersonnelTrackingContext : DbContext
    {
        public PersonnelTrackingContext()
        {
        }
        public PersonnelTrackingContext(DbContextOptions<PersonnelTrackingContext> options):base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Barcode> Barcodes { get; set; }
        public DbSet<ForgottenPassword> ForgottenPasswords { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Device> Devices { get; set; }
    }
}
