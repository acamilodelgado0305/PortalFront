import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox, Upload, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadForm } from '../../../../services/utils';
import { useDropzone } from "react-dropzone";
const { Option } = Select;

const EducationForm = (props) => {
  const { index, onRemove, list, setList, onChange } = props

  const onDrop  = async(acceptedFiles) => {
    const file  = acceptedFiles[0];
    const contentType = file.type; 
    try {
    const response = await uploadForm(file, contentType);
    logChange('diplomaFile', response ,index)
    message.success(`${file.name} file uploaded successfully`);
     } catch {
      message.error(`${file.name} file upload failed.`);
    }
  };
  const [currentValue, setCurrentValue] = useState(null); 
  
  const logChange = (field, value, index) => {
    setCurrentValue(value); 
    setList((prevEducations) => {
      const updatedEducations = [...prevEducations];
      updatedEducations[index] = {
        ...updatedEducations[index],
        [field]: value,
      };
      return updatedEducations;
    });
  };
  
   const updateChange = async(list) => {
   await onChange({'education': list})
  } 

  useEffect(() => {
    if (list.length > 0) {
        updateChange(list)
  
    }
  }, [list, currentValue]); 
  



  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [], // Acepta imágenes
      'application/pdf': [], // Acepta PDF
    },
  });

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Education {index + 1}</h3>

      <Form.Item
        name={['education', index, 'university']}
        label={<span className="text-lg">University</span>}
        rules={[{ required: true, message: 'Please enter your university' }]}
      >
        <Input 
          className="text-lg p-3" 
          placeholder="E.g. Mount Royal University" 
          onInput={(e) => logChange('university', e.target.value, index)}
        />
      </Form.Item>

      <Form.Item
        name={['education', index, 'degree']}
        label={<span className="text-lg">Degree</span>}
        rules={[{ required: true, message: 'Please enter your degree' }]}
      >
        <Input 
          className="text-lg p-3" 
          placeholder="E.g. Bachelor's degree in the English Language" 
          onInput={(e) => logChange('degree', e.target.value, index)} 
        />
      </Form.Item>

      <Form.Item
        name={['education', index, 'degreeType']}
        label={<span className="text-lg">Degree type</span>}
        rules={[{ required: true, message: 'Please select your degree type' }]}
      >
        <Select 
          className="text-lg" 
          size="large" 
          placeholder="Choose degree type..." 
          onChange={(value) => logChange('degreeType', value, index)}
        >
          <Option value="bachelor">Bachelor's</Option>
          <Option value="master">Master's</Option>
          <Option value="phd">PhD</Option>
          <Option value="associate">Associate's</Option>
          <Option value="diploma">Diploma</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={['education', index, 'specialization']}
        label={<span className="text-lg">Specialization</span>}
        rules={[{ required: true, message: 'Please enter your specialization' }]}
      >
        <Input 
          className="text-lg p-3" 
          placeholder="E.g. Teaching English as a Foreign Language" 
          onInput={(e) => logChange('specialization', e.target.value, index)} 
        />
      </Form.Item>

      <Form.Item label={<span className="text-lg">Years of study</span>} required>
        <Input.Group compact>
          <Form.Item
            name={['education', index, 'study', 'start']}
            noStyle
            rules={[{ required: true, message: 'Start year is required' }]}
          >
            <Select 
              className="w-1/2 text-lg" 
              size="large" 
              placeholder="Start year" 
              onSelect={(value) => logChange('studyStart', value, index)}
            >
              {Array.from({ length: 50 }, (_, i) => (
                <Option key={i} value={2024 - i}>{2024 - i}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={['education', index, 'study', 'end']}
            noStyle
            rules={[{ required: true, message: 'End year is required' }]}
          >
            <Select 
              className="w-1/2 text-lg" 
              size="large" 
              placeholder="End year" 
              onSelect={(value) => logChange('studyEnd', value, index)}
            >
              {Array.from({ length: 50 }, (_, i) => (
                <Option key={i} value={2024 - i}>{2024 - i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>

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

      {index > 0 && (
        <Button type="link" onClick={() => onRemove(index)} className="text-red-500 text-lg p-0">
          Remove this education
        </Button>
      )}
    </div>
  );
};

const EducationStep = ({onChange}) => {
  const [form] = Form.useForm();
  const [hasHigherEducation, setHasHigherEducation] = useState(true);
  const [list, setList] = useState([{}]);

  const addEducation = () => {
    setList([... list, {}]);
  };

  const removeEducation = (index) => {
       const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setHasHigherEducation(!isChecked);

    if (isChecked) {      
        setList([{}])
        onChange({'education':'emply'})
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Education</h2>
      <p className="mb-6 text-xl text-gray-600 text-center">
        Tell students more about the higher education that you've completed or are working on
      </p>

      <Form form={form} layout="vertical">
        <Form.Item className="mb-8">
          <Checkbox
            className="text-xl"
            checked={!hasHigherEducation}
            onChange={handleCheckboxChange}
          >
            I don't have a higher education degree
          </Checkbox>
        </Form.Item>

        {hasHigherEducation && (
          <>
            { list.map((_, index) => (
              <EducationForm key={index} index={index} onRemove={removeEducation}  list={list} 
              setList={setList} onChange={onChange}/>
            ))}

            <Button 
              type="dashed" 
              onClick={addEducation} 
              className="w-full text-lg h-12 mb-6"
              icon={<PlusOutlined />}
            >
              Add Another Education
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default EducationStep;