import { Time } from "@angular/common";

//Listing
export interface BankListingItem {
  id: number;
  name: { en: string; ar: string } | string;
  type: string;
  location: { en: string; ar: string } | string;
  start_time: string | Time | null;
  end_time: string | Time | null;
  installment_ways: string | null;
  image_path: string;
  status: boolean;
}
interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

interface BanksListData {
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
  items: BankListingItem[];
}

export interface BanksListApiResponse {
  status: number;
  message: string;
  data: BanksListData;
}

// Deletion
export interface DeleteBankApiResponse {
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
    installment_ways: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    image_path: string;
  };
}

// Bank Details
// Interface for each installment way item
interface InstallmentWay {
  id: number;
  name: string;
  description: string;
}
// Interface for the main bank data
export interface BankDetailsData {
  id: number;
  name: string;
  type: string;
  location: string;
  start_time: string;
  end_time: string;
  installment_ways: InstallmentWay[];
  image_path: string;
  status: boolean;
}
// Interface for the API response
export interface GetBankApiResponse {
  status: number;
  message: string;
  data: BankDetailsData;
}


