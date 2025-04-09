// Copyright © 2024 Elysia

// Core
import { createRoot } from 'react-dom/client'

// Router
import { Navigate, Routes, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

// Redux
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './framework/redux-store'

// UI
import { Roots, BulmaFormSettings } from 'bulma-smart-react-forms'

// Gateways
import { AuthInitialization } from './interface/layouts/gates/AuthInitialization'
import { DashboardDataGate } from './interface/layouts/gates/DashboardDataGate'
import { AuthorizedGate } from './interface/layouts/gates/AuthorizedGate'
import { ResetReduxGate } from './interface/layouts/gates/ResetReduxGate'

// Routes -- Homepages
// import { Home } from './interface/layouts/homepages/Home'
// import { About } from './interface/layouts/homepages/About'
// import { Contact } from './interface/layouts/homepages/Contact'
// import { Pricing } from './interface/layouts/homepages/Pricing'

// Routes -- Dashboard
import { Dashboard } from './interface/layouts/application/Dashboard'

// Routes -- Authentication
import { Logout } from './interface/layouts/auth/Logout'
import { LoginSignupPage } from './interface/layouts/auth/LoginSignupPage'
import { ForgotPassword } from './interface/layouts/auth/ForgotPassword'
import { ResetPassword } from './interface/layouts/auth/ResetPassword'
import { Profile } from './interface/layouts/auth/Profile'

// Constants
import { UrlTree, UNKNOWN_ROUTE_REDIRECT_TO } from './constants'

// Framework
import '@/framework/language'

// SCSS
import '@/sass/global.sass'
import '@/sass/fonts.sass'
import '@/sass/bulma.scss'
import '@/sass/bulmaPlus.sass'

BulmaFormSettings.CustomModalParentElement = document.body

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <ReduxProvider store={store}>
    <AuthInitialization>
      <Roots>
        <BrowserRouter
          future={{
          // https://reactrouter.com/en/6.28.1/upgrading/future
            v7_relativeSplatPath: true,
            v7_startTransition: true
          }}>
          <Routes>
            {/* ---- Put unauthenticated routes in here ---- */}

            {/* When the user redirects to these, it will:
              1. Reset their redux state
              2. Wipe their auth creds from local forage */}
            <Route path={UrlTree.root} element={<ResetReduxGate />}>
              {/* Homepages */}
              {/* <Route index path={UrlTree.home} element={<Home />} />
              <Route path={UrlTree.about} element={<About />} />
              <Route path={UrlTree.contact} element={<Contact />} />
              <Route path={UrlTree.pricing} element={<Pricing />} /> */}

              {/* Authentication */}
              <Route path={UrlTree.login} element={<LoginSignupPage login />} />
              <Route path={UrlTree.signup} element={<LoginSignupPage signup />} />
              <Route path={UrlTree.logout} element={<Logout />} />
              <Route path={UrlTree.forgotPassword} element={<ForgotPassword />} />
              <Route path={UrlTree.resetPassword} element={<ResetPassword />} />
              <Route path={UrlTree.root} element={<Navigate to={UNKNOWN_ROUTE_REDIRECT_TO} />} />
              <Route path='*' element={<Navigate to={UNKNOWN_ROUTE_REDIRECT_TO} />} />
            </Route>

            {/* ---- Only authorized paths from here ---- */}

            {/* Dashboard */}
            <Route path={UrlTree.root} element={<AuthorizedGate />}>
              <Route path={UrlTree.dashboard} element={<DashboardDataGate />}>
                <Route path={UrlTree.dashboard} element={<Dashboard />} />
                <Route path={UrlTree.profile} element={<Profile />} />
              </Route>
            </Route>
            <Route path='*' element={<Navigate to={UNKNOWN_ROUTE_REDIRECT_TO} />} />
          </Routes>
        </BrowserRouter>
      </Roots>
    </AuthInitialization>
  </ReduxProvider>
)
