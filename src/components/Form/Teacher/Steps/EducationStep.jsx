import React, { useState } from 'react';
import { Form, Input, Select, Checkbox, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const EducationStep = () => {
  const [form] = Form.useForm();
  const [hasHigherEducation, setHasHigherEducation] = useState(true);

  const handleDiplomaUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Education</h2>
      <p className="mb-4 text-gray-600">
        Tell students more about the higher education that you've completed or are working on
      </p>

      <Form form={form} layout="vertical">
        <Form.Item>
          <Checkbox
            checked={!hasHigherEducation}
            onChange={(e) => setHasHigherEducation(!e.target.checked)}
          >
            I don't have a higher education degree
          </Checkbox>
        </Form.Item>

        {hasHigherEducation && (
          <>
            <Form.Item
              name="university"
              label="University"
              rules={[{ required: true, message: 'Please enter your university' }]}
            >
              <Input placeholder="E.g. Mount Royal University" />
            </Form.Item>

            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: 'Please enter your degree' }]}
            >
              <Input placeholder="E.g. Bachelor's degree in the English Language" />
            </Form.Item>

            <Form.Item
              name="degreeType"
              label="Degree type"
              rules={[{ required: true, message: 'Please select your degree type' }]}
            >
              <Select placeholder="Choose degree type...">
                <Option value="bachelor">Bachelor's</Option>
                <Option value="master">Master's</Option>
                <Option value="phd">PhD</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>

            <Form.Item
              name="specialization"
              label="Specialization"
              rules={[{ required: true, message: 'Please enter your specialization' }]}
            >
              <Input placeholder="E.g. Teaching English as a Foreign Language" />
            </Form.Item>

            <Form.Item label="Years of study" required>
              <Input.Group compact>
                <Form.Item
                  name={['study', 'start']}
                  noStyle
                  rules={[{ required: true, message: 'Start year is required' }]}
                >
                  <Select style={{ width: '50%' }} placeholder="Select">
                    {/* Add year options */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={['study', 'end']}
                  noStyle
                  rules={[{ required: true, message: 'End year is required' }]}
                >
                  <Select style={{ width: '50%' }} placeholder="Select">
                    {/* Add year options */}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <h3 className="font-bold mb-2">Get a "Diploma verified" badge</h3>
              <p className="mb-2">
                Upload your diploma to boost your credibility! Our team will review it and add the badge to your profile. Once reviewed, your files will be deleted.
              </p>
              <Form.Item
                name="diploma"
                rules={[{ required: false, message: 'Please upload your diploma' }]}
              >
                <Upload
                  accept=".jpg,.png"
                  maxFileSize={20 * 1024 * 1024}
                  onChange={handleDiplomaUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <p className="text-sm text-gray-500">
                JPG or PNG format; maximum size of 20MB.
              </p>
            </div>

            <Button type="link" className="p-0 mb-4">
              Add another education
            </Button>
          </>
        )}

        
      </Form>
    </div>
  );
};

export default EducationStep;