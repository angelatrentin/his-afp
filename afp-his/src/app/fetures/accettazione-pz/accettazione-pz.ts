import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GestioneRisorse } from '../../core/risorse/gestione-risorse';
import { JsonPipe } from '@angular/common';
import { InputText } from "primeng/inputtext";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { Paziente } from '../../../../../his-afp/src/app/core/Pazienti/Pazienti.model';

@Component({
  selector: 'his-accettazione-pz',
  imports: [JsonPipe, InputText, ReactiveFormsModule, Button],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  GestioneRisorse = inject(GestioneRisorse);
  // paziente = new FormGroup ({
  //   nome: new FormControl('', [Validators.required]),
  //   cognome: new FormControl('', [Validators.required]),
  // });

  readonly #fb = inject(FormBuilder);

  Paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: ['', [Validators.required]],
      codiceFiscale: ['', [Validators.required]],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required]],
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
    }else{
      this.Paziente.markAllAsTouched();
    }
  }
}
