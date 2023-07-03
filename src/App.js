import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import userManagement from './pages/UserManagement'
import AddUser from './pages/AddUser'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ShowFile = lazy(() => import('./pages/ShowFile'))
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const ProfilePage = lazy(() => import('./pages/UserProfile'))
const EditUser = lazy(() => import('./pages/EditUser'))
const DashboardSupport = lazy(() => import('./pages/DashboardSupport'))

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/createAccount" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          
          {/* Place new routes over this */}
          <Route path="/app" component={Layout} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/login" />
          <Route exact path="/app/file/:id" component={ShowFile} />
          <Route exact path="/app/dashboardAdmin" component={DashboardAdmin} />
          <Route exact path="/app/dashboardSupport" component={DashboardSupport} />
          <Route exact path="/app/profile" component={ProfilePage} />
          <Route exact path="/app/userManagement" component={userManagement} />
          <Route exact path="/app/editUser/:id" component={EditUser} />
          <Route exact path="/app/addUser" component={AddUser} />
        </Switch>
      </Router>
    </>
  )
}

export default App
