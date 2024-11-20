import  { useRef } from "react";
import { uploadFile } from "../../../../services/utils.js";
import { events } from "../../../../enums/whiteboardEvents.js";
import BottomButtonsBar from "./BottomButtonsBar.jsx";

function BottomControlsBar({ whiteBoardSocket, setImageUrl, context }) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFloatButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      event.target.value = null;
      const data = await uploadFile(file, file.type);
      if (whiteBoardSocket) {
        whiteBoardSocket.emit(events.AUDIOFILE_OPENED, {
          name: file.name,
          url: data.url,
          page: "1",
        });
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      event.target.value = null;
      const data = await uploadFile(file, file.type);
      if (whiteBoardSocket) {
        whiteBoardSocket.emit(events.IMAGE_BOARD, {
          name: file.name,
          url: data.url,
          page: "1",
        });
      }
      setImageUrl(data.url);
    }
  };

  return (
    <>
      <BottomButtonsBar
        handleFloatButtonClick={handleFloatButtonClick}
        handleImageButtonClick={handleImageButtonClick}
        goToNextPage={context.goToNextPage}
        goToPreviousPage={context.goToPreviousPage}
      />
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </>
  );
}

export default BottomControlsBar;
