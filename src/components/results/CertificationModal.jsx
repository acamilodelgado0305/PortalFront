import { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function CertificationModal({ isCertificationModalOpen, setIsCertificationModalOpen, teacherCertification }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (teacherCertification) {
      console.log('Good ' + JSON.stringify(teacherCertification.education));
    }
  }, [teacherCertification]);

  if (!isCertificationModalOpen || !teacherCertification) {
    return null;
  }

  const closeModal = () => {
    setIsCertificationModalOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : teacherCertification.education.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < teacherCertification.education.length - 1 ? prevIndex + 1 : 0));
  };

  // Verifica si hay información de educación
  const hasEducation = teacherCertification.education && teacherCertification.education.length > 0;
  const currentEducation = hasEducation ? teacherCertification.education[currentIndex] : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-600 rounded-lg shadow-lg p-6 max-w-md w-full text-white">
        <h2 className="text-2xl font-bold mb-4">Education Details</h2>
        {hasEducation ? (
          <div className="pt-3">
            <p className="text-lg">University: <span className="font-semibold">{currentEducation.university}</span></p>
            <p className="text-lg">Specialization: <span className="font-semibold">{currentEducation.specialization}</span></p>
            <p className="text-lg">Degree Type: <span className="font-semibold">{currentEducation.degree}</span></p>
            <div className="py-3">
              <p className="text-lg">Study Start: <span className="font-semibold">{currentEducation.studyStart}</span></p>
              <p className="text-lg">Study End: <span className="font-semibold">{currentEducation.studyEnd}</span></p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-center mt-4">No education information available.</p>
        )}
        {hasEducation && (
          <div className="flex justify-between items-center mt-4">
            <button onClick={handlePrev} className="text-white cursor-pointer text-[17px] hover:text-gray-300 transition-colors">
              <LeftOutlined />
            </button>
            <button onClick={handleNext} className="text-white cursor-pointer text-[17px] hover:text-gray-300 transition-colors">
              <RightOutlined />
            </button>
          </div>
        )}
        <button
          className="mt-6 bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-800 hover:text-white transition-colors"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CertificationModal;
