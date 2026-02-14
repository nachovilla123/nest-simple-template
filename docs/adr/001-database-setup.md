# ADR 001: Configuración de Base de Datos con TypeORM y PostgreSQL

## Estado
Aceptado

## Contexto
El proyecto necesita persistencia de datos para módulos de negocio (Person, Contributor). Se requiere una solución que:
- No requiera instalación local de PostgreSQL
- Soporte TypeScript nativamente
- Sea fácil de configurar y usar
- Permita visualización de datos

## Decisión
Usar TypeORM con PostgreSQL, ejecutando PostgreSQL en Docker con pgAdmin para visualización.

## Justificación

### ¿Por qué TypeORM?
- Integración oficial con NestJS (@nestjs/typeorm)
- Decoradores TypeScript nativos
- Patrón Repository compatible con arquitectura NestJS
- Soporte para migraciones en producción
- Comunidad activa y documentación completa

### ¿Por qué PostgreSQL?
- RDBMS robusto y production-ready
- Excelente soporte en TypeORM
- Soporte nativo de UUIDs
- Open source con gran comunidad

### ¿Por qué Docker?
- Sin instalación local de PostgreSQL requerida
- Entorno consistente entre desarrolladores
- Fácil de resetear/limpiar
- Incluye pgAdmin para gestión visual

## Alternativas Consideradas

### Prisma
- **Pros**: Query builder type-safe, excelente DX
- **Contras**: Menos integración con NestJS, paradigma diferente
- **Rechazado**: TypeORM tiene mejor integración con NestJS

### MongoDB + Mongoose
- **Pros**: Schema flexible, bueno para prototipado rápido
- **Contras**: NoSQL puede ser excesivo para entidades simples
- **Rechazado**: Modelo relacional se ajusta mejor al caso de uso

## Consecuencias

### Positivas
- Desarrolladores pueden empezar inmediatamente con `docker-compose up`
- Decoradores TypeORM proveen definiciones claras de entidades
- pgAdmin permite inspección fácil de la base de datos
- Soporte para migraciones para cambios futuros de schema

### Negativas
- Requiere Docker Desktop ejecutándose
- Curva de aprendizaje de decoradores TypeORM
- Debe gestionarse `synchronize: false` en producción
- Debe recordarse ejecutar migraciones en producción

## Notas de Implementación
- Usar UUIDs como primary keys
- Clase BaseEntity para principio DRY
- Configuración basada en variables de entorno
- autoLoadEntities: true para evitar registro manual
