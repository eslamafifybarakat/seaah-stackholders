//Listing
// Interface for a single user
export interface UserListItemData {
  id: number;
  name: string;
  email: string;
  phone: string;
}
// Interface for a single item in the `items` array, which includes the user aListItemDatand their roles
export interface UserListItem {
  user: UserListItemData;
  roles: any[]; // Adjust the type for roles based on actual data
}
// Interface for pagination link structure
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
// Interface for the data property of the response
interface UserListData {
  current_page: number;      // Current page number
  first_page_url: string;    // URL for the first page
  from: number;              // Starting index of the records in the current page
  last_page: number;         // Last page number
  last_page_url: string;     // URL for the last page
  links: PaginationLink[];   // Array of pagination links
  next_page_url: string | null; // URL of the next page
  path: string;              // Base URL for pagination
  per_page: number;          // Number of records per page
  prev_page_url: string | null; // URL of the previous page
  to: number;                // Ending index of the records in the current page
  total: number;             // Total number of records
  items: UserListItem[];         // Array of user items
}

// Interface for the overall response
export interface UsersListApiResponse {
  status: number;            // Response status code
  message: string;           // Response message
  data: UserListData;        // Data property containing pagination and user list information
}

