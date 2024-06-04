from fastapi import FastAPI
from routers import usuarioAPI, categoriaAPI, tareaAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(usuarioAPI.router)
app.include_router(categoriaAPI.router)
app.include_router(tareaAPI.router)

# Configuración de los orígenes permitidos
origins = ["*"]

# Configuración del middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
