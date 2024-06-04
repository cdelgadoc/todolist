from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Annotated, List
from starlette import status
from resources import dbconfig, configuration
from passlib.context import CryptContext
from jose import jwt, JWTError
from entity.models import Usuario
from dto.dtos import UserDTO
from datetime import timedelta, datetime
import logging
import os

router = APIRouter(
    prefix='/usuarios',
    tags=['usuarios']
)

# Verificar si el directorio de log existe, si no, crearlo
log_dir = 'log'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Configurar el sistema de registro de log
logging.basicConfig(filename='log/System_LOG.log', level=logging.ERROR)

# Obtener las propiedades de la seccion 'JWT'
__CONFIG_JWT = 'JWT'
SECRET_KEY = configuration.asString(__CONFIG_JWT, 'SECRET_KEY')
ALGORITHM = configuration.asString(__CONFIG_JWT, 'ALGORITHM')

# Inicializacion del contexto de bcrypt para el cifrado de password
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Definicion del esquema para el acceso de tokens OAuth2
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='usuarios/iniciar-sesion')

# Definicion del esquema para el token de acceso
class Token(BaseModel):
    token: str
    type: str

# Definicion de una dependencia de base de datos
db_dependency = Annotated[Session, Depends(dbconfig.get_db)]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    db: db_dependency,
    userDTO: UserDTO
):
    """
    Crea un nuevo usuario en la base de datos.

    Parameters:
    db (Session): Una sesión de la base de datos SQLAlchemy.
    userDTO (UserDTO): Objeto de transferencia de datos.
    
    Returns:
    userDTO (UserDTO): usuario creado.
    """
    try:
        user = Usuario(
            usuario=userDTO.username,
            password=bcrypt_context.hash(userDTO.password),
            avatar=userDTO.avatar
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "Usuario creado exitosamente", 
                "usuario": UserDTO(id=user.id, 
                                   username=user.usuario,
                                   password=user.password, 
                                   avatar=user.avatar)}
    except IntegrityError as e:
        db.rollback()
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                            content={"ERROR": "El usuario ya existe."})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (usuarioAPI.create_user()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al crear el usuario: {e}"})


@router.post("/iniciar-sesion", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    """
    Inicia sesión y obtiene un token de acceso para el usuario.

    Parameters:
    form_data (OAuth2PasswordRequestForm): Datos del formulario de solicitud de password OAuth2.
    db (Session): Una sesión de la base de datos SQLAlchemy.

    Returns:
    Token: Un token de acceso generado.
    """
    try:
        user = authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Usuario no autorizado.')
        token = create_access_token(user.usuario, user.id, timedelta(minutes=30))
        return {'token': token, 'type': 'Bearer'}
    except HTTPException as e:
        db.rollback()
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, 
                            content={"ERROR": e.detail})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (usuarioAPI.login_for_access_token()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al realizar el login: {e}"})


def authenticate_user(
    username: str, 
    password: str, 
    db
):
    """
    Autentica a un usuario en la base de datos.

    Parameters:
    username (str): El nombre de usuario proporcionado.
    password (str): El password proporcionado.
    db (Session): Una sesión de la base de datos SQLAlchemy.

    Returns:
    Union[bool, User]:
        - Si el usuario no existe, devuelve False.
        - Si el password no coincide, devuelve False.
        - Si la autenticación es exitosa, devuelve el objeto User correspondiente.
    """
    try:
        user = db.query(Usuario).filter(Usuario.usuario == username).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Usuario no encontrado.')
        if not bcrypt_context.verify(password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Password incorrecto.')
        return user
    except Exception as e:
        logging.exception("Ha ocurrido un error (usuarioAPI.authenticate_user()): %s", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"Error en la autenticación: {e}")


def create_access_token(
    username: str, 
    user_id: int, 
    expires_delta: timedelta
):
    """
    Crea un token de acceso utilizando JWT.

    Parameters:
    username (str): El nombre de usuario.
    user_id (int): El identificador de usuario.
    expires_delta (timedelta): El lapso de tiempo de expiración del token.

    Returns:
    str: El token de acceso generado.
    """
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_bearer)]
):
    """
    Obtiene el usuario actual utilizando el token de acceso.

    Parameters:
    token (str): El token de acceso proporcionado.

    Returns:
    dict: Un diccionario que contiene el nombre, id y avatar del usuario.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_avatar: str = payload.get('avatar')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail='Por favor verifique los datos ingresados')            
        return {'username': username, 'id': user_id, 'user_avatar': user_avatar}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Usuario no autorizado o session finalizada.')
        
        
@router.get("/{username}", status_code=status.HTTP_200_OK)
async def get_user(
    username: str,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Retorna al usuario correspondiente.

    Parameters:
    username (str): El username del usuario.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.

    Returns:
    user (user)
    """
    try:
        user = db.query(Usuario).filter(Usuario.usuario == username).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Usuario no encontrado.")
        return UserDTO(id=user.id, 
                       username=user.usuario,
                       password=user.password,
                       avatar=user.avatar)
    
    except HTTPException as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except Exception as e:
        logging.exception("Ha ocurrido un error (usuarioAPI.get_user()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al realizar el login: {e}"})
        

@router.get("/", response_model=List[UserDTO], status_code=status.HTTP_200_OK)
async def get_all_users(
    db: db_dependency,
    token: dict = Depends(get_current_user)
) -> List[UserDTO]:
    """
    Retorna todos los usuarios registrados.

    Parameters:
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.

    Returns:
    Lista de users
    """
    try:
        usuarios = db.query(Usuario).all()
        return [UserDTO(id=user.id, 
                       username=user.usuario,
                       password=user.password,
                        ) for user in usuarios]
    except Exception as e:
        logging.exception("Ha ocurrido un error (usuarioAPI.get_all_users()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al realizar el login: {e}"})
    

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: int,
    db: db_dependency,
    token: dict = Depends(get_current_user)
):
    """
    Retorna todos los usuarios registrados.

    Parameters:
    user_id (int): El identificador de usuario.
    db (Session): Una sesión de la base de datos SQLAlchemy.
    token: token del usuario registrado.

    Returns:
    mensaje de eliminacion exitosa
    """
    try:
        user = db.query(Usuario).filter(Usuario.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Usuario no encontrado.")
        else:
            db.delete(user)
            db.commit()
            return {"message": "Usuario eliminado exitosamente"}
    except HTTPException as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, 
                            content={"ERROR": e.detail})
    except IntegrityError as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (usuarioAPI.delete_user()): %s", e)
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, 
                            content={"ERROR": "La Categoria que intenta borrar esta asociada a una tarea y por lo tanto no puede ser borrada."})
    except Exception as e:
        db.rollback()
        logging.exception("Ha ocurrido un error (usuarioAPI.delete_user()): %s", e)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"ERROR": f"Error al realizar el login: {e}"})