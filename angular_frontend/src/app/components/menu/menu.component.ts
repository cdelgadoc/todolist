import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/dto/usuario.model';
import { Utils } from 'src/app/dto/utils';
import { Categoria } from 'src/app/dto/categoria.model';
import { Tarea } from 'src/app/dto/tarea.model';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { TareaService } from 'src/app/services/tarea/tarea.service';
import { StateService } from 'src/app/services/state.service';
import { UpdateTareaComponent } from '../tareas/update-tarea/update-tarea.component';
import { TareasComponent } from '../tareas/tareas.component';
import { CategoriasComponent } from '../tareas/categorias/categorias.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{

  private imageUrl!: string;
  private usuarioRegistrado!: Usuario;
  private categorias: Array<Categoria> = [];
  private tareas: Array<Tarea> = [];
  private actividad: string = '';

  @ViewChild('crearTarea') crearTarea!: TareasComponent;
  @ViewChild('updateTarea') updateTarea!: UpdateTareaComponent;
  @ViewChild('crearCategorias') crearCategorias!: CategoriasComponent;

  constructor(
    private stateService: StateService,
    public authenticationService: AuthenticationService,
    private categoriaService: CategoriaService,
    private tareaService: TareaService,
    private usuarioService: UsuarioService) {
      this.consultarUsuario(this.authenticationService.getAuthenticatedUser())
  }

  consultarUsuario(username: string | null) {
    if(username !== undefined) {
      this.usuarioService.consultarUsuario(username).subscribe(
        (response) => {
          this.usuarioRegistrado = Utils.getUsuario(response);
          this.setAvatarbase64String(this.usuarioRegistrado?.avatar);
          this.consultarTareasUsuario(this.usuarioRegistrado.id);
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

  consultarTareasUsuario(idUsuario: number | null) {
    if(idUsuario !== null) {
      this.tareaService.consultarTareasUsuario(idUsuario).subscribe(
        (response) => {
          this.tareas = Utils.getTareas(response);
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

  getImageUrl(): string {
    return this.imageUrl;
  }

  getUsuarioRegistrado(): Usuario {
    return this.usuarioRegistrado;
  }

  setAvatarbase64String(base64: string) {
      this.imageUrl = (base64 === null) ? "assets/img/avatar-placeholder.png" : ('data:image/jpeg;base64,' + base64);
  }

  getTareas(): Array<Tarea> {
    return this.tareas;
  }

  borrarTarea(idTarea: number) {
    console.log("El ide de la tara a borrar es : " + idTarea)
    if(idTarea !== null) {
      this.tareaService.borrarTarea(idTarea).subscribe(
        (response) => {
          console.log(response);
          window.location.reload();
        },
        (error) => {
          console.log('Error borrando la tarea:', error);
        }
      );  
    }
  }

  agregarTareas():void {
   this.setActividad("agregarTarea");
  }

  actualizarTarea(tarea: Tarea):void {
    this.setActividad("actualizarTarea");
    this.stateService.setTareaUpdate(tarea);
  }

  agregarCategoria():void {
    this.setActividad("agregarCategoria");
  }

  public getActividad(): string {
    return this.actividad;
  }
  
  private setActividad(value: string) {
    this.actividad = value;
  }

  onModalShow(): void {
    if(this.getActividad() === 'actualizarTarea') {
      this.updateTarea.cargarDatosTarea();
    } 
  }
  
  onModalClosed(): void {
    if(this.getActividad() === 'agregarTarea') {
      this.crearTarea.clearFields();
    }else if(this.getActividad() === 'agregarCategoria') {
      this.crearCategorias.clearFields();
    }
  }

  getCategoriaById(idCategoria: number): string {
    let categoriaBuscada = this.categorias.find(categoria => categoria.id === idCategoria);
    return (categoriaBuscada) ? categoriaBuscada.nombre : "Sin Categoria Registrada";
  }

}
