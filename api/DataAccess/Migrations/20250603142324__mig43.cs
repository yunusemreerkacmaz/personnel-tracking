using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig43 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalTime",
                table: "UserShiftPlans",
                newName: "TotalWorkTime");

            migrationBuilder.AddColumn<string>(
                name: "TotalShiftTime",
                table: "ShiftPlans",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalShiftTime",
                table: "ShiftPlans");

            migrationBuilder.RenameColumn(
                name: "TotalWorkTime",
                table: "UserShiftPlans",
                newName: "TotalTime");
        }
    }
}
