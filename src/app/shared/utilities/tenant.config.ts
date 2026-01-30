export const TENANT_NAVBAR_ITEMS = [
  {
    name: 'Contactos',
    url: '/tenant-contacts',
  },
  {
    name: 'Favoritos',
    url: '/favorites',
  },
  {
    name: 'Ayuda',
    url: '/help',
  },
];

export const TENANT_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    {
      label: 'Mis notificaciones',
      icon: 'notifications',
      route: '/notifications',
    },
    {
      label: 'Mi alquiler',
      icon: 'apartment',
      route: '/my-rentals',
    },
    {
      label: 'Mis solicitudes de contacto',
      icon: 'chat',
      route: '/tenant-contacts',
    },
    {
      label: 'Mis favoritos',
      icon: 'favorite',
      route: '/favorites',
    },
  ],
};
