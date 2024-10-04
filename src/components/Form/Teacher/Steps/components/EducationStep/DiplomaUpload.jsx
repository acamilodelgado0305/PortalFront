import { Button, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';

const DiplomaUpload = ({ index, onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
  });

  return (
    <div className="bg-blue-50 p-4 rounded-md mb-4">
      <h4 className="text-lg font-semibold mb-2">Get a "Diploma verified" badge</h4>
      <p className="mb-2 text-base">
        Upload your diploma to boost your credibility! Our team will review it and add the badge to your profile. Once reviewed, your files will be deleted.
      </p>
      <Form.Item
        name={['education', index, 'diploma']}
        rules={[{ required: false, message: 'Please upload your diploma' }]}
      >
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Button icon={<UploadOutlined />} size="large">Upload Diploma</Button>
        </div>
      </Form.Item>
      <p className="text-base text-gray-600">
        JPG or PNG format; maximum size of 20MB.
      </p>
    </div>
  );
};

export default DiplomaUpload;
