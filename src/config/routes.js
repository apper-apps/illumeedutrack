import Dashboard from '@/components/pages/Dashboard';
import Applications from '@/components/pages/Applications';
import Analytics from '@/components/pages/Analytics';
import Agents from '@/components/pages/Agents';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  applications: {
    id: 'applications',
    label: 'Applications',
    path: '/applications',
    icon: 'FileText',
    component: Applications
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  agents: {
    id: 'agents',
    label: 'Agents',
    path: '/agents',
    icon: 'Users',
    component: Agents
  },
settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  users: {
    id: 'users',
    label: 'User Management',
    path: '/users',
    icon: 'UserCog',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;