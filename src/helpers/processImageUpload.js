export const processImageUpload = async (formData, uploadImage, setFormData) => {
    //svg a s3 service
    if (formData.profileImageUrl) {
      const imageUrl = formData.profileImageUrl;
  
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
     
        const mimeType = imageUrl.match(/data:(.*?);base64/)[1];
  
        const byteString = atob(imageUrl.split(',')[1]);
        const arrayBuffer = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const file = new File([blob], `profile-image.${mimeType.split('/')[1]}`, { type: mimeType });
  
        const uploadedImageUrl = await uploadImage(file, mimeType);
        console.log('Se modifico la url a '+uploadedImageUrl)
        setFormData((prevFormData) => ({
          ...prevFormData,
          profileImageUrl: uploadedImageUrl
        }));
      } 
    } 
  };