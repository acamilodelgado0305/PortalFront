import { useState } from "react";

const ShowMoreText = ({ text ,maxLength = 40 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if(!text) {
    return
  }

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? text : `${text.substring(0, maxLength)}... `}
      <button
        onClick={handleToggle}
        className="text-[#8f34ea] underline"
      >
        {isExpanded ?(<p className="px-1">  See Less  </p>) : (<p className="px-1">  View More  </p>)}
      </button>
    </>
  );
};

export default ShowMoreText;
