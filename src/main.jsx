import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importar los componentes

import ErrorPage from "./error-page";
import Landing from "./landing";
import AddTeacher from "./components/Teacher/AddTeacher";
import Form from "./components/Form";



import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      
    ],
  },
  {
    path: "/register/teacher",
    element: <AddTeacher />,

  },
  {
    path: "/form/",
    element: <Form />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
