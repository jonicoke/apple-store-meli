# Apple Store MeLi

Aplicación full stack de e-commerce orientada a productos Apple, desarrollada con React y Spring Boot e integrada con la API de Mercado Libre para obtener información dinámica de productos, precios, imágenes y especificaciones.

El proyecto parte de una aplicación académica realizada para la materia Construcción de Interfaces de Usuario de la Universidad Nacional de Hurlingham (UNAHUR), y fue extendido posteriormente con una arquitectura backend propia, autenticación OAuth, persistencia externa y despliegue en producción.

## Demo

Aplicación desplegada en producción:

https://apple-store-meli.vercel.app/

## Características

- Catálogo dinámico de productos Apple obtenido desde Mercado Libre.
- Búsqueda libre de productos.
- Navegación por categorías.
- Detalle individual de productos.
- Visualización de imágenes, precios y especificaciones técnicas.
- Filtros por características y rango de precio.
- Ordenamiento de productos.
- Carrito de compras persistido mediante `localStorage`.
- Manejo de estados de carga y error.
- Diseño responsive.
- Tema claro y oscuro.
- Integración OAuth con Mercado Libre.
- Renovación automática del access token mediante refresh token.
- Persistencia del estado OAuth en Supabase.
- Caché de consultas para reducir peticiones repetidas.
- Obtención concurrente de precios para mejorar los tiempos de respuesta.
- Frontend y backend empaquetados en una única imagen Docker.
- Aplicación desplegada en Vercel como contenedor.

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor:

```text
React
  ↓
Spring Boot
  ↓
Mercado Libre API
```

El frontend compilado es servido directamente por Spring Boot, permitiendo desplegar toda la aplicación como un único servicio.

En producción, la arquitectura queda compuesta por:

```text
Vercel
└── Docker Container
    └── Spring Boot
        ├── React
        ├── API REST
        └── integración con Mercado Libre

Supabase
└── Persistencia de tokens OAuth

Mercado Libre API
└── Productos, precios y especificaciones
```

## Tecnologías

### Frontend

- React
- Vite
- React Router DOM
- React Icons
- JavaScript
- HTML5
- CSS3

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Cache
- RestClient
- Jackson
- Maven

### Integraciones

- Mercado Libre API
- OAuth 2.0
- Access Token
- Refresh Token
- Supabase REST API

### Infraestructura

- Docker
- Docker Compose
- Vercel
- Supabase

## Integración con Mercado Libre

El backend consume distintos endpoints de la API de Mercado Libre para obtener productos de catálogo y publicaciones activas.

La aplicación utiliza búsquedas como:

```text
Apple iPhone 17
Apple MacBook Air M4
Apple AirPods Pro
```

para obtener productos relacionados con la marca Apple.

La respuesta de Mercado Libre es procesada en el backend y convertida a DTOs propios antes de enviarse al frontend.

Ejemplo:

```json
{
  "id": "MLA...",
  "nombre": "Apple iPhone 17",
  "imagen": "https://...",
  "precio": 1884821,
  "precioOriginal": null,
  "categoria": "MLA-CELLPHONES",
  "specs": {
    "BRAND": "Apple",
    "LINE": "iPhone 17",
    "INTERNAL_MEMORY": "256 GB"
  }
}
```

## Optimización de rendimiento

La API de productos de Mercado Libre no siempre devuelve directamente el precio de cada producto.

Por este motivo, el backend debe consultar las publicaciones asociadas a cada producto.

Inicialmente estas consultas se realizaban de manera secuencial, lo que generaba tiempos de respuesta elevados.

Para mejorar el rendimiento se implementó procesamiento concurrente utilizando:

```java
CompletableFuture
ExecutorService
```

con un pool limitado de threads.

También se utiliza caché mediante Spring Cache para evitar repetir búsquedas ya realizadas.

Ejemplo:

```java
@Cacheable(
    value = "productosPorCategoria",
    key = "#query + '-' + #categoryId"
)
```

Esto permite que consultas repetidas puedan responder en pocos milisegundos.

## Autenticación OAuth

Mercado Libre utiliza tokens temporales para acceder a ciertos endpoints.

El backend administra automáticamente:

```text
access_token
refresh_token
expires_at
```

Cuando el access token está próximo a vencer, el backend utiliza el refresh token para solicitar nuevas credenciales.

El estado actualizado de autenticación se persiste en Supabase, lo que permite conservar los tokens independientemente del ciclo de vida del contenedor desplegado.

