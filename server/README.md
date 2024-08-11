# Puntaje Eventos API
Servicio de backend para servir datos al frontend

### Descripción
Servicio api en la cual si no es una ruta valida retorna el cliente.
> Para que esto funcione el cliente se debe compilar y la salida depositarla en la carpeta *build*

### Arquitectura hexagonal

```
src/
    adapters/
        DatabaseAdapter.js
        EmailAdapter.js
        ...
    ports/
        DatabasePort.js
        EmailPort.js
        ...
    domain/
        entities/
        usecases/
    pages/
        ...
    ...
```

### Llamadas a la api

#### Registrarse
```
curl -X POST http://localhost:3001/api/registry/register \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123", "name": "Test", "surname": "User", "email": "testuser@example.com"}'
```

#### Loguearse
```
curl -X POST http://localhost:3001/api/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123"}'
```

## Bibliotecas a tener en cuenta
- bcrypt: Una biblioteca para el hashing de contraseñas.
- jsonwebtoken: Una implementación de JSON Web Tokens (JWT) para autenticación.
- nodemon: Una herramienta de desarrollo que reinicia automáticamente el servidor cuando se detectan cambios en el código.
