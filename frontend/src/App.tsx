import { ErrorBoundary } from "react-error-boundary";
import { clsx } from "clsx";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { pageSettings } from "./pageSettings";

import styles from "./App.module.scss";

import Loading from "@/components/loading/Loading";
import ScrollArrow from "@/components/scrollArrow/ScrollArrow";
import Login from "@/pages/dashboard/login/login";
import Topbar from "@/components/dashboard/topbar/Topbar";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const ErrorFallback = ({ error }) => {
  return (
    //TODO: 待補 error Page
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export default function App() {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const _setLoading = (state: boolean) => {
    if (state === true) {
      setLoading(state);
    } else if (state === false) {
      setTimeout(() => {
        setLoading(state);
      }, 500);
    }
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <div className={clsx("appContainer")}>
              {loading ? <Loading /> : null}
              <Sidebar />
              <ScrollArrow />
              <div className="appBody">
                <Topbar />
                <Routes>
                  {pageSettings.Admin.map((route, index) => (
                    <Route
                      key={index}
                      path={route.href}
                      element={
                        <>
                          <span className="PageTitle">{route.pageTitle}</span>
                          {
                            <route.element
                              setLoading={state => {
                                _setLoading(state);
                              }}
                            />
                          }
                        </>
                      }
                    />
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