El flujo general es:

```text
Spring Boot
   ↓
Supabase
   ↓
carga último estado OAuth

Token vencido
   ↓
Mercado Libre OAuth
   ↓
nuevo access_token + refresh_token
   ↓
Supabase
```

De esta manera, la aplicación no depende de archivos locales ni de almacenamiento persistente dentro del contenedor.

## Variables de entorno

La aplicación utiliza las siguientes variables:

```env
MELI_CLIENT_ID=
MELI_CLIENT_SECRET=

SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Las credenciales OAuth actualizadas se recuperan desde Supabase.

En una primera inicialización también pueden utilizarse:

```env
MELI_ACCESS_TOKEN=
MELI_REFRESH_TOKEN=
MELI_EXPIRES_AT=
```

Estas variables solo son necesarias si todavía no existe un estado OAuth almacenado en Supabase.

Las credenciales nunca deben incluirse directamente en el código ni subirse al repositorio.

## Docker

El proyecto puede ejecutarse completamente utilizando Docker.

La imagen realiza tres etapas:

```text
1. Build del frontend con Node
2. Build del backend con Maven
3. Ejecución final con Java
```

El frontend compilado se copia dentro de los recursos estáticos de Spring Boot.

De esta manera, frontend y backend se ejecutan desde un único contenedor.

## Despliegue

La aplicación se encuentra desplegada en Vercel utilizando el `Dockerfile` del proyecto.

Spring Boot utiliza el puerto proporcionado por la plataforma mediante:

```properties
server.port=${PORT:8080}
```

Esto permite utilizar el puerto `8080` localmente y adaptarse automáticamente al entorno de producción.

Demo:

https://apple-store-meli.vercel.app/

## Instalación

### Requisitos

- Docker
- Docker Compose

También es posible ejecutar frontend y backend por separado utilizando Node.js, Maven y Java 21.

### Clonar el repositorio

```bash
git clone https://github.com/jonicoke/apple-store-api.git
```

```bash
cd apple-store-api
```

### Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
MELI_CLIENT_ID=...
MELI_CLIENT_SECRET=...

SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

Si Supabase todavía no contiene un estado OAuth inicial:

```env
MELI_ACCESS_TOKEN=...
MELI_REFRESH_TOKEN=...
MELI_EXPIRES_AT=...
```

El archivo `.env` está excluido del repositorio mediante `.gitignore`.

### Construir y ejecutar

```bash
docker compose build
```

```bash
docker compose up
```

La aplicación estará disponible normalmente en:

```text
http://localhost:8080
```

## Ejecución en desarrollo

El frontend también puede ejecutarse por separado.

```bash
cd frontend
npm install
npm run dev
```

Normalmente Vite estará disponible en:

```text
http://localhost:5173
```

El backend puede ejecutarse desde IntelliJ IDEA o mediante Maven.

```bash
cd backend
mvn spring-boot:run
```

Al ejecutarlo fuera de Docker, las variables utilizadas mediante `System.getenv()` deben estar disponibles en el entorno del proceso.

## Estructura del proyecto

```text
apple-store-api/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   └── pom.xml
│
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── .gitignore
└── README.md
```

## Limitaciones actuales

La aplicación obtiene una cantidad limitada de productos por búsqueda.

Además, los productos sin publicaciones activas o sin precio disponible pueden ser descartados.

Por este motivo, no necesariamente se muestra la totalidad del catálogo disponible en Mercado Libre.

Entre las mejoras futuras se encuentran:

- paginación;
- carga progresiva de resultados;
- ampliación de categorías;
- mejoras en el sistema de filtros;
- mejor manejo de límites de solicitudes de APIs externas;
- mejoras generales de rendimiento y experiencia de usuario.

## Objetivo del proyecto

El objetivo es profundizar conocimientos de desarrollo full stack mediante la construcción de una aplicación que integre:

- APIs REST;
- servicios externos;
- OAuth;
- programación concurrente;
- caché;
- persistencia externa;
- arquitectura frontend/backend;
- Docker;
- despliegue en producción;
- manejo seguro de credenciales;
- procesamiento de datos externos.

El proyecto también busca representar la evolución de una aplicación académica hacia una implementación full stack más cercana a un entorno real.

## Autor

Jonathan Giacomini

GitHub: `@jonicoke`

LinkedIn: `Jonathan Giacomini`

Portfolio: `coke-portfolio.vercel.app`
