import ContainerSubjcts from "./ContainerSubjcts";

const subjects = [
  { name: 'Matemáticas', icon: '📊' },
  { name: 'Alemán', icon: '🇩🇪' },
  { name: 'Física', icon: '🔬' },
  { name: 'Inglés', icon: '🇬🇧' },
  { name: 'Química', icon: '⚗️' },
  { name: 'Economía', icon: '🏛️' },
  { name: 'Francés', icon: '🇫🇷' },
  { name: 'Latín', icon: '🏛️' },
  { name: 'Biología', icon: '🌱' },
  { name: 'Lengua y Literatura', icon: '📚' },
  { name: 'Italiano', icon: '🇮🇹' },
  { name: 'Geografía', icon: '🌍' },
];

const Subject = () => {
  return (
    <div className="bg-white h-auto w-full pb-[10vh]">
      <div className="max-w-screen-lg mx-auto ">

      <div className="text-center mb-8 ">
        <h2 className="text-4xl font-bold text-[#3b82f6]">Asignaturas más solicitadas</h2>
        <p className="mt-2"> Matemáticas, Física... Recibe clases particulares de apoyo en más de 30 asignaturas</p>
      </div>

    <ContainerSubjcts subjects={subjects} />

      <div className="text-center mt-8">
        <a href="#"
           className="text-blue-300 underline flex items-center justify-center"
        >
          Ver todas las asignaturas <span className="ml-1">⬇️</span>
        </a>
      </div>
    </div>

      </div>
  );
};

export default Subject;
