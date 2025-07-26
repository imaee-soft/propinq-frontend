export const OWNER_NAVBAR_ITEMS = [
  {
    name: 'Publicar',
    url: '/',
    featured: true,
  },
  {
    name: 'Alquileres',
    url: '/',
  },
  {
    name: 'Inmuebles',
    url: '/buildings',
  },
  {
    name: 'Viviendas',
    url: '/',
  },
  {
    name: 'Ayuda',
    url: '/',
  },
];

export const OWNER_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    {
      label: 'Mis alquileres',
      icon: 'apartment',
      route: '/home',
    },
    {
      label: 'Mis inmuebles',
      icon: 'domain',
      route: '/buildings',
    },
    {
      label: 'Mis viviendas',
      icon: 'home',
      route: '/home',
    },
    {
      label: 'Mis contactos',
      icon: 'person',
      route: '/home',
    },
    {
      label: 'Mis documentos',
      icon: 'description',
      route: '/home',
    },
    {
      label: 'Reportes y estadísticas',
      icon: 'monitoring',
      route: '/home',
    },
  ],
};
