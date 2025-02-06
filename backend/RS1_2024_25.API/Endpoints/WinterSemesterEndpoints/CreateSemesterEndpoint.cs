using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using RS1_2024_25.API.Helper.Api;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Endpoints.WinterSemesterEndpoints
{
    [Route("semesters")]
    public class CreateSemesterEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<CreateSemesterRequest>.WithActionResult<SemestersResponse>
    {
        [HttpPost]
        public async override Task<ActionResult<SemestersResponse>> HandleAsync(CreateSemesterRequest request, CancellationToken cancellationToken = default)
        {
            var student = await db.StudentsAll.FindAsync(request.StudentId, cancellationToken);
            var godina=await db.AcademicYears.FindAsync(request.AcademicYearId,cancellationToken);
            var user=await db.MyAppUsers.Where(u=>u.ID==request.RecordedById).FirstOrDefaultAsync(cancellationToken);
            await db.MyAppUsers.LoadAsync(cancellationToken);
            if(student!=null && godina!=null && user!=null)
            {
                var obnova=await db.WinterSemester.Where(w=>w.YearOfStudy==request.YearOfStudy && w.StudentId==request.StudentId).FirstOrDefaultAsync(cancellationToken);
                if(obnova!=null)
                {
                    request.Renewal=true;
                    request.Tuition = 400;
                }
                else
                {
                    request.Renewal = false;
                    request.Tuition = 1800;
                }
                var novi = new WinterSemester()
                {
                    StudentId = student.ID,
                    Student = student,
                    AcademicYear = godina,
                    AcademicYearId = request.AcademicYearId,
                    Renewal = request.Renewal,
                    Tuition = request.Tuition,
                    RecordedById = request.RecordedById,
                    RecordedBy = user,
                    Date = request.Date,
                    YearOfStudy = request.YearOfStudy,

                };
                await db.AddAsync(novi,cancellationToken);
               await  db.SaveChangesAsync(cancellationToken);
                return new SemestersResponse
                {
                    StudentId = student.ID,
                    StudentLastName = student.User.LastName,
                    StudentName = student.User.FirstName,
                    AcademicYear = godina.Description,
                    AcademicYearId = request.AcademicYearId,
                    Renewal = request.Renewal,
                    Tuition = request.Tuition,
                    RecordedById = request.RecordedById,
                    RecordedBy = user.FirstName,
                    Date = DateOnly.FromDateTime(request.Date),
                    YearOfStudy = request.YearOfStudy,
                };
            }
            else
            {
                return new SemestersResponse();
            }

        }
    }
    public class CreateSemesterRequest
    {
        public int StudentId { get; set; }
        public int AcademicYearId { get; set; }
    
        public int RecordedById { get; set; }
        public DateTime Date { get; set; }
        public bool Renewal { get; set; }
        public float Tuition { get; set; }
        public int YearOfStudy { get; set; }
    }
}
