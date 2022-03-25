import { Component, Optional, Input, NgModule, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  /* ControlValueAccessor define una interface que actua como puente entre Angular forms API
   y los element nativos de DOM*/
  @Input() label: string;
  @Input() type: 'text';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {


  }

  registerOnChange(fn: any): void {


  }

  registerOnTouched(fn: any): void {


  }




}
