import { Injectable } from '@angular/core';
import { TASK_API_URL, TASK_USER_API_URL } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(private http: HttpClient) { }

  consultarTareaById(idTarea: number | null): Observable<any> {
    return this.http.get<any>(TASK_API_URL + idTarea, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  consultarTareasUsuario(idUsuario: number | null): Observable<any> {
    return this.http.get<any>(TASK_USER_API_URL + idUsuario, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  crearTarea(
    tareaInput: string,
    fechaCreacionInput: string, 
    fechaFinalizacionInput: string,
    estadoInput: string,
    idUsuario: number,
    idCategoria: number): Observable<any> {
    
    const TareaDTO: any = {
      tarea: tareaInput,
      fecha_creacion: fechaCreacionInput,
      fecha_finalizacion: fechaFinalizacionInput,
      estado: estadoInput,
      usuario_id: idUsuario,
      categoria_id: idCategoria,
    };

    return this.http.post<any>(TASK_API_URL, TareaDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  actualizarTarea(
    idTarea: number,
    tareaInput: string,
    fechaFinalizacionInput: string,
    estadoInput: string): Observable<any> {
    
    const TareaUpdateDTO: any = {
      tarea: tareaInput,
      fecha_finalizacion: fechaFinalizacionInput,
      estado: estadoInput
    };

    return this.http.put<any>(TASK_API_URL + idTarea, TareaUpdateDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  borrarTarea(idTarea: number):  Observable<any> {
    return this.http.delete<any>(TASK_API_URL + idTarea, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
