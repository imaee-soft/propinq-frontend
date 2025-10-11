export const OWNER_NAVBAR_ITEMS = [
  {
    name: 'Alquileres',
    url: '/my-rentals',
  },
  {
    name: 'Inmuebles',
    url: '/buildings',
  },
  {
    name: 'Viviendas',
    url: '/properties',
  },
  {
    name: 'Ayuda',
    url: '/help',
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
      route: '/my-contacts',
    },
    {
      label: 'Mis documentos',
      icon: 'description',
      route: '/my-documents',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/reports',
    },
  ],
};
