import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../src/Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import ErrorPage from "./error-page";
import Landing from "./landing";


import FormStudent from "./components/Form/Student";
import MultiStepForm from "./components/Form/Teacher/FormTeacher";
import Login from "./components/auth/Login";
import SigUp from "./components/auth/SigUp";
import Results from "./components/results/Results";
import WhiteBoard from "./components/Whiteboard/Index";


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
    path: "/sigup",
    element: <FormStudent />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
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
    path:"/whiteboard/:room",
    element: <WhiteBoard/>
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
