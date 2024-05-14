import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-kids-requests',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './kids-requests.component.html',
  styleUrls: ['./kids-requests.component.scss']
})
export class KidsRequestsComponent {

}
