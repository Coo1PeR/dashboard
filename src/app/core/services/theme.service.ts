import {Injectable, signal} from '@angular/core';

let themeStorage = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  themeSignal = signal<string>(themeStorage)

  setTheme(theme: string) {
    this.themeSignal.set(theme)
  }

  updateTheme() {
    this.themeSignal.update((value) => (value === 'light' ? 'dark' : 'light'))
    localStorage.setItem('theme', this.themeSignal())
  }
}
