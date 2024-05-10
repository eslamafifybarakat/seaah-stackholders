import { Time } from "@angular/common";

// Listing
// Interface for installment way (if available)
interface InstallmentWay {
  id: number;
  name: string;
  description: string;
}

// Interface for a single school or organization
export interface UniversitiesListItem {
  id: number;
  name: string;
  type: string;
  location: string;
  start_time: string | Time | null;
  end_time: string | Time | null;
  installment_ways: InstallmentWay[]; // Array of installment ways
  image_path: string;
  status: boolean | null; // Nullable boolean
}
// Interface for pagination link information
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
// Interface for pagination information
interface PaginationListingData<T> {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  items: T[];
}
// Interface for the entire API response
export interface UniversitiesListApiResponse {
  status: number;
  message: string;
  data: PaginationListingData<UniversitiesListItem>; // PaginationData containing array of organizations
}

// Add/Edit University

// Interface for each installment way item (if available)
interface InstallmentWayAddedUniversity {
  id: number;
  name: string;
  description: string;
}
// Interface for the university data
interface UniversityAddedItem {
  id: number;
  name: string;
  type: string;
  location: string;
  start_time: string | Time | null;
  end_time: string | Time | null;
  installment_ways: InstallmentWayAddedUniversity[]; // Assuming an array of InstallmentWay items
  image_path: string;
  status: boolean | null; // Nullable boolean
}
// Interface for the API response
export interface AddEditUniversityApiResponse {
  status: number;
  message: string;
  data: UniversityAddedItem;
}


// University Details

// Interface for each installment way item (if available)
interface InstallmentWayUniversityDetails {
  id: number;
  name: string;
  description: string;
}
// Interface for university data
export interface UniversityDetails {
  id: number;
  name: string;
  type: string;
  location: string;
  start_time: string | Time | null;
  end_time: string | Time | null;
  installment_ways: InstallmentWayUniversityDetails[]; // Array of installment ways
  image_path: string;
  status: boolean;
}
// Interface for the API response
export interface UniversityDetailsApiResponse {
  status: number;
  message: string;
  data: UniversityDetails;
}


// Delettion
export interface DeleteUniversityApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    name: {
      en: string;
      ar: string;
    };
    type: string;
    location: {
      en: string;
      ar: string;
    };
    start_time: string | Time | null;
    end_time: string | Time | null;
    image: string | null;
    installment_ways?: any; // Assuming it can have varied structure
    status: boolean;
    created_at: string;
    updated_at: string;
    image_path: string;
  };
}
