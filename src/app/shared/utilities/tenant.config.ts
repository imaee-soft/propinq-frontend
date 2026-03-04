export const TENANT_NAVBAR_ITEMS = [
  {
    name: 'Negociaciones',
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
      label: 'Mis alquileres',
      icon: 'apartment',
      route: '/tenant-rents',
    },
    {
      label: 'Mis solicitudes de negociación',
      icon: 'person',
      route: '/tenant-contacts',
    },
    {
      label: 'Mis favoritos',
      icon: 'favorite',
      route: '/favorites',
    },
  ],
};
