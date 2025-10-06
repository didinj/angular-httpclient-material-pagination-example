// import { CommonModule } from '@angular/common';
// import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { UserService } from '../../services/user.service';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   username: string;
// }

// @Component({
//   selector: 'app-table',
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatProgressSpinnerModule
//   ],
//   templateUrl: './table.component.html',
//   styleUrl: './table.component.scss'
// })
// export class TableComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['id', 'name', 'email', 'username'];
//   data: User[] = [];
//   totalItems = 0;
//   pageSize = 5;
//   currentPage = 1;
//   searchQuery = '';
//   sortField = '';
//   sortOrder = 'asc';
//   isLoading = false;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(private userService: UserService) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   ngAfterViewInit() {
//     // Listen for sort and pagination changes
//     this.sort.sortChange.subscribe((sort: Sort) => {
//       this.sortField = sort.active;
//       this.sortOrder = sort.direction || 'asc';
//       this.paginator.firstPage();
//       this.loadUsers();
//     });
//   }

//   loadUsers(): void {
//     this.isLoading = true;
//     this.userService
//       .getUsers(this.currentPage, this.pageSize, this.searchQuery, this.sortField, this.sortOrder)
//       .subscribe({
//         next: (response) => {
//           this.data = response.users;
//           this.totalItems = response.total;
//           this.isLoading = false;
//         },
//         error: (err) => {
//           console.error('Failed to load users:', err);
//           this.isLoading = false;
//         },
//       });
//   }

//   onPageChange(event: PageEvent): void {
//     this.pageSize = event.pageSize;
//     this.currentPage = event.pageIndex + 1;
//     this.loadUsers();
//   }

//   applyFilter(event: Event): void {
//     const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
//     this.searchQuery = value;
//     this.currentPage = 1;
//     this.loadUsers();
//   }
// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableService, User } from '../../services/table.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];
  dataSource = new MatTableDataSource<User>();
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;
  currentSortField = 'id';
  currentSortDirection: 'asc' | 'desc' = 'asc';
  currentSearch = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.tableService
      .getPaginatedUsers(
        this.currentPage + 1,
        this.pageSize,
        this.currentSortField,
        this.currentSortDirection,
        this.currentSearch
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.totalItems = response.total;
        },
        error: (err) => console.error('Error loading users:', err),
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  onSortChange(sort: Sort): void {
    this.currentSortField = sort.active;
    this.currentSortDirection = sort.direction === '' ? 'asc' : (sort.direction as 'asc' | 'desc');
    this.loadUsers();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currentSearch = filterValue.trim().toLowerCase();
    this.currentPage = 0; // reset to first page
    this.loadUsers();
  }
}
