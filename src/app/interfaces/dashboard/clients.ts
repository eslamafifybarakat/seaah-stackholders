//Listing
export interface UsersListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: UserListingItem[];
  };
}
export interface UserListingItem {
  id: number | string;
  name: string;
  email: string;
  phone: string;
}
