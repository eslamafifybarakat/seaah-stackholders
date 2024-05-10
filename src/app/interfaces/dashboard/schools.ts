import { Time } from "@angular/common";

//Listing
// Interface for individual school item
export interface SchoolListItem {
  id: number;                // Unique identifier of the school
  name: string;              // Name of the school
  type: string;              // Type of the school
  location: string;          // Location of the school
  start_time: string | Time | null;        // Start time (in HH:mm:ss format)
  end_time: string | Time | null;          // End time (in HH:mm:ss format)
  installment_ways?: any[];   // An array representing installment ways (replace `any` with the actual type if known)
  image_path: string;        // URL of the school's image
  status: boolean;           // Status of the school (active/inactive)
}

// Interface for pagination link structure
interface PaginationLink {
  url: string | null;        // URL for pagination link
  label: string;             // Label for pagination link
  active: boolean;           // Indicates if this link is the active/current page
}

// Interface for the data property of the response
export interface SchoolListData {
  current_page: number;      // Current page number
  first_page_url: string;    // URL for the first page
  from: number | null;       // Starting index of the records in the current page
  last_page: number;         // Last page number
  last_page_url: string;     // URL for the last page
  links: PaginationLink[];   // Array of pagination links
  next_page_url: string | null; // URL of the next page
  path: string;              // Base URL for pagination
  per_page: number;          // Number of records per page
  prev_page_url: string | null; // URL of the previous page
  to: number | null;         // Ending index of the records in the current page
  total: number;             // Total number of records
  items: SchoolListItem[];           // Array of schools
}

// Interface for the overall response
export interface SchoolListApiResponse {
  status: number;            // Response status code
  message: string;           // Response message
  data: SchoolListData;      // Data property containing pagination and school list information
}


// Add/Edit School
// Interface for each installment way item (if available)
interface AddEditSchoolInstallmentWay {
  id: number;
  name: string;
  description: string;
}
// Interface for the school data
export interface SchoolItemData {
  id: number;
  name: string;
  type: string;
  location: string;
  start_time: string | Time | null;
  end_time: string | Time | null;
  installment_ways: AddEditSchoolInstallmentWay[]; // Empty array in the provided example
  image_path: string;
  status: boolean | null; // Nullable boolean
}
// Interface for the API response
export interface SchoolItemDataApiResponse {
  status: number;
  message: string;
  data: SchoolItemData;
}

// Deletion
export interface DeleteShoolApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    name: { en: string; ar: string };
    type: string;
    location: { en: string; ar: string };
    start_time: string | Time | null;
    end_time: string | Time | null;
    image: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    image_path: string;
  };
}


// Details
export interface SchoolDetailsApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    type: string;
    location: string;
    start_time: string | Time | null;
    end_time: string | Time | null;
    installment_ways: string[];
    image_path: string;
    status: boolean;
  };
}
