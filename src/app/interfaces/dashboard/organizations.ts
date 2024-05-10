import { Time } from "@angular/common";

//Listing
export interface OrganizationsListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: OrganizationListingItem[];
  };
}
export interface OrganizationListingItem {
  id: number | string;
  name: string;
  email: string;
  type: string,
  location: string,
  start_time: Time | null,
  end_time: Time | null,
  installment_ways: {},
  image_path: string
}
