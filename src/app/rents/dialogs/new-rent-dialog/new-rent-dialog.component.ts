import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DATE_FORMATS,
  MatDateFormats,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DocumentLoaderComponent } from '../../../shared/components/document-loader/document-loader.component';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { CreateRentRequest } from '../../interfaces/create-rent.interface';
import { RentService } from '../../rents.service';

const DD_MM_YYYY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const RENT_CREATED = 'El alquiler fue dado de alta con éxito!';

interface NewRentInfo {
  contactId: string;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  issuerFullName: string;
}

interface RentDuration {
  id: number;
  label: string;
}

interface RaiseIndex {
  id: string;
  label: string;
}

@Component({
  selector: 'app-new-rent-dialog',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatLabel,
    MatInput,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    DocumentLoaderComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './new-rent-dialog.component.html',
  styleUrl: './new-rent-dialog.component.css',
})
export class NewRentDialogComponent {
  private _data: NewRentInfo = inject(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);
  private _rentsService = inject(RentService);
  private _notificationService = inject(NotificationService);
  private _matDialogRef = inject(MatDialogRef);

  isLoading = signal(false);
  contactId = this._data.contactId;
  propertyId = this._data.propertyId;
  propertyName = this._data.propertyName;
  issuerFullName = this._data.issuerFullName;

  form: FormGroup;
  rentDurationOptions: RentDuration[] = [
    {
      id: 0.5,
      label: '6 meses',
    },
    {
      id: 1,
      label: '1 año',
    },
    {
      id: 1.5,
      label: '1 año y medio',
    },
    {
      id: 2,
      label: '2 años',
    },
    {
      id: 3,
      label: '3 años',
    },
    {
      id: 0,
      label: 'Indefinida',
    },
  ];
  raiseIndexOptions: RaiseIndex[] = [
    {
      id: 'ICL',
      label: 'Índice de Contratos de Locación (ICL)',
    },
    {
      id: 'IPC',
      label: 'Índice de Precios al Consumidor (IPC)',
    },
    {
      id: 'CasaPropia',
      label: 'Índice de CasaPropia / HogAr / Procrear',
    },
    {
      id: 'IS',
      label: 'Índice de Salarios (IS)',
    },
  ];

  constructor() {
    this.form = this._formBuilder.group({
      initialDate: this._formBuilder.control<Date>(new Date(), [
        Validators.required,
      ]),
      duration: this._formBuilder.control<number>(0.5, [
        Validators.required,
        Validators.min(0),
      ]),
      payday: this._formBuilder.control<number>(10, [
        Validators.required,
        Validators.min(0),
      ]),
      price: this._formBuilder.control<number>(this._data.propertyPrice, [
        Validators.required,
        Validators.min(0),
      ]),
      raiseIndex: this._formBuilder.control<string>('ICL', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      raiseMonths: this._formBuilder.control<number>(3, [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
      ]),
      document: this._formBuilder.control<File | null>(null, [
        Validators.required,
      ]),
    });
  }

  handleDocumentUploaded(file: File) {
    this.uploadDocumentAndMarkTouchedControl(file);
  }

  handleDocumentRemoved() {
    this.uploadDocumentAndMarkTouchedControl(null);
  }

  handleSubmit() {
    this.isLoading.set(true);
    const formValue = this.form.value;
    const request = this.buildRequest(formValue);
    const contract = formValue.document as File;
    this._rentsService.createProperty(request, contract).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._notificationService.success(RENT_CREATED, 3000);
        this._matDialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  private uploadDocumentAndMarkTouchedControl(document: File | null) {
    this.form.patchValue({ document: document });
    this.form.get('document')?.markAsTouched();
  }

  private buildRequest(value: any): CreateRentRequest {
    return {
      contactId: this.contactId as string,
      date: value.initialDate.toISOString().substring(0, 10),
      yearsDuration: value.duration as number,
      payday: value.payday as number,
      price: value.price as number,
      raiseIndex: value.raiseIndex as string,
      raiseMonths: value.raiseMonths as number,
    };
  }
}
