import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-request-confirmation-real-estate',
  imports: [MatIcon, RouterLink, MatButtonModule],
  templateUrl: './RequestConfirmationRealEstate.component.html',
  styleUrls: ['./RequestConfirmationRealEstate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestConfirmationRealEstateComponent {
  
}
