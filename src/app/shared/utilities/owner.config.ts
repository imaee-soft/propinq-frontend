export const OWNER_NAVBAR_ITEMS = [
  {
    name: 'Alquileres',
    url: '/my-rentals',
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
      label: 'Mis alquileres',
      icon: 'apartment',
      route: '/my-rentals',
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
      icon: 'home',
      route: '/properties',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/reports',
    },
  ],
};
