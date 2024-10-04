import { uploadImage } from "../services/utils";
import { message } from "antd";

export const fileUpload = async (acceptedFiles) => {
  if (!acceptedFiles || acceptedFiles.length === 0) {
    console.log("No se ha seleccionado ningún archivo");
    return null;
  }
  const file = acceptedFiles[0];
  if (!file) return null;
  const contentType = file.type;
  try {
    const response = await uploadImage(file, contentType);
    contentTypeSuccessMessage(contentType, file);
    return response.url;
  } catch {
    contentTypeErrorMessage(contentType, file)
    return null;
  }
};

const contentTypeSuccessMessage = (contentType, file) => {
  if (contentType.includes("image")) {
    message.success(`${file.name} photo uploaded successfully`);
  } else {
    message.success(`${file.name} file uploaded successfully`);
  }
};

const contentTypeErrorMessage = (contentType, file) => {
    if (contentType.includes("image")) {
        message.error(`${file.name} Error:  Please check the image size . The content type must be an image.`);
    } else {
        message.error(`${file.name} file upload failed.`);
    }
  };