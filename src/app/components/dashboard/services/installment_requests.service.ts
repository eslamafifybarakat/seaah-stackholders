import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstallmentRequestsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  addEditInstallmentRequest(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.myExpenses.addEdit}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.myExpenses.addEdit}`, data);
  }
  getMyExpenseList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, approval_status?: any,schoolId?:any): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params?.append("page_number", page);
    }
    if (per_page) {
      params = params?.append("page_size", per_page);
    }
    if (search) {
      params = params?.append("search", search);
    }
    if (sort && Object.keys(sort)?.length > 0) {
      params = params?.append("sort", JSON?.stringify(sort));
    }
    if (conditions && conditions?.length > 0) {
      params = params?.append("conditions", JSON?.stringify(conditions));
    }
    if (approval_status) {
      params = params?.append("approve_status", approval_status);
    }
    if (schoolId) {
      params = params?.append("school_id", schoolId);
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.myExpenses.getAll}`, { params: params });
  }
  
  
}
