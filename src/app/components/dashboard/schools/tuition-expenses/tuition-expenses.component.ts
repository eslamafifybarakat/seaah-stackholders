import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-tuition-expenses',
  templateUrl: './tuition-expenses.component.html',
  styleUrls: ['./tuition-expenses.component.scss']
})
export class TuitionExpensesComponent {

}
