import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { StateService } from 'src/app/services/state.service';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AvatarComponent
    }
  ]
})
export class AvatarComponent implements OnInit, ControlValueAccessor {
  file: string = '';
  
  constructor(
    public dialog: MatDialog,
    private stateService: StateService) {
  }

  ngOnInit(): void {}

  writeValue(_file: string): void {
    this.file = _file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange = (fileUrl: string) => {};

  onTouched = () => {};

  disabled: boolean = false;

  onFileChange(event: any) {
    const files = event.target.files as FileList;
  
    if (files.length > 0) {
      this.readAndSendImage(files[0]);
    }
  }

  readAndSendImage(file: File) {
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        this.sendImageToServer(base64String);
        this.openAvatarEditor(file);
      } else {
        console.error('Error al leer el archivo');
      }
    };
  
    reader.onerror = (error) => {
      console.error('Error al leer el archivo', error);
    };
  
    reader.readAsDataURL(file);
  }

  sendImageToServer(base64String: string) {
    this.stateService.setImageBase64String(base64String);
  }

  openAvatarEditor(file: File) {
    const _file = URL.createObjectURL(file);
    this.resetInput();
    this.openAvatarEditorDialog(_file).subscribe((result) => {
      if (result) {
        this.file = result;
        this.onChange(this.file);
      }
    });
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }

  openAvatarEditorDialog(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

}
