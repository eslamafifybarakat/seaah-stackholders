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
  { title: 'nav.dashboard', label: 'nav.dashboard', route: '/Dashboard', icon: '' },
  { title: 'nav.dashboard', label: 'nav.dashboard', route: '/Dashboard', icon: '' }
];
