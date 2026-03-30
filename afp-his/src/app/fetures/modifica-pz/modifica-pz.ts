import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { APIResponse } from '../../core/models/APIResponse.model';
import { CommonModule, formatDate, JsonPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { PazienteDTO, Paziente } from '../../core/pazienti/Pazienti.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GestioneRisorse } from '../../core/risorse/gestione-risorse';
import { FieldsetModule } from "primeng/fieldset";
import { Message } from "primeng/message";
import { DatePicker } from "primeng/datepicker";
import { Select } from "primeng/select";
import { InputText } from "primeng/inputtext";
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'his-modifica-pz',
  imports: [JsonPipe, Button, FieldsetModule, Message, DatePicker, Select, InputText, ReactiveFormsModule, Textarea],
  templateUrl: './modifica-pz.html',
  styleUrl: './modifica-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaPz {
  GestioneRisorse = inject(GestioneRisorse);
  patientId = input<string>();
  patientReq = httpResource<APIResponse<PazienteDTO>>(
    () => `http://localhost:3000/admissions/${this.patientId()}`,
  );

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
    residenza: this.#fb.group({
      via: ['', [Validators.required]],
      civico: ['', [Validators.required]],
      comune: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
    }),
  });

  
  constructor() {
    effect(() => {
      if (this.patientId() === undefined) {
        console.warn(
          'Patient ID is undefined. Please provide a valid patient ID in the route parameters.',
        );
      }
      if(this.patientReq.hasValue()){
         const data = this.patientReq.value().data;
         untracked(()=>{
            this.Paziente.patchValue({
              anagrafica: {
                nome: data.nome,
                cognome: data.cognome,
                dataNascita: formatDate(data.dataNascita, 'dd/MM/yyyy', 'en'),
                codiceFiscale: data.codiceFiscale,
                sesso: data.sex,
              },
              sanitaria: {
            patologia: data.patologiaCode,
            modArrivo: data.modalitaArrivoCode,
            noteTriage: data.noteTriage,
            codiceColore: data.coloreCode,
            },
              residenza: {
                via: data.indirizzoVia,
                civico: data.indirizzoCivico,
                comune: data.comune,
                provincia: data.provincia,
            },
          });
          this.Paziente.get('anagrafica')?.disable();
          this.Paziente.get('sanitaria')?.disable();
        });
      }
    });
  }

  checkFormControl(control: string) {
      const fc = this.Paziente.get(control);
      return fc?.invalid && (fc.touched || fc.dirty);
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
        // this.PatientManager.admitPatient(
        //   this.Paziente.value as PatientAdmission
        // );
      } else {
        this.Paziente.markAllAsTouched();
      }
    }
}
