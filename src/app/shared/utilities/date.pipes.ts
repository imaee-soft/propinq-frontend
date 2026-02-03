export function formatDate(date: Date | undefined): string {
  if (!date) return '';

  const today = new Date();
  const target = new Date(date);

  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays <= 7) return `Hace ${diffDays} días`;

  return target.toLocaleDateString('es-AR');
}
