using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Lng",
                table: "Barcodes",
                newName: "DeviceModelName");

            migrationBuilder.RenameColumn(
                name: "Lat",
                table: "Barcodes",
                newName: "DeviceBrand");

            migrationBuilder.AddColumn<bool>(
                name: "AreaControl",
                table: "Barcodes",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeviceToken",
                table: "Barcodes",
                type: "varchar(500)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Latitude",
                table: "Barcodes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Longtitude",
                table: "Barcodes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AreaControl",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "DeviceToken",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "Longtitude",
                table: "Barcodes");

            migrationBuilder.RenameColumn(
                name: "DeviceModelName",
                table: "Barcodes",
                newName: "Lng");

            migrationBuilder.RenameColumn(
                name: "DeviceBrand",
                table: "Barcodes",
                newName: "Lat");
        }
    }
}
