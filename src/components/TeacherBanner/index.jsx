import React from "react";
import PurpleGreenForm from "./PurpleGreenForm.png";
import { Link } from "react-router-dom";

const TeacherBanner = () => {
  return (
    <div className="bg-purple-100 relative p-8 h-auto w-full flex flex-col items-center rounded-lg shadow-lg sm:flex-row">
      <div className="">
        <img src={PurpleGreenForm} alt="Banner" className="w-96" />
      </div>

      <div className="sm:pl-14">
        {/* Asegurarse de envolver el contenido en un solo Link */}
        <Link to="/register/teacher">
          <div>
            <h2 className="text-4xl font-bold pb-4 text-blue-800">
              ¿Quieres convertirte en profesor/a particular?
            </h2>
            <p className="text-gray-600 text-3xl pb-8">
              Descubre cómo seleccionamos a los profesores particulares, qué cualificaciones se necesitan y cuánto puedes llegar a ganar.
            </p>

            {/* Botón dentro del Link */}
            <button className="bg-blue-800 text-white text-3xl p-7 px-10 rounded-md shadow-md hover:bg-blue-600">
              Regístrate como profesor/a particular
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TeacherBanner;
