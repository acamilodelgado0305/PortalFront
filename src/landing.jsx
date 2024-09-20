import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../images/fondos.jpg";

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <header className="absolute top-0 left-0 right-0 bg-blue-500 p-4 flex justify-between items-center">
        <div></div>
        <div>
          <Link
            to="/signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded mr-2"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="bg-yellow-400 text-black px-4 py-2 rounded"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-start justify-center min-h-screen">
        <div
          className="flex flex-col items-start justify-center w-full mt-12"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "800px",
          }}
        >
          <div className="text-start text-white p-8 mt-20">
            <h1 className="text-5xl font-bold mb-4">
              Elije un buen maestro en 5 minutos
            </h1>
            <p className="text-white-300 mb-6">El contacto es gratuito</p>
          </div>
          <div className="pl-6 space-y-6 w-29">
            <button className="bg-yellow-400 text-black px-6 py-2 rounded w-full">
              Aprende
            </button>

            <div>
              <Link to="/register/teacher">
                <button className="bg-blue-500 text-white px-6 py-2 rounded w-full">
                  Enseña
                </button>
              </Link>
            </div>

            <button className="bg-purple-500 text-white px-6 py-2 rounded w-full">
              Anuncia lo que buscas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
