import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';
import { TareaService } from 'src/app/services/tarea/tarea.service';

@Component({
  selector: 'app-update-tarea',
  templateUrl: './update-tarea.component.html',
  styleUrls: ['./update-tarea.component.css']
})
export class UpdateTareaComponent {
  
  tareaUpdateForm: FormGroup;
  
  constructor(
    private stateService: StateService,
    private tareaService: TareaService,
    private formBuilder: FormBuilder) {
      this.tareaUpdateForm = this.formBuilder.group({
        tarea: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        fechaFinalizacion: ['', Validators.required], 
        estado: ['', Validators.required]
      });
  }

  cargarDatosTarea() {
    let tareaUpdate = this.stateService.getTareaUpdate();
    if(tareaUpdate !== undefined) {
      this.tareaUpdateForm.reset({
        tarea: tareaUpdate.tarea,
        fechaFinalizacion: tareaUpdate.fecha_finalizacion,
        estado: tareaUpdate.estado.toLowerCase()
      });
    }
  }

  actualizarTarea() {
    let tareaUpdate = this.stateService.getTareaUpdate();
    if(tareaUpdate !== undefined) {
      this.tareaService.actualizarTarea(
        tareaUpdate.id,
        this.tarea?.value, 
        this.fechaFinalizacion?.value,
        this.estado?.value).subscribe(
        (response) => {
          console.log('Respuesta de actualizacion de tarea: ' + response)
        },
        (error) => {
          console.error('Error actualizando la tarea:', error);
        },
        () => {
          this.clearFields();
          window.location.reload();
        }
      );
    }
  }

  clearFields() {
    this.tareaUpdateForm.reset({
      tarea: '',
      fechaFinalizacion: '',
      estado: ''
    });
  }

  get tarea() {
    return this.tareaUpdateForm.get('tarea');
  }

  get fechaFinalizacion() {
    return this.tareaUpdateForm.get('fechaFinalizacion');
  }
  
  get estado() {
    return this.tareaUpdateForm.get('estado');
  }

}
