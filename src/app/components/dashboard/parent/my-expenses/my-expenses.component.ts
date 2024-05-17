import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-expenses',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './my-expenses.component.html',
  styleUrls: ['./my-expenses.component.scss']
})
export class MyExpensesComponent {

}
