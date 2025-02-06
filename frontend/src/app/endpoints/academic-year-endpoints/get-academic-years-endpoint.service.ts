import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {buildHttpParams} from '../../helper/http-params.helper';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyPagedList} from '../../helper/my-paged-list';

export interface AcademicYearsGetAllResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AcademicYearsGetAllEndpointService {
  private apiUrl = `${MyConfig.api_address}/academicYears`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync() {


    return this.httpClient.get<AcademicYearsGetAllResponse[]>(`${this.apiUrl}`);
  }
}
