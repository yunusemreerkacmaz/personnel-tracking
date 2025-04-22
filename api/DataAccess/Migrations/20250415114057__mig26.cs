using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "DeviceBrand",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "DeviceModelName",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "DeviceToken",
                table: "Barcodes");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Users",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Users",
                newName: "EndTime");

            migrationBuilder.RenameColumn(
                name: "UpdateTime",
                table: "Barcodes",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "DeleteTime",
                table: "Barcodes",
                newName: "EndDate");

            migrationBuilder.AlterColumn<double>(
                name: "LongitudeDelta",
                table: "Stores",
                type: "double",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<double>(
                name: "Longitude",
                table: "Stores",
                type: "double",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<double>(
                name: "LatitudeDelta",
                table: "Stores",
                type: "double",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "Stores",
                type: "double",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<double>(
                name: "Longtitude",
                table: "Barcodes",
                type: "double",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "Barcodes",
                type: "double",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeviceId",
                table: "Barcodes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Devices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    DeviceModelName = table.Column<string>(type: "varchar(100)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeviceBrand = table.Column<string>(type: "varchar(100)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeviceToken = table.Column<string>(type: "varchar(100)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreateTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeleteTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateTime = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devices", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Devices");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "Barcodes");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Users",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Users",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Barcodes",
                newName: "UpdateTime");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Barcodes",
                newName: "DeleteTime");

            migrationBuilder.AlterColumn<decimal>(
                name: "LongitudeDelta",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<decimal>(
                name: "LatitudeDelta",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<decimal>(
                name: "Longtitude",
                table: "Barcodes",
                type: "decimal(25,15)",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Barcodes",
                type: "decimal(25,15)",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateTime",
                table: "Barcodes",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeviceBrand",
                table: "Barcodes",
                type: "varchar(100)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DeviceModelName",
                table: "Barcodes",
                type: "varchar(100)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DeviceToken",
                table: "Barcodes",
                type: "varchar(500)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
