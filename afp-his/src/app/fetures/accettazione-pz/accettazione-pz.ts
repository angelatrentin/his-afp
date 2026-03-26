import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GestioneRisorse } from '../../core/risorse/gestione-risorse';
import { JsonPipe } from '@angular/common';
import { InputText } from "primeng/inputtext";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { Paziente } from '../../../../../his-afp/src/app/core/Pazienti/Pazienti.model';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FieldsetModule } from 'primeng/fieldset';
import { PatientManager } from '../../core/pazienti/patient-manager';
import { PatientAdmission } from '../../core/pazienti/Pazienti.model';
@Component({
  selector: 'his-accettazione-pz',
  imports: [JsonPipe, InputText, ReactiveFormsModule, Button, MessageModule, DatePickerModule, InputMaskModule, SelectModule, TextareaModule, FieldsetModule],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  GestioneRisorse = inject(GestioneRisorse);
  PatientManager = inject(PatientManager);

  readonly maxDate=new Date();
  readonly sexOptions=[
    {
      code: 'M',
      desc: 'Maschio'
    },
    {
      code: 'F',
      desc: 'Femmina'
    }
  ];

  readonly #fb = inject(FormBuilder);

  Paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: ['', [Validators.required]],
      codiceFiscale: ['', [Validators.required, Validators.pattern("[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]")]],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    }),
  });

  checkFormControl(control: string) {
    const fc = this.Paziente.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);

    // si può usare anche scritto così
    // if (fc) {
    //   fc?.invalid && (fc?.touched || fc?.dirty);
    // }
    // return null;
  }

  checkFormControlError(control: string, error: string) {
    const fc = this.Paziente.get(control);

    if(fc && fc.hasError(error)) {
      return fc.getError(error);
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.Paziente.valid) {
      console.log(this.Paziente.value);
      this.PatientManager.admitPatient(
        this.Paziente.value as PatientAdmission
      );
    } else {
      this.Paziente.markAllAsTouched();
    }
  }
}
