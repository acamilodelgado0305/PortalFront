import React from 'react';
import { Form, Select, Input } from 'antd';

const { Option } = Select;

const StudyPeriod = ({ index, logChange }) => (
  <Form.Item label={<span className="text-lg">Years of study</span>} required>
    <Input.Group  className="gap-2 flex">
      <Form.Item
        name={['education', index, 'study', 'start']}
        noStyle
        rules={[{ required: true, message: 'Start year is required' }]}
      >
        <Select 
          className="w-1/2 text-lg border-2 border-black rounded-md" 
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
          className="w-1/2 text-lg border-2 border-black rounded-md" 
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
);

export default StudyPeriod;
