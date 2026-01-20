export interface StatusConfig {
  label: string;
  color: string;
  background: string;
  border: string;
}

export const STATUS_MAP: { [key: string]: StatusConfig } = {
  CREATED: {
    label: 'Creada',
    color: '#fde68a',
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
  },
  REJECTED: {
    label: 'Rechazada',
    color: '#fca5a5',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
  },
  DELETED: {
    label: 'Eliminada',
    color: '#fca5a5',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
  },
  ACCEPTED: {
    label: 'Aprobada',
    color: '#6ee7b7',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
  },
  ACTIVE: {
    label: 'Activa',
    color: '#6ee7b7',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
  },
};
