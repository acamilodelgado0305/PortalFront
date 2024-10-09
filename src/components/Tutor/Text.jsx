import { useState, useEffect } from 'react';

function Text() {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center md:w-1/2 h-[10rem] ml-32" style={{ marginTop: isWideScreen ? '-180px' : '0' }}>
      <p className="text-3xl font-bold italic text-purple-500">
        "The energy she brings to each lesson is amazing."
      </p>
      <p className="text-gray-600 font-semibold mt-2">Ismael</p>
      <p className="text-gray-500">English learner on Esturio</p>
    </div>
  );
}

export default Text;
