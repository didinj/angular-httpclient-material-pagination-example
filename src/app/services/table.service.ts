import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface PaginatedResponse {
  data: User[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = 'http://localhost:3000/users'; // URL from your json-server mock API

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getPaginatedUsers(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    search: string
  ): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit)
      .set('_sort', sortField)
      .set('_order', sortOrder);

    if (search) {
      params = params.set('q', search);
    }

    return this.http.get<PaginatedResponse>(this.apiUrl, {
      params,
      observe: 'response'
    }).pipe(map(response => ({
      data: response.body as unknown as User[],
      total: Number(response.headers.get('X-Total-Count'))
    })));
  }
}
