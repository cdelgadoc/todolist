from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Annotated, List
from starlette import status
from resources import dbconfig
from entity.models import Categoria, Usuario
from dto.dtos import CategoryDTO
from .usuarioAPI import get_current_user
import logging
import os

router = APIRouter(
    prefix='/categorias',
    tags=['categorias']
)

# Verificar si el directorio de log existe, si no, crearlo
log_dir = 'log'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Configurar el sistema de registro de log
logging.basicConfig(filename='log/System_LOG.log', level=logging.ERROR)

# Configurar el sistema de registro de log
logging.basicConfig(filename='log/System_LOG.log', level=logging.ERROR)

db_dependency = Annotated[Session, Depends(dbconfig.get_db)]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(
    categoryDTO: CategoryDTO,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Crea una nueva categoria en la base de datos.

    Parameters:
    categoryDTO (CategoryDTO): Objeto de transferencia de datos.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    Categoria: categoria creada.
    """
    print(categoryDTO)
    
    try:
        category = Categoria(
            nombre=categoryDTO.nombre.upper(),
            descripcion=categoryDTO.descripcion,
            usuario_id=categoryDTO.usuario_id
        )

        db.add(category)
        db.commit()
        db.refresh(category)
        return {"message": "Categoria creada exitosamente", 
                "categoria": CategoryDTO(id=category.id, 
                                         nombre=category.nombre, 
                                         descripcion=category.descripcion,
                                         usuario_id=categoryDTO.usuario_id)}
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (categoriaAPI.create_category()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al crear la categoria: {e}"})
    

@router.get("/", response_model=List[CategoryDTO], status_code=status.HTTP_200_OK)
async def get_all_categories(
    db: db_dependency,
    token: dict = Depends(get_current_user)
) -> List[CategoryDTO]:
    """
    Obtiene todas las categorias de la base de datos.

    Parameters:
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    List[CategoryDTO]: Lista de todas las categorias.
    """
    try:
        categories = db.query(Categoria).all()
        return [CategoryDTO(id=cat.id, 
                            nombre=cat.nombre, 
                            descripcion=cat.descripcion,
                            usuario_id=cat.usuario_id
                            ) for cat in categories]
    except Exception as e:
        logging.exception("Ha ocurrido un error (categoriaAPI.get_all_categories()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al consultar todas las categorias: {e}"})
    

@router.get("/{usuario_id}", response_model=List[CategoryDTO], status_code=status.HTTP_200_OK)
def read_user_categories(
    usuario_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
) -> List[CategoryDTO]:
    """
    Obtiene todas las categorias asociadas a un usuario.

    Parameters:
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    List[CategoryDTO]: Lista de todas las categorias.
    """
    try:
        user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        categories = user.categorias
        return [CategoryDTO(id=cat.id, 
                            nombre=cat.nombre, 
                            descripcion=cat.descripcion,
                            usuario_id=cat.usuario_id
                            ) for cat in categories]
    except Exception as e:
        logging.exception("Ha ocurrido un error (categoriaAPI.read_user_categories()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": "Ocurrio un error en el Sistema.", "Message": e})


@router.put("/{category_id}", status_code=status.HTTP_200_OK)
async def update_category(
    category_id: int,
    categoryDTO: CategoryDTO,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Actualiza una categoria existente en la base de datos.

    Parameters:
    category_id (int): El ID de la categoria a actualizar.
    categoryDTO (CategoryDTO): Objeto de transferencia de datos.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    Categoria: categoria actualizada.
    """
    
    try:
        category = db.query(Categoria).filter(Categoria.id == category_id).first()
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Categoria no encontrada.")
            
        if category.usuario_id != categoryDTO.usuario_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="No puede actualizar una Categoria de un usuario distinto al propietario.")
        
        if categoryDTO.nombre:
            category.nombre = categoryDTO.nombre.upper()
        if categoryDTO.descripcion:
            category.descripcion = categoryDTO.descripcion

        db.commit()
        db.refresh(category)

        return {"message": "Categoria actualizada exitosamente", 
                "categoria": CategoryDTO(id=category.id, 
                                         nombre=category.nombre, 
                                         descripcion=category.descripcion,
                                         usuario_id=categoryDTO.usuario_id
                                        )}
    except HTTPException as e:
        db.rollback()
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (categoriaAPI.update_category()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al actualizar la categoria: {e}"})
    

@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
async def delete_category(
    category_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Elimina una categoria existente en la base de datos.

    Parameters:
    category_id (int): El ID de la categoria a eliminar.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.
    
    Returns:
    dict: Mensaje de confirmación.
    """
    try:
        category = db.query(Categoria).filter(Categoria.id == category_id).first()
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Categoria no encontrada.")
        else:
            db.delete(category)
            db.commit()
            return {"message": "Categoria eliminada exitosamente"}
    except HTTPException as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except IntegrityError as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (categoriaAPI.delete_category()): %s", e)
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, 
                            content={"ERROR": "La Categoria que intenta borrar esta asociada a una tarea y por lo tanto no puede ser borrada."})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (categoriaAPI.delete_category()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al borrar la categoria: {e}"})
