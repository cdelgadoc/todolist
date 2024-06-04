from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from resources import dbconfig
from entity.models import Tarea
from dto.dtos import TareaDTO, TareaUpdateDTO
from .usuarioAPI import get_current_user
from datetime import datetime
from fastapi.responses import JSONResponse
import logging
import os

router = APIRouter(
    prefix='/tareas',
    tags=['tareas']
)

# Verificar si el directorio de log existe, si no, crearlo
log_dir = 'log'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Configurar el sistema de registro de log
logging.basicConfig(filename='log/System_LOG.log', level=logging.ERROR)

db_dependency = Annotated[Session, Depends(dbconfig.get_db)]

         
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_tarea(
    tareaDTO: TareaDTO,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Crea una nueva tarea en la base de datos.

    Parameters:
    tareaDTO (TareaDTO): Objeto de transferencia de datos.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    TareaDTO: tarea creada.
    """
    try:
        tarea = Tarea(
            tarea=tareaDTO.tarea,
            fecha_creacion=datetime.strptime(tareaDTO.fecha_creacion, "%Y-%m-%d").date(),
            fecha_finalizacion=datetime.strptime(tareaDTO.fecha_finalizacion, "%Y-%m-%d").date(),
            estado=tareaDTO.estado.upper(),
            usuario_id=tareaDTO.usuario_id,
            categoria_id=tareaDTO.categoria_id
        )
        db.add(tarea)
        db.commit()
        db.refresh(tarea)

        return {"message": "Tarea creada exitosamente", 
                "tarea": TareaDTO(id=tarea.id, 
                                  tarea=tarea.tarea, 
                                  fecha_creacion=tarea.fecha_creacion.strftime('%Y-%m-%d'),
                                  fecha_finalizacion=tarea.fecha_finalizacion.strftime('%Y-%m-%d'),
                                  estado=tarea.estado,
                                  usuario_id=tarea.usuario_id,
                                  categoria_id=tarea.categoria_id                                  
                                  )}
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (tareaAPI.create_tarea()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al crear la tarea: {e}"})
    

@router.put("/{tarea_id}", status_code=status.HTTP_200_OK)
async def update_tarea(
    tarea_id: int,
    tareaUpdateDTO: TareaUpdateDTO,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Actualiza una tarea en la base de datos.

    Parameters:
    tarea_id (int): El ID de la tarea a actualizar.
    tareaUpdateDTO (TareaUpdateDTO): Objeto de transferencia de datos.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    TareaDTO: tarea actualizada.
    """
    try:
        tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
        if tarea is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada.")
        
        if tareaUpdateDTO.tarea:
            tarea.tarea = tareaUpdateDTO.tarea
        if tareaUpdateDTO.fecha_finalizacion:
            tarea.fecha_finalizacion = datetime.strptime(tareaUpdateDTO.fecha_finalizacion, "%Y-%m-%d").date(),
        if tareaUpdateDTO.estado:
            tarea.estado = str(tareaUpdateDTO.estado).upper()
                        
        db.commit()
        db.refresh(tarea)

        return {"message": "Tarea actualizada exitosamente", 
                "tarea": TareaDTO(id=tarea.id, 
                                  tarea=tarea.tarea, 
                                  fecha_creacion=tarea.fecha_creacion.strftime('%Y-%m-%d'),
                                  fecha_finalizacion=tarea.fecha_finalizacion.strftime('%Y-%m-%d'),
                                  estado=tarea.estado,
                                  usuario_id=tarea.usuario_id,
                                  categoria_id=tarea.categoria_id                                  
                                  )}
    except HTTPException as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (tareaAPI.update_tarea()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al actualizar la tarea: {e}"})
    

@router.delete("/{tarea_id}", status_code=status.HTTP_200_OK)
async def delete_tarea(
    tarea_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Elimina una tarea existente en la base de datos.

    Parameters:
    tarea_id (int): El ID de la tarea a eliminar.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    dict: Mensaje de confirmación.
    """
    try:
        tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
        if tarea is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Tarea no encontrada")
        else:
            db.delete(tarea)
            db.commit()
            return {"message": "Tarea eliminada exitosamente"}
    except HTTPException as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (tareaAPI.delete_tarea()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al borrar la tarea: {e}"})


@router.get("/usuario/{usuario_id}", response_model=List[TareaDTO], status_code=status.HTTP_200_OK)
async def get_tareas_usuario(
    usuario_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
) -> List[TareaDTO]:
    """
    Obtiene todas las tareas de un usuario.

    Parameters:
    usuario_id (int): El ID del usuario al que se le consultan las tareas.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    List[TareaDTO]: Lista de todas las tareas del usuario.
    """
    try:
        tareas = db.query(Tarea).filter(Tarea.usuario_id == usuario_id).all()
        return [TareaDTO(id=tarea.id, 
                         tarea=tarea.tarea, 
                         fecha_creacion=tarea.fecha_creacion.strftime('%Y-%m-%d'),
                         fecha_finalizacion=tarea.fecha_finalizacion.strftime('%Y-%m-%d'),
                         estado=tarea.estado,
                         usuario_id=tarea.usuario_id,
                         categoria_id=tarea.categoria_id                                  
                         ) for tarea in tareas]
    except Exception as e:
        logging.exception("Ha ocurrido un error (tareaAPI.get_tareas_usuario()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al consultar las tareas del usuario: {e}"})
    
    
@router.get("/{tarea_id}", status_code=status.HTTP_200_OK)
async def get_tarea(
    tarea_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Obtiene la tarea especificado por su id.

    Parameters:
    tarea_id (int): El ID de la tarea.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    TareaDTO: tarea.
    """
    try:
        tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
        return TareaDTO(
            id=tarea.id, 
            tarea=tarea.tarea, 
            fecha_creacion=tarea.fecha_creacion.strftime('%Y-%m-%d'),
            fecha_finalizacion=tarea.fecha_finalizacion.strftime('%Y-%m-%d'),
            estado=tarea.estado,
            usuario_id=tarea.usuario_id,
            categoria_id=tarea.categoria_id                                  
            )
    except Exception as e:
        logging.exception("Ha ocurrido un error (tareaAPI.get_tarea()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al buscar la tarea: {e}"})
     