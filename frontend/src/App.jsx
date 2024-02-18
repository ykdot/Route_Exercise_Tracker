import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from './pages/Layout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [


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
