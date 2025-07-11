import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { SnackbarConfig } from '../interfaces/snackbar-config.interface';

@Injectable({ providedIn: 'root' })
export class CustomSnackbarService {
  private _snackbars: ComponentRef<SnackbarComponent>[] = [];
  private _appRef = inject(ApplicationRef);
  private _injector = inject(EnvironmentInjector);

  show(config: SnackbarConfig) {
    const componentRef = createComponent(SnackbarComponent, {
      environmentInjector: this._injector,
    });

    componentRef.instance.config = config;
    componentRef.instance.onClose = () => this.remove(componentRef);

    document.body.appendChild(componentRef.location.nativeElement);
    this._appRef.attachView(componentRef.hostView);

    this._snackbars.push(componentRef);

    if (config.duration !== 0) {
      setTimeout(() => {
        this.remove(componentRef);
      }, config.duration || 3000);
    }

    return componentRef;
  }

  success(message: string, duration = 3000) {
    return this.show({
      message,
      type: 'success',
      duration,
      position: 'bottom-right',
    });
  }

  error(message: string, duration = 3000) {
    return this.show({
      message,
      type: 'error',
      duration,
      position: 'bottom-right',
    });
  }

  private remove(componentRef: ComponentRef<SnackbarComponent>) {
    const index = this._snackbars.indexOf(componentRef);
    if (index > -1) {
      const element =
        componentRef.location.nativeElement.querySelector('.snackbar');
      if (element) element.classList.add('closing');
      this.closeChild(index, componentRef);
    }
  }

  private closeChild(
    index: number,
    componentRef: ComponentRef<SnackbarComponent>
  ) {
    this._snackbars.splice(index, 1);
    this._appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  clearAll() {
    this._snackbars.forEach((ref) => this.remove(ref));
  }
}
