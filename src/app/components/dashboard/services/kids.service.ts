import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KidsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getKidsList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.kids.kids}`, { params: params });
  }
  addEditKid(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.kids.kids}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.kids.kids}`, data);
  }
  getKidById(id: any): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.kids.kids}/${id}`)
  }
  deleteKidById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roots?.dashboard.kids.kids}/` + id);
  }
  getLevelsList(): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.kids.levels}`)
  }
}
