import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentGetAllResponse } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { StudentGetAllEndpointService } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { StudentDeleteEndpointService } from '../../../endpoints/student-endpoints/student-delete-endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MyDialogConfirmComponent } from '../../shared/dialogs/my-dialog-confirm/my-dialog-confirm.component';
import {MySnackbarHelperService} from '../../shared/snackbars/my-snackbar-helper.service';
import {MyDialogSimpleComponent} from '../../shared/dialogs/my-dialog-simple/my-dialog-simple.component';
import {StudentRestoreEndpointService} from '../../../endpoints/student-endpoints/student-restore-endpoint.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: false
})
export class StudentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'studentNumber', 'actions'];
  dataSource: MatTableDataSource<StudentGetAllResponse> = new MatTableDataSource<StudentGetAllResponse>();
  students: StudentGetAllResponse[] = [];
  tekst: string = 'Ne prikazuj obrisane';
  isShown = true;
  deleted = {
    'color': 'gray',
    'text-decoration': 'line-through'
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private searchSubject: Subject<string> = new Subject();

  constructor(
    private studentGetService: StudentGetAllEndpointService,
    private studentDeleteService: StudentDeleteEndpointService,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog,
    private studentRestoreService: StudentRestoreEndpointService
  ) {
  }

  ngOnInit(): void {
    this.initSearchListener();
    this.fetchStudents();
  }

  initSearchListener(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((filterValue) => {
      this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const filterValue = this.dataSource.filter || '';
      this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(filterValue);
  }

  fetchStudents(filter: string = '', page: number = 1, pageSize: number = 5): void {
    this.studentGetService.handleAsync({
      q: filter,
      pageNumber: page,
      pageSize: pageSize
    }).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<StudentGetAllResponse>(data.dataItems);
        this.paginator.length = data.totalCount;
        this.students = data.dataItems;
      },
      error: (err) => {
        this.snackbar.showMessage('Error fetching students. Please try again.', 5000);
        console.error('Error fetching students:', err);
      }
    });
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {
    this.studentDeleteService.handleAsync(id).subscribe({
      next: () => {
        this.snackbar.showMessage('Student successfully deleted.');
        this.fetchStudents(); // Refresh the list after deletion
      },
      error: (err) => {
        this.snackbar.showMessage('Error deleting student. Please try again.', 5000);
        console.error('Error deleting student:', err);
      }
    });
  }

  openMyConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Potvrda brisanja',
        message: 'Da li ste sigurni da želite obrisati ovu stavku?',
        confirmButtonText: 'Obriši',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Korisnik je potvrdio brisanje');
        // Pozovite servis ili izvršite logiku za brisanje
        this.deleteStudent(id);
      } else {
        console.log('Korisnik je otkazao brisanje');
      }
    });
  }

  openStudentSemesters(id: number) {
    this.router.navigate(['/admin/student-semesters', id]);
  }

  show() {
    this.isShown = !this.isShown;
    if (this.isShown) {
      this.dataSource.data = this.students;
      this.tekst = 'Nemoj prikazivati izbrisane';
    } else {
      this.dataSource.data = this.students.filter(s => !s.isDeleted);
      this.tekst = 'Prikazi izbrisane';
    }
  }

  restoreStudent(id: number) {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Potvrda vracanja',
        message: 'Da li ste sigurni da želite vratiti ovu stavku?',
        confirmButtonText: 'Vrati',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Korisnik je potvrdio vracanje');
        // Pozovite servis ili izvršite logiku za brisanje
        this.restore(id);
      } else {
        console.log('Korisnik je otkazao vracanje');
      }
    });
  }

  private restore(id: number) {
    this.studentRestoreService.handleAsync(id).subscribe({
      next: (data) => {
        this.fetchStudents();
      },
    })
  }
}
