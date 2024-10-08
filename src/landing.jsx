import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../images/fondos.jpg";
import TeacherBanner from "./components/TeacherBanner";
import Steps from "./components/Steps";
import HowBranakWorks from "./components/HowBranakWorks";
import Tutor from "./components/Tutor";
import Subject from "./components/Subject";

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-[#7BD8FF] p-4 flex justify-between items-center z-50">
        <div></div>
        <div>
          <Link
            to="/signup"
            className="bg-[#5CEFFF] text-black px-4 py-2 rounded mr-4"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="bg-[#FFFF45] text-black px-4 py-2 rounded"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-start justify-center min-h-screen mt-15.5">
        <div
          className="flex flex-col items-start justify-center w-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100vh",
          }}
        >
          <div className="text-start text-white p-8 mt-20">
            <h1 className="text-5xl font-bold mb-4">
              Elije un buen maestro en 5 minutos
            </h1>
            <p className="text-white-300 mb-6">El contacto es gratuito</p>
          </div>

          <div className="pl-6 space-y-6 w-29">
            <Link to="/register/student">
              <button className="bg-[#FFFF45] text-black px-6 py-2 rounded-full w-full">
                Aprende
              </button>
            </Link>

            <div>
              <Link to="/register/teacher">
                <button className="bg-[#5CEFFF] text-black px-6 py-2 rounded-full w-full">
                  Enseña
                </button>
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-end h-[18em] w-full">
            <div className="mr-4">
              <Link to="/form">
                <button className="bg-purple-500 text-white px-6 py-2 rounded-full w-full">
                  Anuncia lo que buscas
                </button>
              </Link>
            </div>
          </div>
        </div>

        <TeacherBanner />
        <Steps />
        <HowBranakWorks />
        <Tutor />
        <Subject />
      </main>
    </div>
  );
};

export default Landing;
