import React, { useState } from 'react';
import { Form, TimePicker, Button, Switch, message, Card } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = TimePicker;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleStep = ({onChange}) => {
  const [form] = Form.useForm();
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, timeSlots: [{ start: null, end: null }] }
    }), {})
  );

React.useEffect(()=>{
  onChange({ 'Availability': schedule })
},[schedule])

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const addTimeSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: null, end: null }]
      }
    }));
  };

  const removeTimeSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };
  const handleTimeChange = (day, index, [start, end]) => {
  setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) =>
          i === index ? { start, end } : slot
        )
      }
    }));
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Weekly Availability</h2>
      <p className="mb-6 text-gray-600">
        Set your weekly availability for teaching. You can add multiple time slots for each day.
      </p>

      <Form form={form}  layout="vertical">
        {daysOfWeek.map(day => (
          <Card key={day} className="mb-4" title={
            <div className="flex justify-between items-center">
              <span>{day}</span>
              <Switch
                checked={schedule[day].enabled}
                onChange={() => toggleDay(day)}
              />
            </div>
          }>
            {schedule[day].enabled && (
              <>
                {schedule[day].timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <RangePicker
                      format="HH:mm"
                      minuteStep={15}
                      onChange={(time) => handleTimeChange(day, index, time)}
                    />
                    <Button
                      type="text"
                      icon={<MinusOutlined />}
                      onClick={() => removeTimeSlot(day, index)}
                      className="ml-2"
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => addTimeSlot(day)}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Time Slot
                </Button>
              </>
            )}
          </Card>
        ))}

      </Form>
    </div>
  );
};

export default ScheduleStep;