# Documentación: Procedimientos Almacenados en SQLite con C/C++ y Node.js

## 1. Introducción

Este documento cubre:

1. **Creación de procedimientos almacenados en SQLite usando C y C++**.
2. **Compilación cruzada para Linux, Linux ARM y Windows usando un `Makefile`**.
3. **Integración con Node.js**.
4. **Opcional: Compilación a WebAssembly con `emscripten`**.

## 2. Implementación de Procedimientos Almacenados en SQLite

### 2.1. Código en C

#### 2.1.1. `my_user_procs.c`

Incluye las siguientes funciones:

- **validate_password:** Verifica si la contraseña cumple con los requisitos de seguridad.
- **encrypt_password:** Encripta la contraseña usando una técnica simple.
- **create_user:** Crea un nuevo usuario en la base de datos si la contraseña es válida y el usuario no existe.
- **validate_user:** Valida las credenciales del usuario comparando la contraseña encriptada con la almacenada en la base de datos.

### 2.2. Código en C++

#### 2.2.1. `my_user_procs.cpp`

Incluye las mismas funciones que en C pero utilizando C++:

- **validate_password:** Verifica los requisitos de seguridad para la contraseña.
- **encrypt_password:** Encripta la contraseña usando XOR.
- **create_user:** Crea un nuevo usuario en la base de datos, asegurándose de que el usuario no exista y que la contraseña sea válida.
- **validate_user:** Verifica las credenciales del usuario comparando la contraseña encriptada con la almacenada.

## 3. Compilación Cruzada con `Makefile`

### 3.1. Crear `Makefile`

El `Makefile` proporciona configuraciones para compilar en diferentes plataformas:

- **Linux x86_64:** Compila el archivo `my_user_procs.c` a una biblioteca compartida (`.so`).
- **Linux ARM:** Compila para una arquitectura ARM.
- **Windows:** Compila a una biblioteca dinámica (`.dll`).
- **macOS:** Compila a una biblioteca dinámica (`.dylib`).

### 3.2. Compilación

Ejecuta `make` para generar las bibliotecas compartidas para las plataformas especificadas en el `Makefile`.

## 4. Integración con Node.js

### 4.1. Código Node.js

El siguiente código utiliza el módulo `sqlite3` para cargar y utilizar la extensión compilada:

- **index.js:** Configura la base de datos, carga la extensión y utiliza las funciones `create_user` y `validate_user`.

### 4.2. Usando `emscripten` para la Compilación en WebAssembly (Opcional)

1. **Instalar `emscripten`:**
    - `sudo apt-get install emscripten`

2. **Compilación con `emscripten`:**
    - `emcc my_user_procs.c -o my_user_procs.js -s WASM=1 -s SIDE_MODULE=1`

3. **Integración en Node.js:**
    - Utiliza el módulo `fs` para leer el archivo `.wasm` y `WASI` para ejecutar el módulo WASM.

## 5. Resumen

Este documento proporciona:

- **Implementación en C/C++:** Procedimientos almacenados para validar y encriptar contraseñas.
- **Compilación Cruzada:** `Makefile` para compilar en Linux, Linux ARM y Windows.
- **Integración con Node.js:** Uso de extensiones SQLite desde Node.js.
- **Opcional:** Compilación a WebAssembly usando `emscripten`.

