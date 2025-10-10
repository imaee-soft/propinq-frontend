import { Component } from "@angular/core";
import { MatCard } from "@angular/material/card";

@Component({
  standalone: true,
  imports: [MatCard],
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css'],
})
export class TenantDashboardComponent {}

