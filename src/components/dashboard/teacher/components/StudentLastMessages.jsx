import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import 

function StudentLastMessages() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-purple-600 mb-4">Chat con Estudiantes</h2>
    <div className="space-y-4">
        {["Juan Pérez", "Ana Gómez", "Carlos López"].map((studentName, index) => (
            <div key={index} className="flex items-center space-x-4">
                <MessageOutlined className="text-purple-600 w-6 h-6" />
                <span className="text-lg font-semibold">{studentName}</span>
                <p className="text-gray-500">
                    {index === 0
                        ? "¿Puedo preguntar sobre el examen?"
                        : index === 1
                        ? "¿Cuándo es la próxima clase?"
                        : "Necesito ayuda con los ejercicios de matemáticas."}
                </p>
            </div>
        ))}
    </div>
    <Button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all">
        Enviar Mensaje
    </Button>
</div>
  )
}

export default StudentLastMessages