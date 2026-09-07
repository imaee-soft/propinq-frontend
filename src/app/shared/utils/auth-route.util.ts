/** Rutas bajo /auth/* y aliases legacy /login, /signup */
const AUTH_ROUTE_PATTERN = /^\/(auth(\/|$)|login$|signup$)/;

export function isAuthRoute(url: string): boolean {
  const path = url.split('?')[0].split('#')[0];
  return AUTH_ROUTE_PATTERN.test(path);
}
