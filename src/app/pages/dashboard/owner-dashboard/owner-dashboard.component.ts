import { Component } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [MatCard, RouterLink],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css'],
})
export class OwnerDashboardComponent {}

