using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadStatus",
                table: "Barcodes");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Barcodes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Entreance",
                table: "Barcodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Exit",
                table: "Barcodes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entreance",
                table: "Barcodes");

            migrationBuilder.DropColumn(
                name: "Exit",
                table: "Barcodes");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Barcodes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ReadStatus",
                table: "Barcodes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
