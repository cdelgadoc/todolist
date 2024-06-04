import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/dto/categoria.model';
import { Usuario } from 'src/app/dto/usuario.model';
import { Utils } from 'src/app/dto/utils';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {
  
  categoriaForm: FormGroup;
  private categorias: Array<Categoria> = [];
  private categoriaUpdate: Categoria | null;
  private usuarioRegistrado!: Usuario;

  constructor(
    private categoriaService: CategoriaService,
    private authenticationService: AuthenticationService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder) {
      this.categoriaForm = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
      });
      this.consultarUsuario(this.authenticationService.getAuthenticatedUser());
      this.categoriaUpdate = null;
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

  getCategorias(): Array<Categoria> {
    return this.categorias;
  }

  guardar():void {
    if(this.categoriaUpdate === null) {
      this.guardarCategoria();
    } else {
      this.actualizarCategoria();
    }
  }

  private guardarCategoria() {
    this.categoriaService.createCategoria(
      this.nombre?.value, 
      this.descripcion?.value,
      this.usuarioRegistrado.id).subscribe(
      (response) => {
        console.log('Response: ' + response)
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      },
      () => {
        this.clearFields();
        this.consultarUsuario(this.authenticationService.getAuthenticatedUser());
      }
    );
  }

  clearFields() {
    this.categoriaForm.reset({
      nombre: '',
      descripcion: ''
    });
    this.categoriaUpdate = null
  }

  actualizar(categoria: Categoria) {
    this.categoriaUpdate = categoria;
    if(this.categoriaUpdate !== undefined) {
      this.categoriaForm.reset({
        nombre: this.categoriaUpdate.nombre,
        descripcion: this.categoriaUpdate.descripcion
      });
    }
  }

  private actualizarCategoria() {
    if(this.categoriaUpdate !== null) {
      this.categoriaService.actualizarCategoria(
        this.categoriaUpdate.id,
        this.nombre?.value, 
        this.descripcion?.value,
        this.usuarioRegistrado.id).subscribe(
        (response) => {
          console.log('Respuesta de actualizacion de categoria: ' + response)
        },
        (error) => {
          console.error('Error actualizando la categoria:', error);
        },
        () => {
          this.clearFields();
          this.consultarUsuario(this.authenticationService.getAuthenticatedUser());
        }
      );
    }
  }

  borrarCategoria(idCategoria: number) {
    this.categoriaService.borrarCategoria(idCategoria).subscribe(
      (response) => {
        console.log(response);
        this.consultarUsuario(this.authenticationService.getAuthenticatedUser());
      },
      (error) => {
        console.log('Error borrando la categoria:', error['error']);
        window.alert("La Categoria que intenta borrar esta asociada a una tarea y por lo tanto no puede ser borrada.");
      }
    );
  }

  get nombre() {
    return this.categoriaForm.get('nombre');
  }
  
  get descripcion() {
    return this.categoriaForm.get('descripcion');
  }

}
