import { useEffect, useState } from "react";
import { Form, Button, Steps as AntSteps, Card, Modal, message } from "antd";
import { CheckCircle, Circle } from 'lucide-react';
import AboutStep from "./Steps/AboutStep";
import PhotoStep from "./Steps/PhotoStep";
import CertificationStep from "./Steps/CertificacionStep";
import EducationStep from "./Steps/EducationStep";
import DescriptionSet from "./Steps/DescriptionStep";
import VideoStep from "./Steps/VideoStep";
import ScheduleStep from "./Steps/ScheduleStep";
import PricingStep from "./Steps/PricingStep";
import { createTeacher } from '../../../services/teacher.services';
import { uploadImageToS3 } from "../../../helpers/processImageUpload";
import ModalRegisterTeacher from "../../auth/ModalRegisterTeacher";
import Header from "../../results/Header";

const { Step } = AntSteps;

const MultiStepForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [inicioSesion, setInicioSesion] = useState(null);

  const handleFormChange = (changedValues) => {
    setFormData((prevData) => ({ ...prevData, ...changedValues }));
  };

  const stepTitles = [
    "About", "Photo", "Certification", "Education",
    "Description", "Video", "Availability", "Pricing",
  ];

  const onFinish = () => {
    if (currentStep === 7) {
      handleRegisterSuccess();
    }
  };

  const handleRegisterSuccess = async () => {
    setShowRegisterModal(false);
    setIsSubmitting(true);
    try {
      // Crear al profesor con los datos del formulario
      const teacherData = await createTeacher(formData);
      // Guardar el ID del profesor y pasarlo a la modal de registro
      setSelectedTeacher(teacherData.teacher);  // Guardar solo el ID del profesor

      // Mostrar la modal de registro con el teacherId
      setShowRegisterModal(true);
    } catch (error) {
      console.error("Teacher registration failed:", error);
      message.error("Failed to complete teacher registration");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleModalOk = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStep(0);
    setFormData({});
  };

  const next = async () => {
    if (isVerified) {
      try {
        await form.validateFields();
        if (currentStep === 2) {
          await uploadImageToS3(formData, setFormData);
        }
        setCurrentStep(currentStep + 1);
        setIsVerified(false);
        setErrorMessage("");
      } catch (error) {
        console.error("Validation failed:", error);
      }
    } else {
      setErrorMessage("Please ensure all required fields are complete.");
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
    setIsVerified(false);
  };

  const getCurrentStepContent = () => {
    const steps = {
      0: <AboutStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      1: <PhotoStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      2: <CertificationStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      3: <EducationStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      4: <DescriptionSet onChange={handleFormChange} setIsVerified={setIsVerified} />,
      5: <VideoStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      6: <ScheduleStep onChange={handleFormChange} setIsVerified={setIsVerified} />,
      7: <PricingStep onChange={handleFormChange} />
    };
    return steps[currentStep] || null;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="p-6 bg-gradient-to-r from-[#504b85] to-cyan-500 shadow-lg mb-2 hidden sm:block">
        <AntSteps current={currentStep} className="custom-steps">
          {stepTitles.map((title, index) => (
            <Step
              key={title}
              title={<span className="text-white font-medium">{title}</span>}
              icon={
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-[#8c8c27]' : 'bg-gray-300'}
                  transition-all duration-300 ease-in-out
                `}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-white" />
                  )}
                </div>
              }
            />
          ))}
        </AntSteps>
      </div>

      <div className="max-w-[50em] mx-auto px-4">
        <Card
          title={<h2 className="text-2xl font-bold text-gray-800">{stepTitles[currentStep]}</h2>}
          className="shadow-xl rounded-lg bg-white mb-8"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            {getCurrentStepContent()}
            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button
                  onClick={prev}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition duration-300"
                >
                  Previous
                </Button>
              )}
              {errorMessage && currentStep !== 0 && errorMessage}
              {currentStep < stepTitles.length - 1 && (
                <Button
                  onClick={next}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300"
                >
                  Next
                </Button>
              )}
              {errorMessage && currentStep === 0 && errorMessage}
              {currentStep === stepTitles.length - 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition duration-300"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>

      <ModalRegisterTeacher
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        selectedTeacher={selectedTeacher}  // Pasar el ID del profesor aquí
        setInicioSesion={setInicioSesion}
      />

      <Modal
        title={<h3 className="text-xl font-bold text-green-600">Registration Successful</h3>}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button
            key="ok"
            onClick={handleModalOk}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
          >
            OK
          </Button>,
        ]}
      >
        <p className="text-gray-700">Your registration was successful. Thank you for signing up!</p>
      </Modal>
    </div>
  );
};

export default MultiStepForm;