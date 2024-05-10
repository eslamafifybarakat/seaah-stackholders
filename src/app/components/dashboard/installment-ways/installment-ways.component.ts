import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-installment-ways',
  templateUrl: './installment-ways.component.html',
  styleUrls: ['./installment-ways.component.scss']
})
export class InstallmentWaysComponent {

}
