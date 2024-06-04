from resources import configuration
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Obtener los valores de la sección 'Database'
__CONFIG_DOMAIN = 'Database'
__USER = configuration.asString(__CONFIG_DOMAIN, 'user')
__PASS = configuration.asString(__CONFIG_DOMAIN, 'pass')
__HOST = configuration.asString(__CONFIG_DOMAIN, 'host')
__DB = configuration.asString(__CONFIG_DOMAIN, 'db')
__PORT = configuration.asInteger(__CONFIG_DOMAIN, 'port')


# URL de la base de datos PostgreSQL
SQLALCHEMY_DATABASE_URL = 'postgresql://{}:{}@{}:{}/{}'.format(__USER, __PASS, __HOST, __PORT, __DB)

# Crear el motor de la base de datos con la URL de la base de datos PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crea una clase SessionLocal que actúa como una fábrica de sesiones para la base de datos PostgreSQL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Funcion para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()