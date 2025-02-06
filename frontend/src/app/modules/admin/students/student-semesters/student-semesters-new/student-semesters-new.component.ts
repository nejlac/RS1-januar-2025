import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  CountryLookupEndpointService,
  CountryLookupResponse
} from '../../../../../endpoints/lookup-endpoints/country-lookup-endpoint.service';
import {
  RegionLookupEndpointService,
  RegionLookupResponse
} from '../../../../../endpoints/lookup-endpoints/region-lookup-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CityGetByIdEndpointService} from '../../../../../endpoints/city-endpoints/city-get-by-id-endpoint.service';
import {
  CityUpdateOrInsertEndpointService
} from '../../../../../endpoints/city-endpoints/city-update-or-insert-endpoint.service';
import {
  AcademicYearsGetAllEndpointService,
  AcademicYearsGetAllResponse
} from '../../../../../endpoints/academic-year-endpoints/get-academic-years-endpoint.service';
import {
  SemesterCreateEndpointService,
  SemesterCreateRequest
} from '../../../../../endpoints/semester-endpoints/semester-create-endpoint.service';
import {MyAuthService} from '../../../../../services/auth-services/my-auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  SemesterByStudentIdResponse,
  SemesterGetByStudentIdEndpointService
} from '../../../../../endpoints/semester-endpoints/semester-get-by-student-id-endpount.service';

@Component({
  selector: 'app-student-semesters-new',
  standalone: false,

  templateUrl: './student-semesters-new.component.html',
  styleUrl: './student-semesters-new.component.css'
})
export class StudentSemestersNewComponent {
  semesterForm: FormGroup;
  studentId: number;
  years: AcademicYearsGetAllResponse[] = [];
  semesters:SemesterByStudentIdResponse[]=[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private academicYearsGetService:AcademicYearsGetAllEndpointService,
    private myAuth:MyAuthService,
    private createSemesterService:SemesterCreateEndpointService,
    private snackBar :MatSnackBar,
    private getSemestersEndpoint:SemesterGetByStudentIdEndpointService

  ) {
    this.studentId = 0;

    this.semesterForm = this.fb.group({
      date: ['', Validators.required],
      yearOfStudy: [null, [Validators.required, Validators.min(1),Validators.max(5)]],
      academicYearId: [0, [Validators.required]],
      tuition: [{value:1800,disabled:true}, [Validators.required]],
      renewal: [{value:false,disabled:true}, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadYears();
this.getSemestersEndpoint.handleAsync(this.studentId).subscribe({next:(data)=>{
  this.semesters=data;
  }})

    this.semesterForm.get('yearOfStudy')?.valueChanges.subscribe((year: number) => {
      const obnova=this.semesters.find(s=>s.yearOfStudy==this.semesterForm.get('yearOfStudy')?.value);
      if(obnova) {
        this.semesterForm.get('tuition')?.setValue(400);
        this.semesterForm.get('renewal')?.setValue(true);
      }
      else{
        this.semesterForm.get('tuition')?.setValue(1800);
        this.semesterForm.get('renewal')?.setValue(false);
      }

    });
  }

  private loadYears() {
this.academicYearsGetService.handleAsync().subscribe({next:(data)=>{

  this.years = data;
  }})
  }

  createSemester() {
    const request:SemesterCreateRequest={
      studentId:this.studentId,
      yearOfStudy:this.semesterForm.get('yearOfStudy')?.value,
      academicYearId:this.semesterForm.get('academicYearId')?.value,
      tuition:this.semesterForm.get('tuition')?.value,
      renewal:this.semesterForm.get('renewal')?.value,
      date:this.semesterForm.get('date')?.value,
      recordedById:this.myAuth.getMyAuthInfo()?.userId

    }
    this.createSemesterService.handleAsync(request).subscribe({next:(data)=>{
        this.snackBar.open('Semester saved successfully!', 'Close', { duration: 5000 });
        this.router.navigate(['/admin/student-semesters', this.studentId]);


      },
      error: (error) => {
        this.snackBar.open('Error saving semester. Please try again.', 'Close', { duration: 5000 });
        console.error('Error saving semester', error);
      },
    })
  }
}
