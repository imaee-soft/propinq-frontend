export interface SnackbarConfig {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}
