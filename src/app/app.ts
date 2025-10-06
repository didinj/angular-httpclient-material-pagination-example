import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TableComponent } from './components/table.component/table.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TableComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-pagination-demo');
}
