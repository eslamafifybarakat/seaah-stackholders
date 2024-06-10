export const roots = {
  auth: {
    login: 'login',
    currentUserInformation: 'users/user-loggned',
    registerParent: 'register',
    validateCode: 'check-otp',
    logout: 'logout',
    forgetPassword: '/Account/ForgetPassword',
    resetPassword: '/Account/ResetPassword',
    updateProfile: '/Account/UpdateProfile',

    isEmailAvailable: "/Account/IsEmailAvailable",

    isUserNameFound: "/Account/IsUserNameFound",
    isVatIdAvailableRegister: '/Application/IsVatNumberAvailable',
    checkCompanyNameAvailability: 'Supplier/checkCompanyNameAvailability',
    register: "/Application/Register",
  },
  home: 'home',
  supplier: {
    getCountries: "/Country/GetCountrys",
    getCitiesByCountryId: "/City/GetCitysByCountryId",
  },
  dashboard: {
    uploadFile: '/uploadFile',
    availability: {
      IsNationalIdentityAvailable: "Client/IsIdentityAvailable",
      IsEmailAvailable: "Client/IsEmailAvailable",
      IsPhoneAvailable: "Client/IsPhoneNumberAvailable"
    },
    clients: {
      getClients: 'Client/AllClients',
      addClient: 'Client/AddClient',
      editClient: '/Client/UpdateClient',
      deleteClients: '/deleteClients',
    },
    users: {
      users: 'users/get-user'
    },
    organizations: {
      allOrganizations: 'organization',
      organizationByType: 'organization/get-data',
    },
    installmentWays: {
      getInstallmentWays: 'installment_ways'
    },
    kids: {
      kids: 'kids',
      levels: "kids/levels",
      toggleActivation: "kids/update-approval",
    },
    tuitionExpenses: {
      tuitionExpenses: 'tuition_expenses'
    },
    kidTuitions: {
      addEdit: 'kids/update-expenses'
    },
    records: {
      getRecords: '/getRecords',
      addRecords: '/addRecords',
      editRecords: '/editRecords',
      IsRecordNumberAvailable: "/RecordNumber",
    },
    employees: {
      getEmployees: '/getEmployees',
      addEditEmployee: '/addEditEmployee'
    },
    vehicles: {
      getVehicles: '/getVehicles',
      addEditVehicle: '/addEditVehicle'
    },
    myExpenses: {
      getAll: 'installment_requests',
      addEdit: 'installment_requests'
    },
    rqeuests: {
      getAll: 'bank/requests',
      changeRequestStatus: 'bank'
    }
  }
}
