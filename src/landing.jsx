import { Link } from "react-router-dom";
import backgroundImage from "../images/fondos.jpg";
import TeacherBanner from "./components/TeacherBanner";
import Steps from "./components/Steps";
import HowBranakWorks from "./components/HowBranakWorks";
import Tutor from "./components/Tutor";
import Subject from "./components/Subject";

import './landing.css'

const Landing = () => {

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header fijo */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#7BD8FF] p-4">
        <div></div>
        <div>
          <Link
            to="/sign-in"
            className="mr-4 rounded bg-[#5CEFFF] px-4 py-2 text-black"
          >
            Sign Up
          </Link>
          <Link
            to="/sign-out"
            className="rounded bg-[#FFFF45] px-4 py-2 text-black"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-15.5 flex min-h-screen flex-col items-start justify-center">
      <div
      className="landing_background flex w-full flex-col items-start justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >     <div className="mt-20 p-20 text-start text-white">
            <h1 className="mb-4 text-[3.1rem]  md:text-[4.1rem] font-bold">
              Elije un buen maestro en 5 minutos
            </h1>
            <p className="text-white-300 mb-6 text-[26px]">El contacto es gratuito</p>
          </div>
          <div className="w-29 space-y-6 pl-20">
            <Link to="/register/student">
              <button className="h-[47px] w-[145px] w-full rounded-2xl bg-[#FFFF45] px-6 py-2 text-[1.3rem] text-black">
                Aprende
              </button>
            </Link>

            <div>
              <Link to="/register/teacher">
                <button className="h-[47px] w-[145px] rounded-2xl bg-[#5CEFFF] px-6 py-2 text-[1.3rem] text-black">
                  Enseña
                </button>
              </Link>
            </div>
          </div>

          <div className="flex h-[18em] w-full items-center md:items-end justify-end">
            <div className="mr-12">
              <Link to="/form">
                <button className="w-full h-[47px] rounded-2xl bg-purple-500 px-6 py-2 text-white text-[1.3rem]  ">
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
