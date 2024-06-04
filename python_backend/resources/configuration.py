import configparser
import os

# Obtener la ruta absoluta al archivo config.ini
config_file_path = os.path.join(os.path.dirname(__file__), '../config/config.ini')

# Crear un objeto ConfigParser
config = configparser.ConfigParser()

# Cargar el archivo de propiedades
config.read(config_file_path)

# Cargar los dominios
def listDomains():
    return config.sections()

# Metodos para hacer casting de las propiedades

def listKeys(domain):
    return config[domain]


def asString(domain, key):
    return config[domain][key]


def asInteger(domain, key):
    return config[domain].getint(key)


def asBoolean(domain, key):
    return config[domain].getboolean(key)
