from sqlalchemy import Column, Integer, String, Date, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Usuario(Base):
    __tablename__ = 'usuario'

    id = Column(Integer, primary_key=True)
    usuario = Column(String(50), nullable=False, unique=True)
    password = Column(String(60), nullable=False)
    avatar = Column(LargeBinary, nullable=True)
    tareas = relationship("Tarea", back_populates="usuario")
    categorias = relationship("Categoria", back_populates="usuario")


class Categoria(Base):
    __tablename__ = 'categoria'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String(50), nullable=False)
    tareas = relationship("Tarea", back_populates="categoria")
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    usuario = relationship("Usuario", back_populates="categorias")

class Tarea(Base):
    __tablename__ = 'tarea'

    id = Column(Integer, primary_key=True)
    tarea = Column(String(50), nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    fecha_finalizacion = Column(Date, nullable=False)
    estado = Column(String(50), nullable=False)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    categoria_id = Column(Integer, ForeignKey('categoria.id'), nullable=False)
    usuario = relationship("Usuario", back_populates="tareas")
    categoria = relationship("Categoria", back_populates="tareas")
