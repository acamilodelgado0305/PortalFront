import { CloseOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Modal } from "antd"
import { useCallback, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { verifyNumber } from "../../../../services/validations";
import { createStudent } from "../../../../services/studendent.services";
import { uploadImageStudent, uploadImageToS3 } from "../../../../helpers/processImageUpload";

const FormRegister = ({ showModal, setShowModal, user, setIsRegister, getStudent }) => {

  const success = (msg, type) => {
    message.open({ type, content: msg, style: { marginTop: "20vh" } });
  };
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imagen, setImagen] = useState("");
  const imgRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles[0].size > 20 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "The file size exceeds 20MB. Please choose a smaller file.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setUploading(true);
    try {
      const file = acceptedFiles[0];
      const imageDataUrl = await readFile(file);
      setProfileImageUrl(imageDataUrl);
      setIsEditing(true);
      //setIsVerified(true)
    } catch (error) {
      console.error("Error reading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to read the image. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const rotateImage = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const saveEditedImage = useCallback(async () => {
    if (!imgRef.current) return;
    const canvas = imgRef.current.getImage().toDataURL('image/jpeg');
    setProfileImageUrl(canvas);
    setIsEditing(false);
  }, [zoom, rotation]);

  const deleteImage = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setProfileImageUrl(null);
        setIsEditing(false);
        //setIsVerified(false)
        setRotation(0);
        setZoom(1);
        // onChange({ profileImageUrl: null });
        Swal.fire(
          'Deleted!',
          'Your photo has been deleted.',
          'success'
        )
      }
    })
  };
  const registerStudent = async (e) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.target));

    if (!verifyNumber(data.celular)) {
      success("debe ser un numero de celular valido", "warning")
      return
    }

    const profile = await uploadImageStudent(profileImageUrl);
    const studentData = {
      id: user.id,
      role: user.role,
      url: profile.url,
      ...data

    }

    try {

      const create = await createStudent(studentData)
      if (create.success) {
        setShowModal(false);
        setIsRegister(true)
        getStudent();
      } else {
        null
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          continua tu registro como estudiante
        </div>
      } open={showModal}
      onCancel={() => setShowModal(false)}
      footer={null}
      width={550}
      height={800}
      closeIcon={<CloseOutlined className="text-black text-xl" />}
      centered
    >

      <div>
        <div>
          <div className="w-full flex justify-center items-center mb-6">
            {isEditing ? (
              <div className="flex flex-col items-center">
                <div className="overflow-hidden rounded-full">

                  <AvatarEditor
                    ref={imgRef}
                    image={profileImageUrl}
                    width={150}
                    height={150}
                    border={0}
                    scale={zoom}
                    rotate={rotation}

                  />
                </div>
                <div className="mt-4 w-full">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="mt-4">
                  <button onClick={rotateImage} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                    Rotate
                  </button>
                  <button onClick={saveEditedImage} className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div
                  {...getRootProps()}
                  className="w-36 h-36 bg-gray-200 border border-dashed border-gray-400 flex flex-col justify-center items-center overflow-hidden rounded-full cursor-pointer relative"
                >
                  <input {...getInputProps()} />
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <UploadOutlined style={{ fontSize: "48px", color: "#bfbfbf" }} />
                      <p className="text-xs text-center mt-2">
                        Click to upload<br />
                        Max 20MB<br />
                        PNG or JPG
                      </p>
                    </>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <p className="text-white">Uploading...</p>
                    </div>
                  )}
                </div>
                {profileImageUrl && (
                  <button
                    onClick={deleteImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full"
                    title="Delete photo"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <form
            onSubmit={(e) => registerStudent(e)}
            className="flex flex-col gap-2"
            action="">
            <label className="flex flex-col p-2" htmlFor="nombre">Nombre
              <input
                name="nombre"
                className="outline-none h-10 border rounded p-2"
                id="nombre" type="text" required
                value={user.firstName}
              />
            </label>
            <label className="flex flex-col p-2" htmlFor="nombre"> Apellido
              <input
                name="apellido"
                className="outline-none h-10 border rounded p-2"
                id="apellido" type="text" required
                value={user.lastName}
              />
            </label>

            <label
              className="flex flex-col p-2"
              htmlFor="celular">Celular
              <input
                name="celular"
                className="outline-none h-10 border rounded p-2"
                type="text" id="celular" />
            </label>

            <label
              className="flex flex-col p-2"
              htmlFor="correo" required>Correo
              <input
                name="email"
                className="outline-none h-10 border rounded p-2"
                type="text" id="correo" value={user.email} />
            </label>

            <label
              className="flex flex-col p-2"
              htmlFor="edad">Edad
              <input
                name="edad"
                className="outline-none h-10 border rounded p-2"
                type="number" />
            </label>

            <div className="flex text-center">
              <input
                className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all m-auto"
                type="submit" value="Registrarme" />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default FormRegister