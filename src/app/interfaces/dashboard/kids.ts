//Listing
// Interface for each kid item in the list
export interface KidListingItem {
  id: number;
  name: string;
  addressName?:string| null;
  status?:string| null;
  code: string;
  level: string;
  class: string;
  address: string; // JSON string for address details
  paid_status: string; // Assuming a string due to the quotes around numbers
  school_id: string;
  parent_id: string;
  image_path: string;
}
// Interface for pagination link information
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
// Interface for pagination details
interface PaginationKidsListingData<T> {
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
// Interface for the API response
export interface KidsListApiResponse {
  status: number;
  message: string;
  data: PaginationKidsListingData<KidListingItem>; // PaginationData containing array of kids
}

// Deletion Kid

// Interface for the address, since it's a JSON string
interface DeletedKidAddress {
  street: string;
  city: string;
}
// Interface for the kid data
interface DeletedKid {
  id: number;
  name: string;
  code: string;
  level: string;
  class: string;
  address: string; // Still a JSON string, can be parsed into the Address type
  paid_status: string;
  school_id: string;
  parent_id: string;
  image_path: string;
}
// Interface for the API response
export interface DeleteKidApiResponse {
  status: number;
  message: string;
  data: DeletedKid;
}
