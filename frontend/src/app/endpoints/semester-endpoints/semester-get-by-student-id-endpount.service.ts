import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';

export interface SemesterByStudentIdResponse {

  id:number;
  studentId:number;
  studentName:string;
  studentLastName:string;
  academicYearId:number;
  academicYear:string;
  recordedById:number;
  recordedBy:string;
  date:string;
  renewal:boolean;
  tuition:number;
  yearOfStudy:number;

}

@Injectable({
  providedIn: 'root'
})
export class SemesterGetByStudentIdEndpointService
  implements MyBaseEndpointAsync<number, SemesterByStudentIdResponse[]> {
  private apiUrl = `${MyConfig.api_address}/semesters`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(id: number) {
    return this.httpClient.get<SemesterByStudentIdResponse[]>(`${this.apiUrl}/${id}`);
  }
}
