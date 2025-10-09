export const TENANT_NAVBAR_ITEMS = [
  {
    name: 'Publicar',
    url: '/publish',
    featured: true,
  },
  {
    name: 'Favoritos',
    url: '/favorites',
  },
  {
    name: 'Intereses',
    url: '/interests',
  },
  {
    name: 'Contactos',
    url: '/my-contacts',
  },
  {
    name: 'Ayuda',
    url: '/help',
  },
];

export const TENANT_SIDEBAR_CONFIG = {
  enabled: true,
  items: [
    // {
    //   label: 'Mi alquiler',
    //   icon: 'apartment',
    //   route: '/my-rentals',
    // },
    // {
    //   label: 'Mis solicitudes de contacto',
    //   icon: 'chat',
    //   route: '/my-contact-requests',
    // },
    {
      label: 'Mis favoritos',
      icon: 'favorite',
      route: '/favorites',
    },
    {
      label: 'Mis puntos de interés',
      icon: 'bookmark',
      route: '/interests',
    },
    // {
    //   label: 'Mis contactos',
    //   icon: 'person',
    //   route: '/my-contacts',
    // },
  ],
};
