import  { useState, useCallback, useRef } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import AvatarEditor from "react-avatar-editor";

const PhotoStep = ({ onChange, setIsVerified }) => {
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
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
    /*const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match the original image size
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;

    // Apply zoom and rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(imgRef.current, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg');
    */
    setProfileImageUrl(canvas);
    setIsEditing(false);
    setIsVerified(true)
    onChange({ profileImageUrl: canvas });
  }, [zoom, rotation, onChange]);

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
        setIsVerified(false)
        setRotation(0);
        setZoom(1);
        onChange({ profileImageUrl: null });
        Swal.fire(
          'Deleted!',
          'Your photo has been deleted.',
          'success'
        )
      }
    })
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile photo</h2>
      <p className="mb-4 text-gray-600">
        Choose a photo that will help learners get to know you.
      </p>

      <div className="w-full flex justify-center items-center mb-6">
        {isEditing ? (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-full">
              
              {
                /*
                <img
                ref={imgRef}
                src={profileImageUrl}
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                alt="Edit me"
              />
                */        
              }
              <AvatarEditor 
              ref={imgRef}
              image={profileImageUrl}
              width={250}
              height={250}
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
              className="w-48 h-48 bg-gray-200 border border-dashed border-gray-400 flex flex-col justify-center items-center overflow-hidden rounded-full cursor-pointer relative"
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

      {/* Guidelines for photo */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">What your photo needs</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> You should be facing
            forward
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> Frame your head and
            shoulders
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> You should be
            centered and upright
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> Your face and eyes
            should be visible (except for religious reasons)
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> You should be the
            only person in the photo
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> Use a color photo
            with high resolution and no filters
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span> Avoid logos or
            contact information
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoStep;