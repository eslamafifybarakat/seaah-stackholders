//Lisiting
export interface InstallmentWaysListingItem {
  id: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
}
interface Link {
  url: string | null;
  label: string;
  active: boolean;
}
export interface InstallmentWaysListApiResponse {
  status: number;
  message: string;
  data: {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    items: InstallmentWaysListingItem[];
  };
}
// Listing

// Deletion
interface DeleteInstallmentWayData {
  id: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  created_at: string;
  updated_at: string;
}
export interface DeleteInstallmentWaySuccessResponse {
  status: number;
  message: string;
  data: DeleteInstallmentWayData;
}// Deletion