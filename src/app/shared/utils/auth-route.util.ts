/** Rutas bajo /auth/* y aliases legacy /login, /signup */
const AUTH_ROUTE_PATTERN = /^\/(auth(\/|$)|login$|signup$)/;

export function isAuthRoute(url: string): boolean {
  const path = url.split('?')[0].split('#')[0];
  return AUTH_ROUTE_PATTERN.test(path);
}

function hideRecaptchaBadges(): void {
  document.querySelectorAll('.grecaptcha-badge').forEach((el) => {
    const badge = el as HTMLElement;
    badge.style.setProperty('visibility', 'hidden', 'important');
    badge.remove();
  });
}

export function syncRecaptchaBadgeForRoute(isAuth: boolean): void {
  document.body.classList.toggle('auth-page', isAuth);

  if (isAuth) {
    return;
  }

  hideRecaptchaBadges();
  queueMicrotask(hideRecaptchaBadges);
  setTimeout(hideRecaptchaBadges, 0);
  setTimeout(hideRecaptchaBadges, 100);
  setTimeout(hideRecaptchaBadges, 500);
}
