using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using RS1_2024_25.API.Helper.Api;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Endpoints.WinterSemesterEndpoints
{
    [Route("semesters")]
    public class GetSemestersByStudentIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<SemestersResponse[]>
    {
        [HttpGet("{id}")]
        public async override Task<ActionResult<SemestersResponse[]>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            var student=await db.StudentsAll.FindAsync(id,cancellationToken);
            if(student==null)
            {
                return BadRequest("Nema tog studenta");
            }
            return await db.WinterSemester.Where(s => s.StudentId == id).Select(s => new SemestersResponse
            {
                Id = s.Id,
                StudentId = s.StudentId,
                StudentName = s.Student.User.FirstName,
                StudentLastName = s.Student.User.LastName,
                YearOfStudy = s.YearOfStudy,
                AcademicYearId = s.AcademicYearId,
                AcademicYear = s.AcademicYear.Description,
                RecordedById = s.RecordedById,
                RecordedBy = s.RecordedBy.FirstName,
                Renewal = s.Renewal,
                Tuition = s.Tuition,
                Date = DateOnly.FromDateTime(s.Date)
            }).ToArrayAsync(cancellationToken);
        }
    }
    public class SemestersResponse
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentLastName { get; set; }
        public int AcademicYearId { get; set; }
        public string AcademicYear { get; set; }
        public int RecordedById { get; set; }
        public string RecordedBy { get; set; }
        public DateOnly Date { get; set; }
        public bool Renewal { get; set; }
        public float Tuition { get; set; }
        public int YearOfStudy { get; set; }
    }

    }
