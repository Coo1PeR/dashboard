//////////////////////
    // UNUSED //
//////////////////////

import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {
  @Output() fileDropped = new EventEmitter<File>();

  constructor(private el: ElementRef) {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.remove('drag-over');

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.fileDropped.emit(file);
    }
  }
}
