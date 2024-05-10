import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUsersList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params?.append("page_number", page);
    }
    if (per_page) {
      params = params?.append("page_size", per_page);
    }
    if (search) {
      params = params?.append("search", search);
    }else {
      params = params?.append("search", "");
    }
    if (sort && Object.keys(sort)?.length > 0) {
      params = params?.append("sort", JSON?.stringify(sort));
    }
    if (conditions && conditions?.length > 0) {
      params = params?.append("conditions", JSON?.stringify(conditions));
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.users.users}`, { params: params });
  }
  addUser(data: any): Observable<any> {
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.clients.addClient}`, data);
  }
  editUser(data: any, id: number | string): Observable<any> {
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.clients.editClient}/6`, data);
  }
  deleteUserById(id: number, data: any): Observable<any> {
    let params = new HttpParams();
    if (data?.name) {
      params = params.append("name", data?.name);
    }
    return this.http.delete<any>(`${this.baseUrl}${roots?.dashboard.clients.deleteClients}/delete/` + id, { params: params });
  }
}
