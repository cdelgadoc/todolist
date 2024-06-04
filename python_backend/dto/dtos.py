from pydantic import BaseModel, Field, constr
from typing import Optional

class UserDTO(BaseModel):
    id: int = None
    username: str = Field(min_length=3, max_length=50)
    password: Optional[constr(min_length=5)] = None
    avatar: Optional[bytes] = None


class CategoryDTO(BaseModel):
    id: int = None
    nombre: str = Field(min_length=3, max_length=50)
    descripcion: Optional[constr(min_length=3, max_length=50)] = None
    usuario_id: int
    
    
class TareaDTO(BaseModel):
    id: int = None
    tarea: str = Field(min_length=3, max_length=50)
    fecha_creacion: str
    fecha_finalizacion: str
    estado: str = Field(min_length=3, max_length=50)
    usuario_id: int
    categoria_id: int
    
    
class TareaUpdateDTO(BaseModel):
    tarea: Optional[constr(min_length=3, max_length=50)] = None
    fecha_finalizacion: Optional[constr(min_length=10, max_length=10)] = None
    estado: Optional[constr(min_length=3, max_length=50)] = None
    