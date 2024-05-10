import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../services/generic/alerts.service';
import { PublicService } from '../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { patterns } from '../../../../shared/configs/patterns';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, CalendarModule], selector: 'filter-installment-ways',
  templateUrl: './filter-installment-ways.component.html',
  styleUrls: ['./filter-installment-ways.component.scss']
})
export class FilterInstallmentWaysComponent {
  installmentWaysForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      description: ['', {
        validators: [
          Validators.required, Validators.minLength(6)], updateOn: "blur"
      }]
    }
  );
  get formControls(): any {
    return this.installmentWaysForm?.controls;
  }
  constructor(
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    let data = this.config.data;
    if (data) {
      this.patchValue(data);
    }
  }

  patchValue(data: any): void {
    let filters = data;
    filters.forEach((item: any) => {
      if (item.column == 'name') {
        this.formControls.name.setValue(item.data);
      }
      if (item.column == 'description') {
        this.formControls.description.setValue(item.data);
      }
    });
  }

  submit(): any {
    let data = {
      fullName: this.installmentWaysForm?.value?.name,
      mobileNumber: this.installmentWaysForm?.value?.description,
    };
    let conditions = [];
    for (const [key, value] of Object.entries(data)) {
      // Check if the value exists and is not empty
      if (value) {
        // Determine the operator based on the type of data
        const operator = (typeof value === 'string') ? 'startsWith' : 'dateIs';
        // Push the condition object into the conditions array
        conditions.push({ "column": key, "type": typeof value, "data": value, "operator": operator });
      }
    }
    this.ref.close({ conditions: conditions });
  }

  close(): void {
    this.ref.close();
  }
}
