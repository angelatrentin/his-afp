import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from "primeng/button";
import { DarkmodeSelector } from "../darkmode-selector/darkmode-selector";
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'his-header',
  imports: [Button, DarkmodeSelector, DividerModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  reparto = environment.reparto;
  struttura = environment.struttura;

}
