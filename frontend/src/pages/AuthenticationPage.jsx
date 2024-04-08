import { Helmet} from 'react-helmet';
import Login from "../component/Authentication/Login";
import SignUp from "../component/Authentication/SignUp";

import styles from './css/AuthenticationPage.module.css';

function AuthenticationPage({version}) {

  let authentication;

  if (version === 'login') {
    authentication = <Login />
  }
  else {
    authentication = <SignUp />
  }

  return (
    <>
    <Helmet>
      <title>Authentication</title>
    </Helmet>
      <div className={styles.container}>
        {authentication}
      </div>
    </>
  );
}

export default AuthenticationPage;