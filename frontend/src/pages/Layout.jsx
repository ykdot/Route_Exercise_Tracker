import { Outlet } from "react-router-dom";

import Navbar from "../component/Navbar/Navbar";

import styles from './css/Layout.module.css';

function Layout() {

  return (
    <div className={styles.layout}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Layout;