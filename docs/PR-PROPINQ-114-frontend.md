## PROPINQ-114: Flujo de registro y activación por código (frontend)

**Base:** `dev`

Alinea el cliente Angular con los cambios de backend para registro, reenvío y activación de cuenta en producción DigitalOcean.

### Arquitectura del feature

- Rutas de autenticación unificadas bajo `${apiUrl}/api/v1/auth/*`.
- Activación manual por formulario (email + código de 6 dígitos) reemplaza auto-activación por query `userId` + UUID.
- Manejo de errores centralizado en `ErrorInterceptor` compatible con RFC 7807 (`detail`).

### Servicios y contratos HTTP

- `AuthService`: login, signup, check-token y refresh-token apuntan a `/api/v1/auth/...`.
- `UserService.activateUser(email, verificationCode)` → `POST /api/v1/users/activate`.
- `UserService.resendActivationEmail` mantiene `POST /api/v1/users/resend-activation-email`.

### Páginas y componentes

- `account-activation-page`: formulario con email y código; éxito redirige a login.
- `verify-email-page`: reenvío con límite local de 3 intentos; navega a `/auth/activate?email=...` sin duplicar toasts de error.
- Eliminación de snackbars de error locales donde el interceptor global ya notifica.

### Interceptores

- `ErrorInterceptor`: lee `error.error.detail` además de `message` para mostrar mensajes del backend (ej. email duplicado, código inválido).

### Errores solucionados

- POST a `/auth/signup` devolvía 405 desde Nginx/frontend estático.
- Mensaje genérico "Ocurrió un error inesperado" ante respuestas Problem Details de Spring Boot 3.
- Alertas duplicadas al reenviar correo (interceptor + snackbar del componente).
- Loop de verificación por magic link incompatible con la UI de código.

### Archivos impactados

- `src/app/auth/services/auth.service.ts`
- `src/users/services/user.service.ts`
- `src/app/shared/interceptors/error.interceptor.ts`
- `src/app/auth/pages/account-activation-page/*`
- `src/app/auth/pages/verify-email-page/*`

### Validación

- Pruebas manuales: registro con email nuevo, reenvío de código, activación e inicio de sesión en producción.
- Pruebas automáticas: pendiente de E2E Cypress en rama de testing.
