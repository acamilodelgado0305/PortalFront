import { Button, Form } from 'antd';
import { UploadOutlined, CloseOutlined, LoadingOutlined   } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';

const DiplomaUpload = ({ index, onDrop, fileName, removeDiploma, loadingPDF }) => {
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
           <Button icon={loadingPDF? <LoadingOutlined/> :<UploadOutlined />} size="large">{loadingPDF?'loading..' :'Upload Diploma'}</Button>
        </div>
        {fileName && (
          <>
          <p className="mt-2">Uploaded file:</p>
          <br /> 
          <p className='text-md text-green-500 '>{fileName}
          <CloseOutlined
              onClick={()=> removeDiploma(index)}
              className="text-red-500 cursor-pointer"
              style={{ fontSize: '18px', paddingLeft:'15px', color:'green' }} 
            /></p>
        </>
         )}
      </Form.Item>
      <p className="text-base text-gray-600">
        JPG or PNG format; maximum size of 20MB.
      </p>
    </div>
  );
};

export default DiplomaUpload;
