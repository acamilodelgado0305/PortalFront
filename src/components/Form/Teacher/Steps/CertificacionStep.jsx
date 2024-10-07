import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Input, Checkbox, Button, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../../../../services/utils.js";

const { Option } = Select;

const CertificationStep = ({ onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificates, setCertificates] = useState([{}]);

  useEffect(() => {
    onChange(certificates);
  }, [certificates, onChange]);

  const addCertificate = () => {
    setCertificates([...certificates, {}]);
  };

  const removeCertificate = (index) => {
    const newCertificates = [...certificates];
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
  };

  const onDrop = useCallback(async (acceptedFiles, index) => {
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
        const uploadedFileUrl = response.url;
        const newCertificates = [...certificates];
        newCertificates[index] = {
          ...newCertificates[index],
          fileUrl: uploadedFileUrl,
          fileName: file.name,
          fileType: file.type
        };
        setCertificates(newCertificates);
        message.success("File uploaded successfully");
        form.setFieldsValue({
          certificates: newCertificates
        });
      } else {
        throw new Error(response.data?.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Unable to upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [certificates, form]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => { }, // This will be overridden for each certificate
    accept: "image/*,application/pdf"
  });

  const handleFieldChange = (index, field, value) => {
    const newCertificates = [...certificates];
    newCertificates[index] = {
      ...newCertificates[index],
      [field]: value
    };
    setCertificates(newCertificates);
  };

  const renderFilePreview = (cert) => {
    if (!cert.fileUrl) return null;

    return (
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
        <div className="flex items-center mb-2">
          <CheckCircleOutlined className="text-green-500 mr-2" />
          <span className="text-green-700 font-semibold">File uploaded successfully</span>
        </div>
        {cert.fileType?.startsWith('image/') ? (
          <img src={cert.fileUrl} alt="Certificate preview" className="max-w-full max-h-48 object-contain" />
        ) : cert.fileType === 'application/pdf' ? (
          <div>
            <p className="mb-2">PDF uploaded: {cert.fileName}</p>
            <object
              data={cert.fileUrl}
              type="application/pdf"
              width="100%"
              height="200px"
            >
              <p>Unable to display PDF. <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download PDF</a></p>
            </object>
          </div>
        ) : (
          <p>File uploaded: {cert.fileName}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Teaching Certification</h2>
      <p className="mb-6 text-xl text-gray-600 text-center">
        Do you have teaching certificates? If so, describe them to enhance your profile credibility and get more students.
      </p>

      <Form form={form} layout="vertical">
        <Form.Item className="mb-8">
          <Checkbox
            className="text-xl"
            checked={!hasCertificate}
            onChange={(e) => setHasCertificate(!e.target.checked)}
          >
            I don't have a teaching certificate
          </Checkbox>
        </Form.Item>


        {hasCertificate && (
          <>
            {certificates.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Certificate {index + 1}</h3>
                <Form.Item
                  name={['certificates', index, 'subject']}
                  label={<span className="text-lg">Subject</span>}
                  rules={[{ required: true, message: 'Please select a subject' }]}
                >
                  <Select
                    className="text-lg"
                    size="large"
                    onChange={(value) => handleFieldChange(index, 'subject', value)}
                  >
                    <Option value="english">English</Option>
                    <Option value="math">Mathematics</Option>
                    <Option value="science">Science</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name={['certificates', index, 'certification']}
                  label={<span className="text-lg">Certification</span>}
                  rules={[{ required: true, message: 'Please select a certification' }]}
                >
                  <Select
                    className="text-lg"
                    size="large"
                    onChange={(value) => {
                      handleFieldChange(index, 'certification', value);
                      handleFieldChange(index, 'certificateNotListed', value === 'not_listed');
                    }}
                  >
                    <Option value="select">Select verified certificate</Option>
                    <Option value="not_listed">My certificate is not on the list</Option>
                    <Option value="tefl">TEFL</Option>
                    <Option value="celta">CELTA</Option>
                  </Select>
                </Form.Item>

                {cert.certificateNotListed && (
                  <Form.Item
                    name={['certificates', index, 'customCertificate']}
                    label={<span className="text-lg">Certificate Name</span>}
                    rules={[{ required: true, message: 'Please enter the certificate name' }]}
                  >
                    <Input
                      className="text-lg p-3"
                      placeholder="Write the name exactly as it appears on your certificate"
                      onChange={(e) => handleFieldChange(index, 'customCertificate', e.target.value)}
                    />
                  </Form.Item>
                )}

                <Form.Item label={<span className="text-lg">Years of study</span>} required>
                  <Input.Group compact>
                    <Form.Item
                      name={['certificates', index, 'studyStart']}
                      noStyle
                      rules={[{ required: true, message: 'Start year is required' }]}
                    >
                      <Select
                        className="w-1/2 text-lg"
                        size="large"
                        placeholder="Start year"
                        onChange={(value) => handleFieldChange(index, 'studyStart', value)}
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <Option key={i} value={2024 - i}>{2024 - i}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={['certificates', index, 'studyEnd']}
                      noStyle
                      rules={[{ required: true, message: 'End year is required' }]}
                    >
                      <Select
                        className="w-1/2 text-lg"
                        size="large"
                        placeholder="End year"
                        onChange={(value) => handleFieldChange(index, 'studyEnd', value)}
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <Option key={i} value={2024 - i}>{2024 - i}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name={['certificates', index, 'fileUrl']}
                  label={<span className="text-lg">Upload your certificate</span>}
                  rules={[{ required: true, message: 'Please upload your certificate' }]}
                >
                  <div {...getRootProps({ onClick: (event) => event.preventDefault() })}>
                    <input {...getInputProps()} />
                    <Button
                      className="bg-[#FFFF45] text-black px-4 py-2 rounded-md hover:bg-pink-600"
                      disabled={uploading}
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*,application/pdf';
                        fileInput.onchange = (e) => onDrop(e.target.files, index);
                        fileInput.click();
                      }}
                    >
                      {uploading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                  {renderFilePreview(cert)}
                </Form.Item>

                {index > 0 && (
                  <Button type="link" onClick={() => removeCertificate(index)} className="text-red-500 text-lg p-0">
                    Remove this certificate
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="dashed"
              onClick={addCertificate}
              className="w-full text-lg h-12 mb-6"
              icon={<PlusOutlined />}
            >
              Add Another Certificate
            </Button>

            <div className="bg-blue-100 p-4 rounded-md mb-6">
              <p className="text-lg text-blue-800">
                Only authentic documents will be accepted. Any false information can result in the disapproval or suspension of your account.
              </p>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};


export default CertificationStep