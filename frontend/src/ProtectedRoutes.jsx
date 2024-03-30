import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import RouteTrackerContext from "./store/route-tracker-contex";

function ProtectedRoutes() {
  const auth = useContext(RouteTrackerContext);
  const location = useLocation();


  return auth.isLoggedIn ? <Outlet /> : <Navigate to ='/' replace state={{ from: location }}/>;
}

export default ProtectedRoutes;