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
  isPolarAffiliated: null,
  isPolarAuthenticated: false,
  apiID: null,
  apiToken: null
});

export default RouteTrackerContext;