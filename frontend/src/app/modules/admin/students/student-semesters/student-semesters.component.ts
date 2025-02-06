import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  CityGetAll1EndpointService,
  CityGetAll1Response
} from '../../../../endpoints/city-endpoints/city-get-all1-endpoint.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CityDeleteEndpointService} from '../../../../endpoints/city-endpoints/city-delete-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  SemesterByStudentIdResponse, SemesterGetByStudentIdEndpointService
} from '../../../../endpoints/semester-endpoints/semester-get-by-student-id-endpount.service';
import {
  StudentGetByIdEndpointService,
  StudentGetByIdResponse
} from '../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';

@Component({
  selector: 'app-student-semesters',
  standalone: false,

  templateUrl: './student-semesters.component.html',
  styleUrl: './student-semesters.component.css'
})
export class StudentSemestersComponent {
  displayedColumns: string[] = ['id', 'academicYear', 'yearOfStudy', 'renewal', 'date','recordedBy'];
  dataSource: MatTableDataSource<SemesterByStudentIdResponse> = new MatTableDataSource<SemesterByStudentIdResponse>();
 studentId:number;
  studentName:string;
  studentLastName:string;
  semesters: SemesterByStudentIdResponse[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private semestersGetService: SemesterGetByStudentIdEndpointService,
    private cityDeleteService: CityDeleteEndpointService,
    private router: Router,
    private dialog: MatDialog,
    private route:ActivatedRoute,
    private studentGetService:StudentGetByIdEndpointService
  ) {
    this.studentId=0;
    this.studentName='';
    this.studentLastName='';
  }

  ngOnInit(): void {
    this.studentId=Number(this.route.snapshot.paramMap.get('id'));
    if(this.studentId){
      this.fetchSemesters(this.studentId);
    }

    this.fetchStudent();
  this.studentGetService.handleAsync(this.studentId).subscribe({next:(data)=>{
    this.studentName=data.firstName;
      this.studentLastName=data.lastName;
    }
  })

  }

  private fetchStudent() {

  }

  private fetchSemesters(studentId: number) {
    this.semestersGetService.handleAsync(studentId).subscribe({next:(data)=>{
      this.dataSource.data=data;
      this.semesters=data;
      this.studentName=this.semesters[0].studentName;
      this.studentLastName=this.semesters[0].studentLastName;

      }})
  }

  enroll(id: number) {
    this.router.navigate(['/admin/student-semesters-new', id]);
  }
}
