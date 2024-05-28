import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TuitionExpensesService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getTuitionExpensesList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, schoolId?: any, kidId?: any): Observable<any> {
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
    if (schoolId) {
      params = params?.append("school_id", schoolId);
    }
    if (kidId) {
      params = params?.append("kid_id", kidId);
    }
    if (sort && Object.keys(sort)?.length > 0) {
      params = params?.append("sort", JSON?.stringify(sort));
    }
    if (conditions && conditions?.length > 0) {
      params = params?.append("conditions", JSON?.stringify(conditions));
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.tuitionExpenses.tuitionExpenses}`, { params: params });
  }
  addEditTuitionExpense(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.tuitionExpenses.tuitionExpenses}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.tuitionExpenses.tuitionExpenses}`, data);
  }
  getTuitionExpenseById(id: any): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.tuitionExpenses.tuitionExpenses}/${id}`)
  }
  deleteTuitionExpenseById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roots?.dashboard.tuitionExpenses.tuitionExpenses}/` + id);
  }
}
