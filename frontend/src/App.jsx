import { useCallback, useContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from './pages/Layout.jsx';
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import AuthenticationPage from './pages/AuthenticationPage.jsx';
import RouteTrackerContext from "./store/route-tracker-contex.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from './pages/AboutPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import RoutePage from "./pages/RoutePage.jsx";
import UserPage from "./pages/UserPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage />},
      // { path: '/about', element: <AboutPage />}, // about page may be redundant for now
      { path: '/demo', element: <DemoPage />},

      { path: '/login', element: <AuthenticationPage version={'login'}/>},
      { path: '/signup', element: <AuthenticationPage version={'signup'}/>},
      { element: <ProtectedRoutes />, children: [
        { path: '/route', element: <RoutePage />},
        { path: '/user/:user', element: <UserPage />},
        { path: '/setting/:user', element: <SettingPage />},        
      ]},
    ],
  },
]);

let logoutTimer;
function App() {
  const auth = useContext(RouteTrackerContext);
  const [token, setToken] = useState(false);
  const [userID, setUserID] = useState(false);
  const [username, setUsername ] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const [apiToken, setApiToken] = useState(false);
  const [isPolarAuthenticated, setIsPolarAuthenticated] = useState(false);


  const login = useCallback((uid, username, token, expirationDate ) => {
    auth.user = uid;
    setToken(token);
    setUsername(username);
    setUserID(uid);
    const tokenClock = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenClock);
    localStorage.setItem(
      'userData', 
      JSON.stringify({ userID: uid, username: username, token: token, expiration: tokenClock.toISOString() }));
  }, []);

  const logout = useCallback(() => {
    auth.user = {};
    setToken(null);
    setUserID(null);
    setUsername(null);
    setTokenExpirationDate(null);
    setApiToken(null);
    setIsPolarAuthenticated(false);
    // localStorage.removeItem('userData');
    // all local storage clear; too generaltho
    localStorage.clear();
    window.location.reload(); 
  }, []);

  const apiLogin = useCallback((token, apiID) => {
    setApiToken(token);
    setIsPolarAuthenticated(true);
    localStorage.setItem(
      'apiToken', 
      JSON.stringify({ apiID: apiID, token: token }));
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }
    else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout])

  // auto-login when refreshing page
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userID, storedData.username, storedData.token, new Date(storedData.expiration));
    }
  }, [login]); 
  return (
    <RouteTrackerContext.Provider
      value = {{
        user: auth.user,
        isLoggedIn: !!token,
        token: token,
        username: username,
        userID: userID,
        login: login,
        logout: logout,
        apiToken: apiToken,
        isPolarAuthenticated: isPolarAuthenticated,
        apiLogin: apiLogin     
      }}>
      <RouterProvider router={router}/>
    </RouteTrackerContext.Provider>
  )
}

export default App