import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../src/Context/AuthContext";
import { WhiteBoardSocketProvider } from "./components/WhiteBoardDashBoard/WhiteBoardSocketProvider.jsx";
import ProtectedRoute from "./ProtectedRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ErrorPage from "./error-page";
import Landing from "./landing";

import FormStudent from "./components/Form/Student";
import MultiStepForm from "./components/Form/Teacher/FormTeacher";
import Login from "./components/auth/Login";
import RegisterPage from "./components/auth/RegisterPage";
import Results from "./components/results/Results";
import WhiteBoardDashBoard from "./components/WhiteBoardDashBoard/Index.jsx";
import TeacherDetail from "./components/dashboard/TeacherDetail";
import VideoModal from "./components/VideoConference/VideoModal.jsx";


import "./index.css";
import Dashboard from "./components/dashboard/dashboard";
import WhiteBoardProvider from "./components/WhiteBoardDashBoard/components/WhiteBoard/WhiteBoardContext.jsx";
import ChatStandardSocketProvider from "./components/results/ChatStandardSocketProvider.jsx"
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
    path: "/register",
    element: <RegisterPage />,
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
    element: (

      <Results />

    ),
  },
  {
    path: "/whiteboard/:room",
    element: (
      <ProtectedRoute>
        <WhiteBoardDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/whiteboard/:room",
    element: (
      <ProtectedRoute>
        <WhiteBoardDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/meet",
    element: <VideoModal />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        "client-id": "Ad7F7AE1fhfG2q47qS7PDWuN2N0GfwV9_FMSbEV6mlveiomxe2_5K-xfVCngqz1TNBLuiiWrRreJmVSn",
      }}
    >
      <ChatStandardSocketProvider>
        <WhiteBoardSocketProvider>
          <WhiteBoardProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </WhiteBoardProvider>
        </WhiteBoardSocketProvider>
      </ChatStandardSocketProvider>
    </PayPalScriptProvider>,
  </React.StrictMode>,
);
