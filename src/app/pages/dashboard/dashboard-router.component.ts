import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { TenantDashboardComponent } from './tenant-dashboard/tenant-dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-dashboard-router',
  templateUrl: './dashboard-router.component.html'
})
export class DashboardRouterComponent {
  private auth = inject(AuthService);
  component = computed(() => {
    const role = this.auth.user()?.role?.toString();
    switch (role) {
      case 'OWNER':
        return OwnerDashboardComponent;
      case 'TENANT':
        return TenantDashboardComponent;
      default:
        return null;
    }
  });
}
