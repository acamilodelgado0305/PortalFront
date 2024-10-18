import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importar los componentes

import ErrorPage from "./error-page";
import Landing from "./landing";


import FormStudent from "./components/Form/Student";
import MultiStepForm from "./components/Form/Teacher/FormTeacher";
import Results from "./components/results/Results";
import SignIn from "./components/Login/SingIn/Index.jsx"
import SingOut from "./components/Login/SingOut/Index.jsx"

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
  },
  {
    path:"/sign-in",
    element:<SignIn/>
  },
  {
    path:"/sign-out",
    element:<SingOut/>
  }
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
