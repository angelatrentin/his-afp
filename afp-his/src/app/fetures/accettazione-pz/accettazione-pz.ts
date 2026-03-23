import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GestioneRisorse } from '../../core/risorse/gestione-risorse';
import { JsonPipe } from '@angular/common';
import { InputText } from "primeng/inputtext";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";

@Component({
  selector: 'his-accettazione-pz',
  imports: [JsonPipe, InputText, ReactiveFormsModule, Button],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  GestioneRisorse = inject(GestioneRisorse);

  paziente = new FormGroup ({
    nome: new FormControl('', [Validators.required]),
    cognome: new FormControl('', [Validators.required]),
    residenza: new FormGroup ({
      via: new FormControl(),
      civico: new FormControl(),
    })
  });
  checkFormControl(control: string) {
    const fc = this.paziente.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);

    // si può usare anche scritto così
    // if (fc) {
    //   fc?.invalid && (fc?.touched || fc?.dirty);
    // }
    // return null;
  }

  checkFormControlError(control: string, error: string) {
    const fc = this.paziente.get(control);

    if(fc && fc.hasError(error)) {
      return fc.getError(error);
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.paziente.valid) {
      console.log(this.paziente.value);
    }else{
      this.paziente.markAllAsTouched();
    }
  }
}
