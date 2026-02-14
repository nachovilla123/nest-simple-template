# ADR 002: Estrategia de Validación con class-validator

## Estado
Aceptado

## Contexto
Los endpoints de API necesitan validar datos de entrada para asegurar integridad y proveer mensajes de error claros.

## Decisión
Usar class-validator con class-transformer a través de ValidationPipe de NestJS.

## Justificación
- Validación declarativa usando decoradores
- Transformación automática de objetos plain a instancias de clase
- Soporte nativo en NestJS
- Reglas de validación claras y auto-documentadas
- Validación type-safe

## Implementación
- ValidationPipe global en main.ts
- Decoradores de validación en DTOs
- whitelist: true para eliminar propiedades desconocidas
- transform: true para conversión automática de tipos

## Ejemplo
```typescript
export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
```
