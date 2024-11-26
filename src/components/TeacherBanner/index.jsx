import { useState, useEffect } from "react";
import PurpleGreenForm from "./PurpleGreenForm.png";
import { Link } from "react-router-dom";

const TeacherBanner = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isWideScreen = windowWidth < 800;

  return (
    <div className="bg-purple-100 relative p-8 h-auto w-full flex items-center rounded-lg shadow-lg">
      <div>
        <img src={PurpleGreenForm} alt="Banner" className="w-96" />
      </div>

      <div className="pl-14">
        {/* Asegurarse de envolver el contenido en un solo Link */}
        <Link to="/register/teacher">
          <div>
            <h2 className="text-3xl  md:text-4xl font-bold pb-4 text-blue-800">
              ¿Quieres convertirte en profesor/a particular?
            </h2>
            <p className="text-gray-600 text-2xl md:text-3xl pb-8">
              Descubre cómo seleccionamos a los profesores particulares, qué cualificaciones se necesitan y cuánto puedes llegar a ganar.
            </p>

            {/* Botón dentro del Link */}
            <button className="bg-blue-800 text-white text-2xl p-4 md:p-7 px-10 rounded-md shadow-md hover:bg-blue-600">
              Regístrate {!isWideScreen && "como profesor/a particular"}
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TeacherBanner;

