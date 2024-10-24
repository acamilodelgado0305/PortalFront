import React, { useState } from 'react';
import { Form, Checkbox, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EducationForm from './components/EducationStep/index'; 

const EducationStep = ({ onChange, setIsVerified }) => {
  const [form] = Form.useForm();
  const [hasHigherEducation, setHasHigherEducation] = useState(true);
  const [list, setList] = useState([{}]);

  const addEducation = () => {
    setList([...list, {}]);
  };

  const removeEducation = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setHasHigherEducation(!isChecked);
    setIsVerified(isChecked);
    if (isChecked) {
      setList([{}]);
      onChange({ 'education': 'empty' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Education</h2>
      <p className="mb-6 text-xl text-gray-600 text-center">
        Tell students more about the higher education that you've completed or are working on.
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
            {list.map((_, index) => (
              <EducationForm
                key={index}
                index={index}
                onRemove={removeEducation}
                list={list}
                setList={setList}
                onChange={onChange}
                setIsVerified={setIsVerified}
              />
            ))}

            <Button
              type="dashed"
              size="large"
              icon={<PlusOutlined />}
              onClick={addEducation}
              block
              className="text-xl p-4"
            >
              Add another education
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default EducationStep;
