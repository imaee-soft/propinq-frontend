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
    name: 'Intereses',
    url: '/interests',
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
    {
      label: 'Mis intereses',
      icon: 'bookmark',
      route: '/interests',
    },
  ],
};
