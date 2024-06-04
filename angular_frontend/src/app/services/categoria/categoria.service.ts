import { Injectable } from '@angular/core';
import { CATEGORY_API_URL } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  consultarCategoriasUsuario(idUsuario: number | null): Observable<any> {
    return this.http.get<any>(CATEGORY_API_URL + idUsuario, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  createCategoria(
    nombreInput: string, 
    descripcionInput: string, 
    idUsuarioInput: number): Observable<any> {
    const CategoryDTO: any = {
      nombre: nombreInput,
      descripcion: descripcionInput,
      usuario_id: idUsuarioInput,
    };

    console.log("Test createCategoria")
    console.log("nombre categoria " + CategoryDTO)

    return this.http.post<any>(CATEGORY_API_URL, CategoryDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  actualizarCategoria(
    idCategoria: number,
    nombreInput: string,
    descripcionInput: string,
    idUsuarioInput: number): Observable<any> {
    
    const CategoryDTO: any = {
      nombre: nombreInput,
      descripcion: descripcionInput,
      usuario_id: idUsuarioInput
    };

    return this.http.put<any>(CATEGORY_API_URL + idCategoria, CategoryDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  borrarCategoria(idCategoria: number):  Observable<any> {
    return this.http.delete<any>(CATEGORY_API_URL + idCategoria, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
