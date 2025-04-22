using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "LongitudeDelta",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AlterColumn<decimal>(
                name: "LatitudeDelta",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "LongitudeDelta",
                table: "Stores",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<float>(
                name: "LatitudeDelta",
                table: "Stores",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");
        }
    }
}
