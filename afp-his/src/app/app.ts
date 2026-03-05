import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { DarkmodeSelector } from './ui/darkmode-selector/darkmode-selector';
import { Button } from 'primeng/button';
import { Header } from "./ui/header/header";

@Component({
  selector: 'app-root',
  imports: [DarkmodeSelector, RouterLink, Button, RouterModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('afp-his');
}
