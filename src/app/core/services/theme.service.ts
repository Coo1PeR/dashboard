import {Injectable, signal} from '@angular/core';

let themeStorage = localStorage.getItem('theme') || 'dark';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  constructor() {
    this.setTheme(themeStorage);
    document.getElementsByTagName('body')[0].className = themeStorage;
  }

  themeSignal = signal<string>(themeStorage)

  setTheme(theme: string) {
    this.themeSignal.set(theme)
  }

  updateTheme() {
    this.themeSignal.update((value) => (value === 'light' ? 'dark' : 'light'))
    localStorage.setItem('theme', this.themeSignal())
    document.getElementsByTagName('body')[0].className = this.themeSignal()
  }
}
