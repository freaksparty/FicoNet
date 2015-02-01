module.exports = {
    "ERROR" : {
        "UNKNOWN"         : "Error desconocido",
        "SERVER"          : "Error del servidor",
        "DB"              : "Error en la base de datos",
        "BAD_DB"          : "Error grave en la base de datos",
        "MISSING_FIELDS"  : "Faltan campos requeridos",
        "DUP_ENTRY"       : "Ya existe una entrada con esos datos",
        "AUTH_REQ"        : "Esta acción requiere autenticación",
        "NOT_FOUND"       : "Elemento no encontrado",
        "NOT_IMPLEMENTED" : "Funcionalidad no implementada",
        "BAD_REQUEST"     : "Petición mal formalizada",
        "ADMIN_REQ"       : "Necesitas ser admin para realizar esta acción",
        "GOD_REQ"         : "Necesitas ser god para realizar esta acción",
        "FOREIGN_KEY"     : "La referencia no existe"
    },

    "SUCCESS" : {
        "LOGOUT" : "Logout correcto",
        "INSERTS" : "Creados correctamente"
    },

    "RE" : {
        "DUP_ENTRY" : /key '(\w+)'/
    },

    "VALIDATES" : {
        "USER": {
            "USERNAME" : {
                "IS"  : "Solo son válidos las letras, los números, el guión y el guión bajo",
                "LEN" : "El nick tiene que tener entre 3 y 15 caracteres"
            },

            "PASSWORD" : {
                "NOT_EMPTY" : "La contraseña no puede estar vacía"
            },

            "EMAIL" : {
                "NOT_EMPTY" : "El email no puede estar vacío",
                "IS_EMAIL"  : "Formato de email incorrecto"
            },

            "ROLE" : {
                "IS_IN" : "Role incorrecto"
            },

            "CREATED_AT" : {
                "IS_DATE" : "Fecha incorrecta"
            },

            "LAST_MODIFIED" : {
                "IS_DATE" : "Fecha incorrecta"
            }
        },
    }
}