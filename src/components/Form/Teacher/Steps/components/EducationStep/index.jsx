import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useDropzone } from "react-dropzone";
import { uploadForm } from '../../../../../../services/utils';
import { fileUpload } from '../../../../../../helpers/fileUpload';
import DiplomaUpload from './DiplomaUpload';
import StudyPeriod from './StudyPeriod';

const { Option } = Select;

const EducationForm = (props) => {
  const { index, onRemove, list, setList, onChange } = props;
  const [currentValue, setCurrentValue] = useState(null);

  const onDrop = async (acceptedFiles) => {
      const response = await fileUpload(acceptedFiles);
      logChange('diplomaFile', response, index);
  };

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

  const updateChange = async (list) => {
    await onChange({'education': list});
  };

  useEffect(() => {
    if (list.length > 0) 
        updateChange(list);
  }, [list, currentValue]);

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

      <StudyPeriod index={index} logChange={logChange} />

      <DiplomaUpload 
        index={index} 
        onDrop={onDrop} 
        logChange={logChange} 
      />

      {index > 0 && (
        <Button type="link" onClick={() => onRemove(index)} className="text-red-500 text-lg p-0">
          Remove this education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
