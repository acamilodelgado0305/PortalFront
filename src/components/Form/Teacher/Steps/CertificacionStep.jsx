import React, { useState, useEffect, useCallback } from "react";
import { Form, Select, Input, Checkbox, Button, message } from "antd";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../../../../services/utils.js";

const { Option } = Select;

const CertificationStep = ({ onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificates, setCertificates] = useState([{}]);

  useEffect(() => {
    onChange({ certifications: certificates });
  }, [certificates, onChange]);

  const addCertificate = () => {
    setCertificates([...certificates, {}]);
  };

  const removeCertificate = (index) => {
    const newCertificates = [...certificates];
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
  };

  const onDrop = useCallback(
    async (acceptedFiles, index) => {
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
            fileType: file.type,
          };
          setCertificates(newCertificates);
          message.success("File uploaded successfully");
          form.setFieldsValue({
            certificates: newCertificates,
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
    },
    [certificates, form],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {}, // This will be overridden for each certificate
    accept: "image/*,application/pdf",
  });

  const handleFieldChange = (index, field, value) => {
    const newCertificates = [...certificates];
    newCertificates[index] = {
      ...newCertificates[index],
      [field]: value,
    };
    setCertificates(newCertificates);
  };

  const renderFilePreview = (cert) => {
    if (!cert.fileUrl) return null;

    return (
      <div className="mt-4 rounded-md border border-green-300 bg-green-100 p-4">
        <div className="mb-2 flex items-center">
          <CheckCircleOutlined className="mr-2 text-green-500" />
          <span className="font-semibold text-green-700">
            File uploaded successfully
          </span>
        </div>
        {cert.fileType?.startsWith("image/") ? (
          <img
            src={cert.fileUrl}
            alt="Certificate preview"
            className="max-h-48 max-w-full object-contain"
          />
        ) : cert.fileType === "application/pdf" ? (
          <div>
            <p className="mb-2">PDF uploaded: {cert.fileName}</p>
            <object
              data={cert.fileUrl}
              type="application/pdf"
              width="100%"
              height="200px"
            >
              <p>
                Unable to display PDF.{" "}
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download PDF
                </a>
              </p>
            </object>
          </div>
        ) : (
          <p>File uploaded: {cert.fileName}</p>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Teaching Certification
      </h2>
      <p className="mb-6 text-center text-xl text-gray-600">
        Do you have teaching certificates? If so, describe them to enhance your
        profile credibility and get more students.
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
              <div key={index} className="mb-6 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-xl font-semibold">
                  Certificate {index + 1}
                </h3>
                <Form.Item
                  name={["certificates", index, "subject"]}
                  label={<span className="text-lg">Subject</span>}
                  rules={[
                    { required: true, message: "Please select a subject" },
                  ]}
                >
                  <Select
                    className="text-lg"
                    size="large"
                    onChange={(value) =>
                      handleFieldChange(index, "subject", value)
                    }
                  >
                    <Option value="english">English</Option>
                    <Option value="math">Mathematics</Option>
                    <Option value="science">Science</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name={["certificates", index, "certification"]}
                  label={<span className="text-lg">Certification</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please select a certification",
                    },
                  ]}
                >
                  <Select
                    className="text-lg"
                    size="large"
                    onChange={(value) => {
                      handleFieldChange(index, "certification", value);
                      handleFieldChange(
                        index,
                        "certificateNotListed",
                        value === "not_listed",
                      );
                    }}
                  >
                    <Option value="select">Select verified certificate</Option>
                    <Option value="not_listed">
                      My certificate is not on the list
                    </Option>
                    <Option value="tefl">TEFL</Option>
                    <Option value="celta">CELTA</Option>
                  </Select>
                </Form.Item>

                {cert.certificateNotListed && (
                  <Form.Item
                    name={["certificates", index, "customCertificate"]}
                    label={<span className="text-lg">Certificate Name</span>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the certificate name",
                      },
                    ]}
                  >
                    <Input
                      className="p-3 text-lg"
                      placeholder="Write the name exactly as it appears on your certificate"
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "customCertificate",
                          e.target.value,
                        )
                      }
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label={<span className="text-lg">Years of study</span>}
                  required
                >
                  <Input.Group compact>
                    <Form.Item
                      name={["certificates", index, "studyStart"]}
                      noStyle
                      rules={[
                        { required: true, message: "Start year is required" },
                      ]}
                    >
                      <Select
                        className="w-1/2 text-lg"
                        size="large"
                        placeholder="Start year"
                        onChange={(value) =>
                          handleFieldChange(index, "studyStart", value)
                        }
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <Option key={i} value={2024 - i}>
                            {2024 - i}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={["certificates", index, "studyEnd"]}
                      noStyle
                      rules={[
                        { required: true, message: "End year is required" },
                      ]}
                    >
                      <Select
                        className="w-1/2 text-lg"
                        size="large"
                        placeholder="End year"
                        onChange={(value) =>
                          handleFieldChange(index, "studyEnd", value)
                        }
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <Option key={i} value={2024 - i}>
                            {2024 - i}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name={["certificates", index, "fileUrl"]}
                  label={
                    <span className="text-lg">Upload your certificate</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please upload your certificate",
                    },
                  ]}
                >
                  <div>
                    <input
                      {...getInputProps({
                        onClick: (event) => event.stopPropagation(),
                        onChange: (e) => onDrop(e.target.files, index),
                      })}
                      style={{ display: "none" }} 
                    />
                    <Button
                      className="rounded-md bg-[#FFFF45] px-4 py-2 text-black hover:bg-pink-600"
                      disabled={uploading}
                      onClick={() => {
                        const fileInput =
                          document.querySelector('input[type="file"]');
                        fileInput.click();
                      }}
                    >
                      {uploading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                  {renderFilePreview(cert)}
                </Form.Item>

                {index > 0 && (
                  <Button
                    type="link"
                    onClick={() => removeCertificate(index)}
                    className="p-0 text-lg text-red-500"
                  >
                    Remove this certificate
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="dashed"
              onClick={addCertificate}
              className="mb-6 h-12 w-full text-lg"
              icon={<PlusOutlined />}
            >
              Add Another Certificate
            </Button>

            <div className="mb-6 rounded-md bg-blue-100 p-4">
              <p className="text-lg text-blue-800">
                Only authentic documents will be accepted. Any false information
                can result in the disapproval or suspension of your account.
              </p>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default CertificationStep;
