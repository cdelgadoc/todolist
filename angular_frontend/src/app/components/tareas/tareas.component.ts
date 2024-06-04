import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/dto/categoria.model';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { Utils } from 'src/app/dto/utils';
import { Usuario } from 'src/app/dto/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { TareaService } from 'src/app/services/tarea/tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent {

  private usuarioRegistrado!: Usuario;
  private categorias!: Array<Categoria>;
  tareaForm: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private usuarioService: UsuarioService,
    private tareaService: TareaService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,) {
    this.tareaForm = this.formBuilder.group({
      tarea: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      fechaFinalizacion: ['', Validators.required], 
      estado: ['', Validators.required],
      categoria: ['', Validators.required]
    });
    this.consultarUsuario(this.authenticationService.getAuthenticatedUser());
  }

  consultarUsuario(username: string | null) {
    if(username !== undefined) {
      this.usuarioService.consultarUsuario(username).subscribe(
        (response) => {
          this.usuarioRegistrado = Utils.getUsuario(response);
          this.consultarCategoriasUsuario(this.usuarioRegistrado.id);
        },
        (error) => {
          if (error.status !== 404) {
            console.log(error.status);
            console.log(error.statusText);
          }
        }
      );  
    }
  }

  consultarCategoriasUsuario(idUsuario: number | null): void {
    if(idUsuario !== null) {
      this.categoriaService.consultarCategoriasUsuario(idUsuario).subscribe(
        (response) => {
          this.categorias = Utils.getCategorias(response);
        },
        (error) => {
          if (error.status !== 404) {
            console.log(error.status);
            console.log(error.statusText);
          }
        }
      );
    }
  }

  guardarTarea() {
    this.registrarTarea(this.authenticationService.getAuthenticatedUser())
  }

  registrarTarea(username: string | null) {
    if(username !== undefined) {
      this.usuarioService.consultarUsuario(username).subscribe(
        (response) => {
          this.usuarioRegistrado = Utils.getUsuario(response);
          console.log(this.tarea?.value)
          console.log(this.getFechaCreacion())
          console.log(this.fechaFinalizacion?.value)
          console.log(this.estado?.value)
          console.log(this.usuarioRegistrado.id)
          console.log(this.categoria?.value)
          
          this.tareaService.crearTarea(
            this.tarea?.value, 
            this.getFechaCreacion(), 
            this.fechaFinalizacion?.value,
            this.estado?.value,
            this.usuarioRegistrado.id,
            this.categoria?.value).subscribe(
            (response) => {
              console.log('Respuesta de creacion de tarea nueva: ' + response)
            },
            (error) => {
              console.error('Error creando la tarea:', error);
            },
            () => {
              this.clearFields();
              window.location.reload();
            }
          );
        },
        (error) => {
          console.error('Error creando la tarea::', error);
        }
      );  
    }
  }

  clearFields() {
    this.tareaForm.reset({
      tarea: '',
      fechaFinalizacion: '',
      estado: '',
      categoria: ''
    });
  }

  getCategorias(): Array<Categoria> {
    return this.categorias;
  }

  get tarea() {
    return this.tareaForm.get('tarea');
  }

  get fechaFinalizacion() {
    return this.tareaForm.get('fechaFinalizacion');
  }
  
  get estado() {
    return this.tareaForm.get('estado');
  }

  get categoria() {
    return this.tareaForm.get('categoria');
  }

  private getFechaCreacion(): string{
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const fechaActual = `${year}-${month}-${day}`;
    return fechaActual
  }

}
