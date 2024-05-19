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
      return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.installment_requests.addEdit}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.installment_requests.addEdit}`, data);
  }
  
}
