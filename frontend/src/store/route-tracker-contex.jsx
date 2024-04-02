import { createContext } from "react";

const RouteTrackerContext = createContext({
  userID: null,
  username: null,
  email: null,
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  apiLogin: () => {},
  isPolarAuthenticated: false,
  apiID: null,
  apiToken: null
});

export default RouteTrackerContext;