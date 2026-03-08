export const ADMIN_NAVBAR_ITEMS = [
  {
    name: 'Reportes',
    url: '/admin-reports',
  },
  {
    name: 'Perfiles',
    url: '/profile-changes',
  },
];

export const ADMIN_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    {
      label: 'Mis notificaciones',
      icon: 'notifications',
      route: '/notifications',
    },
    {
      label: 'Solicitudes de cambio de perfil',
      icon: 'switch_account',
      route: '/profile-changes',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/admin-reports',
    },
  ],
};
