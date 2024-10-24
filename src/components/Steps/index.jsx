
const Steps = () => {
  return (
    <div className="bg-white py-12 px-4 h-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-900">
          Empezar es tan fácil como contar hasta tres
        </h2>
        <p className="text-2xl text-gray-700">
          Clases particulares que han sido galardonadas y a las que accedes en 3 sencillos pasos
        </p>
      </div>

      <div className="md:h-[400px] flex flex-col items-center justify-center gap-6 sm:flex-row">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs">
          <h3 className="text-6xl font-bold text-purple-500">1</h3>
          <h4 className="text-3xl font-bold text-blue-900 mt-4">Reserva una clase de prueba</h4>
          <p className="text-gray-600 mt-7 text-xl">
            Comparte tus necesidades de aprendizaje para encontrar a tu profesor/a ideal en función de aspectos como la personalidad, el nivel y los objetivos.
          </p>
        </div>

        <div className="md:h-[400px] bg-white rounded-lg shadow-xl p-6 max-w-xs">
          <h3 className="text-6xl font-bold text-purple-500">2</h3>
          <h4 className="text-3xl font-bold text-blue-900 mt-4">Pruébalo gratis</h4>
          <p className="text-gray-600 mt-7 text-xl">
            Apúntate a una clase de prueba gratuita y sin ninguna obligación para probar las clases particulares. Sin compartir datos de tarjeta de crédito y sin compromiso.
          </p>
        </div>

        <div className="md:h-[400px] bg-white rounded-lg shadow-xl p-6 max-w-xs">
          <h3 className="text-6xl font-bold text-purple-500">3</h3>
          <h4 className="text-3xl font-bold text-blue-900 mt-4">Empieza a aprender</h4>
          <p className="text-gray-600 mt-7 text-xl">
            Reserva un paquete de clases a medida para empezar con un plan personalizado para mejorar las notas y la confianza.
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <a href="#primeros-pasos" className="text-blue-500 font-semibold text-xl underline">
          Primeros pasos &rarr;
        </a>
      </div>
    </div>
  );
};

export default Steps;