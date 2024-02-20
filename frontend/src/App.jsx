import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from './pages/Layout.jsx';
import AuthenticationPage from './pages/AuthenticationPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/login', element: <AuthenticationPage version={'login'}/>},
      { path: '/signup', element: <AuthenticationPage version={'signup'}/>}

    ],
  },

]);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
