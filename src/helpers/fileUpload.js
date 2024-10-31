import { uploadImage } from "../services/utils";
import { message } from "antd";

export const fileUpload = async (acceptedFiles, type) => {
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
    contentTypeErrorMessage(type, file)
    return null;
  }
};


const contentTypeSuccessMessage = (type, file) => {
  switch (type) {
    case "image":
      message.success(`${file.name} photo uploaded successfully`);
      break;
    case "video":
      message.success(`${file.name} video uploaded successfully`);
      break;
    case "file":
      message.success(`${file.name} file uploaded successfully`);
      break;
    default:
      message.success(`${file.name} upload completed successfully`);
      break;
  }
};

const contentTypeErrorMessage = (type, file) => {
  switch (type) {
    case "image":
      message.error(`${file.name} Error: Please check the image size. The content type must be an image.`);
      break;
    case "video":
      message.error(`${file.name} upload failed. It may be due to the file size. Please try again.`);
      break;
    case "file":
      message.error(`${file.name} file upload failed.`);
      break;
    default:
      message.error(`${file.name} upload failed due to unknown reasons.`); 
      break;
  }
};



