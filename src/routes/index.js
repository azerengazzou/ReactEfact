import { lazy } from 'react'
import AddUser from '../pages/AddUser'



// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const ShowFile = lazy(() => import('../pages/ShowFile'))
const DashboardAdmin = lazy(() => import('../pages/DashboardAdmin'))
const UserManagement =lazy(() => import('../pages/UserManagement'))
const ProfilePage =lazy(() => import('../pages/UserProfile'))
const EditUser =lazy(() => import('../pages/EditUser'))
const FilesList =lazy(() => import('../pages/FilesList'))
const TicketsSupport = lazy(()=> import('../pages/TicketsSupport'))
const DiscussionSupport = lazy(()=> import('../pages/DiscussionSupport'))
const TicketDoctor = lazy(()=> import('../pages/TicketDoctor'))
const DiscussionDoctor = lazy(()=> import('../pages/DiscussionDoctor'))
const DashboardSupport = lazy(()=> import('../pages/DashboardSupport'))
const TypeMessages = lazy(()=> import('../pages/TypeMessages'))
const Enregistrements = lazy(()=> import('../pages/Enregistrements'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */

const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/TicketsSupport', // the url
    component: TicketsSupport, // view rendered
  },
  {
    path: '/TicketsDoctor', // the url
    component: TicketDoctor, // view rendered
  },
  {
    path: '/FilesList', // the url
    component: FilesList, // view rendered
  },
  {
    path: '/dashboardAdmin', // the url
    component: DashboardAdmin, // view rendered
  },
  {
    path: '/dashboardSupport', // the url
    component: DashboardSupport, // view rendered
  },
  {
    path: '/profile', // the url
    component: ProfilePage, // view rendered
  },
  {
    path: '/userManagement', // the url
    component: UserManagement, // view rendered
  },
  {
    path: '/editUser/:id', // the url
    component: EditUser, // view rendered
  },
  {
    path: '/discussion/:id', // the url
    component: DiscussionSupport, // view rendered
  },
  {
    path: '/Enregistrements', // the url
    component: Enregistrements, // view rendered
  },
  {
    path: '/discuss/:id', // the url
    component: DiscussionDoctor, // view rendered
  },
  {
    path: '/file/:id', // the url
    component: ShowFile, // view rendered
  },
  {
    path: '/TypeMessages', // the url
    component: TypeMessages, // view rendered
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
