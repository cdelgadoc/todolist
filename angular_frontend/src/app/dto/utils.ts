import { Categoria } from "./categoria.model";
import { Tarea } from "./tarea.model";
import { Usuario } from "./usuario.model";

export class Utils {

  static getUsuario(response: any): Usuario {
    const usuario = new Usuario(
    response["id"], 
    response["username"],
    response["password"],
    response["avatar"]);
    return usuario;    
  }

  static getCategorias(response: any): Array<Categoria> {
    const categorias = new Array<Categoria>;     
    Object.keys(response).forEach((key) => {
      const jsonData = response[key];
      const categoria = new Categoria(
        jsonData["id"], 
        jsonData["nombre"],
        jsonData["descripcion"],
        jsonData["usuario_id"]
        );
      categorias.push(categoria);    
    });
    return categorias;    
  }

  static getTarea(response: any): Tarea {
    const tarea = new Tarea(
    response["id"], 
    response["tarea"],
    response["fecha_creacion"],
    response["fecha_finalizacion"],
    response["estado"],
    response["usuario_id"],
    response["categoria_id"]);
    return tarea;    
  }

  static getTareas(response: any): Array<Tarea> {
    const tareas = new Array<Tarea>;     
    Object.keys(response).forEach((key) => {
      const jsonData = response[key];
      const tarea = new Tarea(
        jsonData["id"], 
        jsonData["tarea"],
        jsonData["fecha_creacion"],
        jsonData["fecha_finalizacion"],
        jsonData["estado"],
        jsonData["usuario_id"],
        jsonData["categoria_id"]);
        tareas.push(tarea);    
    });
    return tareas;    
  }

 }