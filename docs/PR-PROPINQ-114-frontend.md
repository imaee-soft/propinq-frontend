## PROPINQ-114: Registro, activación y enrutamiento API (frontend)

**Base:** `dev`

Alinea el cliente Angular con backend en producción DigitalOcean: registro y activación por código, interceptor RFC 7807, y centralización de `apiUrl` con prefijo `/api/v1` para que Nginx enrute las peticiones al backend.

### Arquitectura del feature

- `environment.apiUrl`: `'/api/v1'` en producción y `'http://localhost:8080/api/v1'` en desarrollo.
- Todos los servicios concatenan `environment.apiUrl + '/ruta'` sin duplicar el prefijo en cada archivo (~18 servicios).
- Activación manual por formulario (email + código de 6 dígitos) reemplaza auto-activación por query `userId` + UUID.
- Manejo de errores centralizado en `ErrorInterceptor` compatible con RFC 7807 (`detail`).

### Servicios y contratos HTTP

- `AuthService`: login, signup, check-token y refresh-token bajo `${apiUrl}/auth/...`.
- `UserService.activateUser(email, verificationCode)` → `POST ${apiUrl}/users/activate`.
- `UserService.resendActivationEmail` → `POST ${apiUrl}/users/resend-activation-email`.
- Servicios de dominio (`properties`, `parameters`, `neighborhoods`, `buildings`, etc.) usan rutas relativas sin `/api/v1` hardcodeado.

### Páginas y componentes

- `account-activation-page`: formulario con email y código; éxito redirige a login.
- `verify-email-page`: reenvío con límite local de 3 intentos; navega a `/auth/activate?email=...` sin duplicar toasts de error.
- Eliminación de snackbars de error locales donde el interceptor global ya notifica.

### Interceptores

- `ErrorInterceptor`: lee `error.error.detail` además de `message`; sin filtrar 401/403 (alineado con producción).

### Errores solucionados

- Peticiones a `/parameters`, `/properties`, etc. sin `/api/v1` devolvían `index.html` del SPA → "Ocurrió un error inesperado".
- POST a `/auth/signup` devolvía 405 desde Nginx/frontend estático.
- Mensaje genérico ante respuestas Problem Details de Spring Boot 3.
- Alertas duplicadas al reenviar correo (interceptor + snackbar del componente).
- Loop de verificación por magic link incompatible con la UI de código.

### Archivos impactados

- `src/environments/environment.ts`, `environment.development.ts`
- `src/app/auth/services/auth.service.ts`, páginas de activación/verificación
- `src/users/services/user.service.ts` y servicios de dominio (`properties`, `parameters`, `neighborhoods`, etc.)
- `src/app/shared/interceptors/error.interceptor.ts`
- `Dockerfile.prod`, `nginx/default.conf`, `angular.json` (budgets para build de producción)

### Validación

- Pruebas manuales: home, listado de propiedades, parámetros y barrios en `propinq.online`.
- Producción: endpoints críticos responden HTTP 200 vía proxy Nginx.
- Pruebas automáticas: pendiente de E2E Cypress en rama de testing.
