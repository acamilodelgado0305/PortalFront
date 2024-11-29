import { uploadFile } from "../services/utils";

export const uploadImageToS3 = async (formData, setFormData) => {
  if (formData.profileImageUrl) {
    const imageUrl = formData.profileImageUrl;

    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
      const fileName = 'uploaded-image'; 
      const file = convertBase64ToFile(imageUrl, fileName);
      const uploadedImageUrl = await uploadFile(file, file.type);
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        profileImageUrl: uploadedImageUrl.url
      }));
    } 
  }
};
export const uploadImageStudent = async (profileImageUrl) => {
  if (!profileImageUrl) {
    return "carga una imagen para continuar"
     }

    const imageUrl = profileImageUrl;

    if (typeof imageUrl !== 'string' && !imageUrl.startsWith('data:image/')) {
      return " el formato es incorrecto"
    } 
    const fileName = 'uploaded-image'; 
      const file = convertBase64ToFile(imageUrl, fileName);
      const uploadedImageUrl = await uploadFile(file, file.type);
      return uploadedImageUrl;
  
};

  
  export const convertBase64ToFile = (dataUrl, fileName) => {
    const mimeType = dataUrl.match(/data:(.*?);base64/)[1];
  
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const file = new File([blob], `${fileName}.${mimeType.split('/')[1]}`, { type: mimeType });
    
    return file;
  };