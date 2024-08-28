# Documento Técnico: Trigger para Emparejamiento de Equipos

## 1. Descripción General

El trigger se encarga de gestionar la asignación de equipos inscritos a equipos generales en un evento específico, garantizando que cada equipo inscrito se empareje con un único equipo general. Este trigger se activa cuando se actualiza el estado de validación (`isValid`) de un equipo inscrito.

## 2. Objetivo del Trigger

El trigger tiene como objetivo:

1. **Monitorear Cambios en la Validación de Equipos Inscritos**: Reaccionar a los cambios en el estado de validación de los equipos inscritos, específicamente cuando un equipo cambia su estado de `no válido` (0) a `válido` (1).

2. **Validar Cantidades de Equipos**: Asegurar que el número de equipos válidos en `EquiposInscritos` coincida con el número de equipos generales en `EquiposGenerales`.

3. **Generar Emparejamientos Aleatorios**: Crear emparejamientos únicos y aleatorios entre equipos válidos inscritos y equipos generales.

4. **Actualizar Relaciones**: Insertar los emparejamamientos generados en la tabla `EquiposInscritos_Generales`, garantizando que las relaciones entre equipos inscritos y generales se mantengan actualizadas.

## 3. Validaciones Detalladas

### 3.1. Validación de Cantidades de Equipos

1. **Verificación de Equipos Válidos**:
   - Contar el número de equipos inscritos que tienen el campo `isValid` establecido en 1 para el evento específico.
   - Este número debe coincidir con el número de equipos generales disponibles para el mismo evento.

2. **Verificación de Equipos Generales**:
   - Contar el número de equipos generales disponibles para el evento específico en `EquiposGenerales`.
   - Este número debe coincidir con el número de equipos válidos inscritos.

### 3.2. Validación de Unicidad en la Tabla Intermedia

1. **Eliminación de Registros Previos**:
   - Antes de insertar nuevos emparejamientos, eliminar las entradas existentes en `EquiposInscritos_Generales` para evitar duplicados y asegurar que la tabla intermedia refleje únicamente los emparejamientos actuales.

2. **Creación de Emparejamientos Únicos**:
   - Generar emparejamientos aleatorios entre los equipos válidos inscritos y los equipos generales.
   - Asegurarse de que cada equipo inscrito se empareje con un único equipo general.

3. **Verificación de Unicidad**:
   - Contar los registros únicos en la tabla temporal para asegurar que cada equipo inscrito y cada equipo general aparece exactamente una vez.
   - Comparar estas cuentas con el número de equipos válidos (`valid_count`) para verificar la integridad del emparejamiento.

4. **Inserción de Emparejamientos**:
   - Insertar los emparejamientos desde la tabla temporal en `EquiposInscritos_Generales` solo si todas las validaciones son satisfactorias.
   - Asegurarse de que no haya duplicados ni entradas incorrectas.

### 3.3. Manejo de Errores y Excepciones

1. **Condiciones de Error**:
   - Si las cantidades de equipos válidos y generales no coinciden, no se realiza ninguna actualización en `EquiposInscritos_Generales`.
   - Si la verificación de unicidad falla, los emparejamientos no se insertan en la tabla intermedia.

2. **Manejo de Errores**:
   - Implementar mecanismos para registrar y manejar cualquier error que pueda ocurrir durante la ejecución del trigger, asegurando que el sistema permanezca consistente y que los errores sean rastreables.

## 4. Requisitos Adicionales

1. **Consistencia de Datos**:
   - El trigger debe garantizar que la tabla `EquiposInscritos_Generales` siempre refleje un emparejamiento único y actualizado entre equipos inscritos y generales.

2. **Optimización de Rendimiento**:
   - El proceso de generación de emparejamientos y la eliminación de registros deben realizarse de manera eficiente para minimizar el impacto en el rendimiento de la base de datos.

3. **Mantenimiento y Actualización**:
   - El diseño debe permitir la fácil modificación y actualización de la lógica del trigger en caso de cambios en los requisitos de negocio o en el esquema de la base de datos.

## 5. Conclusión

El trigger para el emparejamiento de equipos es una herramienta esencial para la gestión de equipos en eventos, asegurando la integridad y la precisión en la asignación de equipos inscritos a equipos generales. La correcta implementación de las validaciones y la generación de emparejamientos únicos son cruciales para mantener la calidad y exactitud de los datos en la base de datos.

