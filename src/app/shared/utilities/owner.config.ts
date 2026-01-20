export const OWNER_NAVBAR_ITEMS = [
  {
    name: 'Alquileres',
    url: '/my-rentals',
  },
  {
    name: 'Contactos',
    url: '/owner-contacts',
  },
  {
    name: 'Inmuebles',
    url: '/buildings',
  },
  {
    name: 'Viviendas',
    url: '/properties',
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
      label: 'Mis contactos',
      icon: 'person',
      route: '/owner-contacts',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/reports',
    },
  ],
};
