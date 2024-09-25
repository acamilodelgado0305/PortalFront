import React, { useState } from 'react';
import { Form, Select, Input, Checkbox, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CertificationStep = () => {
  const [form] = Form.useForm();
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificateNotListed, setCertificateNotListed] = useState(false);

  const handleCertificateUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Teaching certification</h2>
      <p className="mb-4 text-gray-600">
        Do you have teaching certificates? If so, describe them to enhance your profile credibility and get more students.
      </p>

      <Form form={form} layout="vertical">
        <Form.Item>
          <Checkbox
            checked={!hasCertificate}
            onChange={(e) => setHasCertificate(!e.target.checked)}
          >
            I don't have a teaching certificate
          </Checkbox>
        </Form.Item>

        {hasCertificate && (
          <>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please select a subject' }]}
            >
              <Select defaultValue="english">
                <Option value="english">English</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="certification"
              label="Certification"
              rules={[{ required: true, message: 'Please select a certification' }]}
            >
              <Select
                defaultValue="select"
                onChange={(value) => setCertificateNotListed(value === 'not_listed')}
              >
                <Option value="select">Select verified certificate</Option>
                <Option value="not_listed">My certificate is not on the list</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            {certificateNotListed && (
              <Form.Item
                name="customCertificate"
                label="Write the name exactly as it appears on your certificate"
                rules={[{ required: true, message: 'Please enter the certificate name' }]}
              >
                <Input placeholder="Certificate name" />
              </Form.Item>
            )}

            <Form.Item label="Years of study" required>
              <Input.Group compact>
                <Form.Item
                  name={['study', 'start']}
                  noStyle
                  rules={[{ required: true, message: 'Start year is required' }]}
                >
                  <Select style={{ width: '50%' }} placeholder="Select start year">
                    {/* Add year options */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={['study', 'end']}
                  noStyle
                  rules={[{ required: true, message: 'End year is required' }]}
                >
                  <Select style={{ width: '50%' }} placeholder="Select end year">
                    {/* Add year options */}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="certificate"
              label="Upload your certificate"
              rules={[{ required: true, message: 'Please upload your certificate' }]}
            >
              <Upload
                accept=".jpg,.png"
                maxFileSize={20 * 1024 * 1024}
                onChange={handleCertificateUpload}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              <p className="text-sm text-gray-500 mt-2">
                JPG or PNG format; maximum size of 20MB.
              </p>
            </Form.Item>

            <div className="bg-blue-100 p-4 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                Only authentic documents will be accepted. Any false information can result in the disapproval or suspension of your account.
              </p>
            </div>

            <Button type="link" className="p-0 mb-4">
              Add another certificate
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default CertificationStep;