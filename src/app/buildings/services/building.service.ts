import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Building } from "../interfaces/building.interface";
import { BuildingDetails } from "../interfaces/building-details.interface";
import { environment } from "../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class BuildingService {
  private http = inject(HttpClient);

  getBuildings():Observable<Building[]>{
     return this.http.get<Building[]>(`${environment.API_URL}/buildings`);
  }

  getBuildingDetails(buildingQueried: string | null): Observable<BuildingDetails> {
    if (buildingQueried == null) {
      return throwError(() => new Error("Invalid buildingQueried: null"));
    }
    return this.http.get<BuildingDetails>(`${environment.API_URL}/buildings/${buildingQueried}`);
  }

}
