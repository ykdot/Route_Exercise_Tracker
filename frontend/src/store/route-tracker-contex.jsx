import { createContext } from "react";

const RouteTrackerContext = createContext({
  user: {},
  userID: null,
  username: null,
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  api: false
});

export default RouteTrackerContext;