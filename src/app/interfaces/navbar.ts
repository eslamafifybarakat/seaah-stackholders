export interface NavItem {
  title: string;
  label: string;
  route: string;
  icon?: string;
  logout?: boolean;
  children?: NavItem[]; // Optional array of NavItem for nested navigation
}

export const navItems = [
  { title: 'nav.home', label: 'nav.home', route: '/Home', icon: '' },
  { title: 'nav.aboutUs', label: 'nav.aboutUs', route: '/AboutUs', icon: '' },
  { title: 'nav.contact', label: 'nav.contact', route: '/ContactUs', icon: '' }
];
