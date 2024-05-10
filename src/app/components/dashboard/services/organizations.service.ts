import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getOrganizationsList(type: string, page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    params = params?.append("term", '');
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.organizations.allOrganizations}/byType/${type}`, { params: params });
  }
  addEditOrganization(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.put(`${this.baseUrl}/${roots?.dashboard?.organizations.allOrganizations}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.organizations.allOrganizations}`, data);
  }
  getOrganizationById(id: any): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.organizations.allOrganizations}/${id}`);
  }
  deleteOrganizationById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roots?.dashboard.organizations.allOrganizations}/` + id);
  }
}
