export interface sliderItems {
  id?: number,
  imgUrl: string,
  title: string;
  description: string;
}
export interface PasswordPatterns {
  title: string;
  value: string;
}

// Start Login
interface LoginUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  type: string;
  phone: string;
  iqama_No: string;
  ip_address: string;
  device_token: string | null;
  source_register: string;
  created_at: string;
  updated_at: string;
  token: string;
}
interface LoginRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: string;
    role_id: string;
  };
  permissions: string[];
}
export interface LoginApiResponse {
  status: number;
  message: string;
  data: {
    user_info: LoginUser;
    roles: LoginRole;
  };
}
// End Login

// Start Current User Information
interface CurrentUserInformationUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  type: string;
  phone: string;
  iqama_No: string;
  ip_address: string;
  device_token: string | null;
  source_register: string;
  created_at: string;
  updated_at: string;
}
interface CurrentUserInformationRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: string[];
}
export interface UserData {
  user: CurrentUserInformationUser;
  roles: CurrentUserInformationRole;
}
export interface CurrentUserInformationApiResponse {
  status: number;
  message: string;
  data: {
    data: UserData;
    status: boolean;
    message: string;
  };
}
// End Current User Information

// Start Logout 
export interface LogoutApiResponse {
  status: number;
  message: string;
}
// End Logout 

