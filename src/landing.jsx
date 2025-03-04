import { Link } from "react-router-dom";
//import backgroundImage from "../images/imagen2.webp";
import backgroundImage from "../images/imagen3.jpg";
import TeacherBanner from "./components/TeacherBanner";
import Steps from "./components/Steps";
import HowBranakWorks from "./components/HowBranakWorks";
import Tutor from "./components/Tutor";
import Subject from "./components/Subject";
import Header from "./components/results/Header";

import './landing.css'

const Landing = () => {

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header fijo */}
      <Header/>
      {/* Main content */}
      <main className="mt-15.5 flex min-h-screen flex-col items-start justify-center">

      <div
      className="landing_background flex w-full flex-col items-start justify-between"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >     <div className="mt-[5vh] md:mt-20 px-10 md:p-10 md:p-20 text-start text-purple-600">


            <h1 className="mb-4 text-[3.0rem]  md:text-[4.1rem] font-bold">
              Elije un buen <span className="text-purple-700">maestro</span> en 5 minutos
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
          <div className="flex lg: md:h-[9vh] h-[18em] w-full items-center md:items-end justify-end md:px-[10vh]">
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
