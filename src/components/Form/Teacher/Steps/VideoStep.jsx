import React, { useState, useRef } from "react";
import { Form, Input, Radio, Upload, Button, message } from "antd"; 
import {
  UploadOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons"; 
import { uploadImage } from "../../../../services/utils.js";

const VideoStep = () => {
  const [form] = Form.useForm(); 
  const [videoUploadMethod, setVideoUploadMethod] = useState("file"); 
  const [isRecording, setIsRecording] = useState(false); 
  const videoRef = useRef(null); 
  const mediaRecorderRef = useRef(null); 

  // Función para manejar la carga de videos desde la pc.
  const handleVideoUpload = async (info) => {
    const file = info.file;
    const contentType = file.type;
    const response = await uploadImage(file, contentType);

    if (response.success) {
      message.success(`${info.file.name} video uploaded successfully`);
    } else {
      message.error(
        `${info.file.name} upload failed. It may be due to the file size. Please try again.`,
      );
    }
  };

  // Función para comenzar a grabar video.
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream; 
      const mediaRecorder = new MediaRecorder(stream); 
      mediaRecorderRef.current = mediaRecorder; 
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorder.onstop = async() => {
        const blob = new Blob(chunks, { type: "video/webm" }); 
        const file = new File([blob], "recorded_video.webm", {
          type: "video/webm",
        });

        const response = await uploadImage(file, file.type)

        const fileList = {
          file,
          fileList: [
            {
              uid: "-1",
              name: "recorded_video.webm",
              status: "done",
              url: response.url,
            },
          ], 
        };
        console.log(`¿Url? :\n ${fileList.url} \n\n `)
        console.log(`FileList: \n ${JSON.stringify(fileList)}`)

        form.setFieldsValue({ video: fileList }); 
      };

      mediaRecorder.start();
      setIsRecording(true); 
    } catch (error) {
      console.error("Error accessing camera:", error); 
      message.error("Failed to access camera. Please check your permissions."); 
    }
  };

  // Función para detener la grabación.
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Detenemos el MediaRecorder.
      setIsRecording(false); // Actualizamos el estado de grabación.
      const tracks = videoRef.current.srcObject.getTracks(); // Obtenemos las pistas de video.
      tracks.forEach((track) => track.stop()); // Detenemos las pistas.
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      {" "}
      {/* Contenedor principal del componente */}
      <h2 className="mb-4 text-2xl font-bold">Video Introduction</h2>{" "}
      {/* Título del componente */}
      <p className="mb-4 text-gray-600">
        Upload a video introduction to showcase your teaching style and
        personality
      </p>{" "}
      {/* Descripción del componente */}
      <Form form={form} layout="vertical">
        {" "}
        {/* Componente de formulario de Ant Design */}
        <Form.Item label="Video Upload Method" required>
          {" "}
          {/* Elemento del formulario para seleccionar el método de carga */}
          <Radio.Group
            onChange={(e) => setVideoUploadMethod(e.target.value)} // Actualiza el método de carga seleccionado
            value={videoUploadMethod} // Valor actual del método de carga
          >
            <Radio value="file">Upload File</Radio>{" "}
            {/* Opción para cargar archivo */}
            <Radio value="record">Record Video</Radio>{" "}
            {/* Opción para grabar video */}
            <Radio value="youtube">YouTube Link</Radio>{" "}
            {/* Opción para enlace de YouTube */}
          </Radio.Group>
        </Form.Item>
        {videoUploadMethod === "file" && ( // Condicional para mostrar el campo de carga de archivo
          <Form.Item
            name="video"
            rules={[{ required: true, message: "Please upload a video" }]} // Validación del campo
          >
            <Upload
              accept="video/*" // Aceptar solo archivos de video
              maxCount={1} // Permitir solo un archivo
              onChange={handleVideoUpload} // Manejar la carga del video
              beforeUpload={() => false} // Evitar carga automática
            >
              <Button icon={<UploadOutlined />}>Upload Video</Button>{" "}
              {/* Botón para cargar video */}
            </Upload>
          </Form.Item>
        )}
        {videoUploadMethod === "record" && ( // Condicional para mostrar el campo de grabación de video
          <div>
            <video
              ref={videoRef}
              style={{ width: "100%", maxWidth: "400px" }}
              autoPlay
              muted
            />{" "}
            {/* Reproductor de video */}
            <Button
              onClick={isRecording ? stopRecording : startRecording} // Llama a la función para grabar o detener
              icon={<VideoCameraOutlined />} // Icono para el botón
              className="mt-2"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}{" "}
              {/* Texto del botón */}
            </Button>
          </div>
        )}
        {videoUploadMethod === "youtube" && ( // Condicional para mostrar el campo para enlace de YouTube
          <Form.Item
            name="youtubeLink"
            rules={[
              // Validaciones para el enlace de YouTube
              { required: true, message: "Please enter a YouTube link" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="Enter YouTube video link"
            />{" "}
            {/* Campo de entrada para el enlace */}
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default VideoStep; // Exportamos el componente para su uso en otros lugares
