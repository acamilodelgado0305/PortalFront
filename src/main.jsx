import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importar los componentes

import ErrorPage from "./error-page";
import Landing from "./landing";


import FormStudent from "./components/Form/Student";
import MultiStepForm from "./components/Form/Teacher/FormTeacher";
import Login from "./components/auth/Login";
import Results from "./components/results/Results";


import "./index.css";
import Dashboard from "./components/dashboard/dashboard";

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/register/student",
    element: <FormStudent />,
  },
  {
    path: "/register/teacher",
    element: <MultiStepForm />,
  },
  {
    path: "/results",
    element: <Results />,
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
