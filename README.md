# Apple Store MeLi

Aplicación full stack e-commerce orientada a productos Apple, desarrollada con React y Spring Boot e integrada con la API de Mercado Libre para obtener información dinámica de productos, precios, imágenes y especificaciones.

El proyecto parte de una aplicación académica realizada para la materia Construcción de Interfaces de Usuario de la Universidad Nacional de Hurlingham (UNAHUR), y fue extendido posteriormente con una arquitectura backend propia e integración con servicios externos.

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
- Persistencia local del estado de autenticación.
- Caché de consultas para reducir peticiones repetidas.
- Obtención concurrente de precios para mejorar los tiempos de respuesta.
- Frontend y backend empaquetados en una única imagen Docker.

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor:

```text
React
  ↓
Spring Boot
  ↓
Mercado Libre API
```

En producción, el frontend compilado es servido directamente por Spring Boot, permitiendo desplegar toda la aplicación como un único servicio.

```text
Docker
└── Spring Boot
    ├── React
    ├── API REST
    └── integración con Mercado Libre
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

### Infraestructura

- Docker
- Docker Compose

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

El nuevo estado de autenticación se almacena en:

```text
data/meli_token.json
```

Este archivo no debe versionarse.

Por seguridad se encuentra excluido mediante `.gitignore`.

## Variables de entorno

La aplicación utiliza las siguientes variables:

```env
MELI_CLIENT_ID=
MELI_CLIENT_SECRET=
MELI_ACCESS_TOKEN=
MELI_REFRESH_TOKEN=
MELI_EXPIRES_AT=
```

Estas credenciales nunca deben incluirse directamente en el código ni subirse al repositorio.

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
MELI_ACCESS_TOKEN=...
MELI_REFRESH_TOKEN=...
MELI_EXPIRES_AT=...
```

El archivo `.env` está excluido del repositorio.

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
│   ├── pom.xml
│   └── data/
│
├── Dockerfile
├── docker-compose.yml
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
- persistencia mediante base de datos;
- mejoras en el sistema de filtros;
- despliegue en infraestructura cloud.

## Objetivo del proyecto

El objetivo es profundizar conocimientos de desarrollo full stack mediante la construcción de una aplicación que integre:

- APIs REST;
- servicios externos;
- OAuth;
- programación concurrente;
- caché;
- arquitectura frontend/backend;
- Docker;
- manejo seguro de credenciales;
- procesamiento de datos externos.

El proyecto también busca representar una evolución de una aplicación académica hacia una implementación más cercana a un entorno real.

## Autor

Jonathan Giacomini

GitHub: `@jonicoke`

LinkedIn: `Jonathan Giacomini`

Portfolio: `coke-portfolio.vercel.app`
