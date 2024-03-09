import { createContext } from "react";

const RouteTrackerContext = createContext({
  user: {},
  userID: null,
  username: null,
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},

  
  apiLogin: () => {},
  apiStatus: false
});

export default RouteTrackerContext;