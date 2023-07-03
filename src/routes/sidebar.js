/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const allroutes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
    allowedRoles: ['Doctor']
  },
  {
    path: '/app/dashboardSupport', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard Support', // name that appear in Sidebar
    allowedRoles: ['Support']
  },

  {
    path: '/app/ticketsSupport', // the url
    icon: 'ModalsIcon', // the component being exported from icons/index.js
    name: 'Tickets', // name that appear in Sidebar
    allowedRoles: ['Support']
  },
  {
    path: '/app/dashboardAdmin', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Admin Dashboard', // name that appear in Sidebar
    allowedRoles: ['Administrator']
  },
  {
    icon: 'OutlineCogIcon',
    name: 'Configuration EFact',
    allowedRoles: ['Administrator'],
    routes: [
      // submenu
      {
        path: '/app/TypeMessages',
        name: 'Messages',
      },
      {
        path: '/app/Enregistrements',
        name: 'Enregistrements',
      },
      {
        path: '/app/Zones',
        name: 'Zones',
      }
    ],
  },
  {
    path: '/app/discussions', // the url
    icon: 'ChatIcon', // the component being exported from icons/index.js
    name: 'Discussions', // name that appear in Sidebar
    allowedRoles: ['Support']
  },
  {
    path: '/app/sujets', // the url
    icon: 'TablesIcon', // the component being exported from icons/index.js
    name: 'Sujets', // name that appear in Sidebar
    allowedRoles: ['Support','Administrator']
  },
  {
    path: '/app/FilesList', // the url
    icon: 'FormsIcon', // the component being exported from icons/index.js
    name: 'Messages de réponse eFact', // name that appear in Sidebar
    allowedRoles: ['Doctor']
  },
  {
    path: '/app/TicketsDoctor', // the url
    icon: 'CardsIcon', // the component being exported from icons/index.js
    name: 'Tickets', // name that appear in Sidebar
    allowedRoles: ['Doctor']
  },
 
  {
      path: '/app/userManagement', // the url
      icon: 'PeopleCopyIcon', // the component being exported from icons/index.js
      name: 'Gestion de profils', // name that appear in Sidebar
      allowedRoles: ['Administrator']
  },
  {
    icon: 'OutlineCogIcon',
    name: 'Compte',
    routes: [
      // submenu
      {
        path: '/forgot-password',
        name: 'Forgot password',
        allowedRoles: ['Doctor','Support'],
      },
      {
        path: '/app/profile',
        name: 'Profile',
        allowedRoles: ['Doctor','Support'],
      },
    ],
  },
];

// Get user roles from localStorage or any other source
const userRoles = localStorage.getItem('role');
console.log(userRoles);
// Filter routes based on user roles
const routes = allroutes.filter((route) => {
  if (route.allowedRoles) {
    // Check if the route has allowed roles defined
    // Return true if the user has at least one allowed role
    return route.allowedRoles.some((allowedRole) => userRoles.includes(allowedRole));
  }
  // If no allowed roles are defined, include the route
  return true;
});

export default routes
