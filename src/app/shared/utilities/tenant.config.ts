export const TENANT_NAVBAR_ITEMS = [
  {
    name: 'Publicar',
    url: '/',
    featured: true,
  },
  {
    name: 'Favoritos',
    url: '/',
  },
  {
    name: 'Intereses',
    url: '/',
  },
  {
    name: 'Contactos',
    url: '/',
  },
  {
    name: 'Ayuda',
    url: '/',
  },
];

export const TENANT_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    {
      label: 'Mi alquiler',
      icon: 'apartment',
      route: '/home',
    },
    {
      label: 'Mis solicitudes de contacto',
      icon: 'chat',
      route: '/home',
    },
    {
      label: 'Mis favoritos',
      icon: 'favorite',
      route: '/home',
    },
    {
      label: 'Mis puntos de interés',
      icon: 'bookmark',
      route: '/home',
    },
    {
      label: 'Mis contactos',
      icon: 'person',
      route: '/home',
    },
  ],
};
