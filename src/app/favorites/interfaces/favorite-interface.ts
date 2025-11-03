export interface FavoriteRequest {
	userID: string;
	buildingID?: string;
	propertyID?: string;
}

export interface FavoriteResponse {
	favoriteID: string;
	userID: string;
	buildingID?: string;
	propertyID?: string;
}
