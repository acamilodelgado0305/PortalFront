import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { message } from "antd";
import { uploadImage } from "../../../../services/utils.js";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";

const PhotoStep = ({ onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.log("No se ha seleccionado ningún archivo");
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    try {
      const contentType = file.type || "application/octet-stream";
      const response = await uploadImage(file, contentType);

      if (response && response.url) {
        const uploadedImageUrl = response.url;
        setProfileImageUrl(uploadedImageUrl);
        message.success("Photo uploaded successfully");
        onChange({ profileImageUrl: uploadedImageUrl });
      } else {
        throw new Error(response.data?.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to upload the image. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile photo</h2>
      <p className="mb-4 text-gray-600">
        Choose a photo that will help learners get to know you.
      </p>

      <div className="w-full flex justify-center items-center mb-6">
        <div className="w-48 h-48 bg-gray-200 border border-dashed border-gray-400 flex justify-center items-center overflow-hidden rounded-full">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UploadOutlined style={{ fontSize: "48px", color: "#bfbfbf" }} />
          )}
        </div>
      </div>


      <div
        {...getRootProps()} className="cursor-pointer mb-6">
        <input {...getInputProps()} />
        <button
          className="bg-[#FFFF45] text-black px-4 py-2 rounded-md hover:bg-pink-600"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload photo"}
        </button>
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