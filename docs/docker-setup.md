# Guía de Configuración Docker

## Prerequisitos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido con Docker Desktop)

## Iniciar Servicios

```bash
# Iniciar PostgreSQL y pgAdmin
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps

# Ver logs
docker-compose logs -f
```

## Acceso a Servicios

### PostgreSQL
- Host: localhost
- Puerto: 5433
- Base de datos: nestjs_db
- Usuario: postgres
- Contraseña: postgres

### pgAdmin
- URL: http://localhost:5050
- Email: admin@admin.com
- Contraseña: admin

## Conectar pgAdmin a PostgreSQL

1. Abrir pgAdmin en http://localhost:5050
2. Login con credenciales de admin
3. Click derecho en "Servers" → "Register" → "Server"
4. En la pestaña "General":
   - Name: NestJS Local
5. En la pestaña "Connection":
   - Host name/address: **postgres** (nombre del contenedor)
   - Port: 5432
   - Maintenance database: nestjs_db
   - Username: postgres
   - Password: postgres
6. Click "Save"

## Detener Servicios

```bash
# Detener servicios (preserva datos)
docker-compose stop

# Detener y eliminar contenedores (preserva datos en volúmenes)
docker-compose down

# Detener y ELIMINAR TODOS LOS DATOS
docker-compose down -v
```

## Solución de Problemas

### Puerto 5432 ya en uso
Si tienes PostgreSQL instalado localmente:
```bash
# Detener PostgreSQL local (macOS)
brew services stop postgresql

# O cambiar el puerto en docker-compose.yml a 5433
```

### Error de conexión a base de datos
```bash
# Asegurarse de que los contenedores estén corriendo
docker-compose ps

# Reiniciar servicios
docker-compose restart
```
