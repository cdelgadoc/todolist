DROP TABLE IF EXISTS TAREA;
DROP TABLE IF EXISTS CATEGORIA;
DROP TABLE IF EXISTS USUARIO;

CREATE TABLE USUARIO (
	id SERIAL PRIMARY KEY NOT NULL,
	usuario varchar(50) NOT NULL UNIQUE,
	password varchar(60) NOT NULL,
	avatar BYTEA NULL
);

CREATE TABLE CATEGORIA (
    id SERIAL PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    descripcion varchar(50) NOT NULL,
    usuario_id integer NOT NULL,
    CONSTRAINT nombre_usuario_unique UNIQUE (nombre, usuario_id)
);

CREATE TABLE TAREA (
	id SERIAL PRIMARY KEY,
	tarea varchar(50) NOT NULL,
	fecha_creacion date NOT NULL, 
	fecha_finalizacion date NOT NULL,
	estado varchar(50) NOT NULL,
	usuario_id integer NOT NULL,
	categoria_id integer NOT NULL
);

ALTER TABLE TAREA ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES USUARIO (id);
ALTER TABLE TAREA ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES CATEGORIA (id);


ALTER TABLE CATEGORIA ADD CONSTRAINT fk_usuario_owner FOREIGN KEY (usuario_id) REFERENCES USUARIO (id);

