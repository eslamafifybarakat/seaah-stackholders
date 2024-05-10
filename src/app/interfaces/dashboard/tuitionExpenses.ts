//Listing
export interface TuitionExpensesListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: TuitionExpenseListingItem[];
  };
}
export interface TuitionExpenseListingItem {
  id: number | string;
  title: string;
  details: string;
  level: string;
  total: number;
  deserved_date: Date;
  school_id?: string;
  parent_id?: string;
}
