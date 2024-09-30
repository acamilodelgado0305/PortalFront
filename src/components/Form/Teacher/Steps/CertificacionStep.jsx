import React, { useState } from 'react';
import { Form, Select, Input, Checkbox, Upload, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CertificateForm = ({ index, onRemove }) => {
  const [certificateNotListed, setCertificateNotListed] = useState(false);

  const handleCertificateUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Certificate {index + 1}</h3>
      <Form.Item
        name={['certificates', index, 'subject']}
        label={<span className="text-lg">Subject</span>}
        rules={[{ required: true, message: 'Please select a subject' }]}
      >
        <Select className="text-lg" size="large">
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
          onChange={(value) => setCertificateNotListed(value === 'not_listed')}
        >
          <Option value="select">Select verified certificate</Option>
          <Option value="not_listed">My certificate is not on the list</Option>
          <Option value="tefl">TEFL</Option>
          <Option value="celta">CELTA</Option>
        </Select>
      </Form.Item>

      {certificateNotListed && (
        <Form.Item
          name={['certificates', index, 'customCertificate']}
          label={<span className="text-lg">Certificate Name</span>}
          rules={[{ required: true, message: 'Please enter the certificate name' }]}
        >
          <Input className="text-lg p-3" placeholder="Write the name exactly as it appears on your certificate" />
        </Form.Item>
      )}

      <Form.Item label={<span className="text-lg">Years of study</span>} required>
        <Input.Group compact>
          <Form.Item
            name={['certificates', index, 'study', 'start']}
            noStyle
            rules={[{ required: true, message: 'Start year is required' }]}
          >
            <Select className="w-1/2 text-lg" size="large" placeholder="Start year">
              {Array.from({ length: 50 }, (_, i) => (
                <Option key={i} value={2024 - i}>{2024 - i}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={['certificates', index, 'study', 'end']}
            noStyle
            rules={[{ required: true, message: 'End year is required' }]}
          >
            <Select className="w-1/2 text-lg" size="large" placeholder="End year">
              {Array.from({ length: 50 }, (_, i) => (
                <Option key={i} value={2024 - i}>{2024 - i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        name={['certificates', index, 'certificate']}
        label={<span className="text-lg">Upload your certificate</span>}
        rules={[{ required: true, message: 'Please upload your certificate' }]}
      >
        <Upload
          accept=".jpg,.png"
          maxFileSize={20 * 1024 * 1024}
          onChange={handleCertificateUpload}
        >
          <Button icon={<UploadOutlined />} size="large">Upload Certificate</Button>
        </Upload>
        <p className="text-base text-gray-500 mt-2">
          JPG or PNG format; maximum size of 20MB.
        </p>
      </Form.Item>

      {index > 0 && (
        <Button type="link" onClick={() => onRemove(index)} className="text-red-500 text-lg p-0">
          Remove this certificate
        </Button>
      )}
    </div>
  );
};

const CertificationStep = () => {
  const [form] = Form.useForm();
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificates, setCertificates] = useState([{}]);

  const addCertificate = () => {
    setCertificates([...certificates, {}]);
  };

  const removeCertificate = (index) => {
    const newCertificates = [...certificates];
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
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
            {certificates.map((_, index) => (
              <CertificateForm key={index} index={index} onRemove={removeCertificate} />
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

export default CertificationStep;