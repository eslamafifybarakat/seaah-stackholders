import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tuition',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tuition.component.html',
  styleUrls: ['./tuition.component.scss']
})
export class TuitionComponent {

}
