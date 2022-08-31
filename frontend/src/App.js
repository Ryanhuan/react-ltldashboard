import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import "./App.css";
import { pageSettings } from "./pageSettings"

import Topbar from './components/admin/topbar/Topbar'
import Sidebar from './components/admin/sidebar/Sidebar'
import ScrollArrow from './components/scrollArrow/ScrollArrow'
import Login from './pages/login/Login'



function ErrorFallback({ error }) {
  return (
    //TODO: 待補 Error Page
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}


function App() {
  let token = localStorage.getItem('token');

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Login />} />
        </Routes>
      </Router>
    )
  } else {
    return (
      <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <div className="appContainer">
              <Sidebar />
              <ScrollArrow />
              <div className="appBody">
                <Topbar />
                <Routes>
                  {pageSettings.Admin.map((route, index) => (
                    <Route key={index} path={route.href} element={
                        <>
                          <span className="PageTitle">{route.pageTitle}</span>
                          {route.element}
                        </>
                    } />
                  ))}
                </Routes>
              </div>
            </div>
          </Router>
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
