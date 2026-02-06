export const OWNER_NAVBAR_ITEMS = [
  {
    name: 'Alquileres',
    url: '/owner-rents',
  },
  {
    name: 'Contactos',
    url: '/owner-contacts',
  },
];

export const OWNER_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    {
      label: 'Mis notificaciones',
      icon: 'notifications',
      route: '/notifications',
    },
    {
      label: 'Mis alquileres',
      icon: 'handshake',
      route: '/owner-rents',
    },
    {
      label: 'Mis contactos',
      icon: 'person',
      route: '/owner-contacts',
    },
    {
      label: 'Mis inmuebles',
      icon: 'domain',
      route: '/buildings',
    },
    {
      label: 'Mis viviendas',
      icon: 'house',
      route: '/properties',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/reports',
    },
  ],
};
