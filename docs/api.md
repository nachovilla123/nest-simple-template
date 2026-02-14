# Documentación de API

## URL Base
`http://localhost:3000`

## API de Persons

### Crear Person
```http
POST /persons
Content-Type: application/json

{
  "name": "Juan",
  "surname": "Pérez"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "uuid-v4",
  "name": "Juan",
  "surname": "Pérez",
  "createdAt": "2026-02-13T...",
  "updatedAt": "2026-02-13T..."
}
```

**Errores de Validación (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "surname must be a string"
  ],
  "error": "Bad Request"
}
```

### Obtener Todos los Persons
```http
GET /persons
```

### Obtener Person por ID
```http
GET /persons/:id
```

**Respuesta (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Person with ID {id} not found",
  "error": "Not Found"
}
```

### Actualizar Person
```http
PATCH /persons/:id
Content-Type: application/json

{
  "name": "María"
}
```

### Eliminar Person
```http
DELETE /persons/:id
```

**Respuesta (204 No Content):** Sin contenido

## API de Contributors

Los mismos endpoints, usando `/contributors` como ruta base.

## Ejemplos con cURL

```bash
# Crear person
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","surname":"Pérez"}'

# Obtener todos
curl http://localhost:3000/persons

# Obtener uno
curl http://localhost:3000/persons/{id}

# Actualizar
curl -X PATCH http://localhost:3000/persons/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"María"}'

# Eliminar
curl -X DELETE http://localhost:3000/persons/{id}
```
