import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(page: number, limit: number, search: string = '', sortField: string = '', sortOrder: string = 'asc'): Observable<{ users: User[]; total: number }> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((data) => {
        // Apply search filter
        let filtered = data;
        if (search) {
          filtered = filtered.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Apply sorting
        if (sortField) {
          filtered = filtered.sort((a, b) => {
            const fieldA = (a as any)[sortField];
            const fieldB = (b as any)[sortField];
            if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // Apply pagination manually
        const start = (page - 1) * limit;
        const end = start + limit;
        const paged = filtered.slice(start, end);

        return { users: paged, total: filtered.length };
      })
    );
  }
}
