using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig38 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Barcodes");

            migrationBuilder.DropTable(
                name: "Biometrics");

            migrationBuilder.CreateTable(
                name: "EntryExitRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Entreance = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Exit = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Latitude = table.Column<double>(type: "double", nullable: true),
                    Longtitude = table.Column<double>(type: "double", nullable: true),
                    AreaControl = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true),
                    DeviceId = table.Column<int>(type: "int", nullable: true),
                    ApprovingAuthorityId = table.Column<int>(type: "int", nullable: false),
                    EntranceActionType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExitActionType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntryExitRecords", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EntryExitRecords");

            migrationBuilder.CreateTable(
                name: "Barcodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ApprovingAuthorityId = table.Column<int>(type: "int", nullable: false),
                    AreaControl = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    DeviceId = table.Column<int>(type: "int", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EntranceOrExitId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Entreance = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Exit = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Latitude = table.Column<double>(type: "double", nullable: true),
                    Longtitude = table.Column<double>(type: "double", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Barcodes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Biometrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ApprovingAuthorityId = table.Column<int>(type: "int", nullable: false),
                    AreaControl = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    DeviceId = table.Column<int>(type: "int", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EntranceOrExitId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Entreance = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Exit = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Latitude = table.Column<double>(type: "double", nullable: true),
                    Longtitude = table.Column<double>(type: "double", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Biometrics", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
