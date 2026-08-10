export const environment = {
  production: true,
  addressesUrl: 'https://nominatim.openstreetmap.org',
  markerIconUrl: 'https://openlayers.org/en/latest/examples/data/icon.png',
  // Prefijo único de la API — los services usan `${apiUrl}/recurso` sin hardcodear /api/v1
  apiUrl: '/api/v1',
  // Desactivado en prod hasta registrar propinq.online/www en Google reCAPTCHA Admin
  // (el badge muestra "dominio no válido"). La API hoy no valida el token (código comentado).
  // Cuando agregues los dominios en https://www.google.com/recaptcha/admin → reCAPTCHA_enabled: true
  reCAPTCHA_enabled: false,
  reCAPTCHA_SiteKey: '6LdbPUQsAAAAAClNS4JkyqHq1Jl2I2sszAEpGb0y',
};
