import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Building } from "../interfaces/building.interface";
import { BuildingDetails } from "../interfaces/building-details.interface";

const API_URL = 'http://localhost:8080/api/v1';
@Injectable({providedIn: 'root'})
export class BuildingService {
  constructor() {}
  private http = inject(HttpClient);

  getBuildings():Observable<Building[]>{
     console.log(`Petitioning to ${API_URL}/buildings`);
     return this.http.get<Building[]>(`${API_URL}/buildings`)
     .pipe(
       catchError((error) => {
        console.log("Error fetching", error);
        return throwError(() => new Error(`We couldn't fetch buildings: ${error.message}`));
      }),
     )
  }

  getBuildingDetails(buildingQueried: string | null): Observable<BuildingDetails> {
    if (buildingQueried == null) {
      console.log("No building details queried");
    }
    console.log(`Petitioning to ${API_URL}/buildings/${buildingQueried}`);
    return this.http.get<BuildingDetails>(`${API_URL}/buildings/${buildingQueried}`)
    .pipe(
      catchError((error) => {
        console.log("Error fetching building details", error);
        return throwError(() => new Error(`We couldn't fetch building details: ${error.message}`));
      }),
    );
  }

}
