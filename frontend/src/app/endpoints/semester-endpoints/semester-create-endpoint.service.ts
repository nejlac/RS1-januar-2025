import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterCreateRequest {
  studentId:number;
  academicYearId:number;
  recordedById:number | undefined;
  date:string;
  renewal:boolean;
  tuition:number;
  yearOfStudy:number;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterCreateEndpointService {
  private apiUrl = `${MyConfig.api_address}/semesters`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: SemesterCreateRequest) {
    return this.httpClient.post(`${this.apiUrl}`, request);
  }
}
