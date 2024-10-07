import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Slider, Card, Typography, Table } from 'antd';

const { Title, Text } = Typography;

const PricingStep = ({ onChange }) => {
  const [form] = Form.useForm();
  const [hourlyRate, setHourlyRate] = useState(20);

  const commissionRates = [
    { minPrice: 0, maxPrice: 30, rate: 0.20 },
    { minPrice: 30, maxPrice: 50, rate: 0.15 },
    { minPrice: 50, maxPrice: 100, rate: 0.10 },
    { minPrice: 100, maxPrice: Infinity, rate: 0.05 },
  ];

  const getCurrentCommission = () => {
    const rate = commissionRates.find(r => hourlyRate >= r.minPrice && hourlyRate < r.maxPrice);
    return {
      rate: rate.rate,
      amount: hourlyRate * rate.rate,
    };
  };

  const [commission, setCommission] = useState(getCurrentCommission());

  useEffect(() => {
    setCommission(getCurrentCommission());
    onChange({
      hourlyRate,
      commissionRate: commission.rate,
      commissionAmount: commission.amount,
    });
  }, [hourlyRate]);

  const commissionColumns = [
    {
      title: 'Hourly Rate (USD)',
      dataIndex: 'range',
      key: 'range',
    },
    {
      title: 'Platform Commission',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => `${rate * 100}%`,
    },
  ];

  const commissionData = commissionRates.map((rate, index) => ({
    key: index,
    range: rate.maxPrice === Infinity ? `$${rate.minPrice}+` : `$${rate.minPrice} - $${rate.maxPrice}`,
    rate: rate.rate,
  }));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Title level={2}>Set Your Hourly Rate</Title>
      <Text className="block mb-6">
        Choose your hourly rate. Remember to consider the platform commission when setting your price.
      </Text>

      <Form form={form} layout="vertical">
        <Form.Item name="hourlyRate" label="Hourly Rate (USD)">
          <InputNumber
            min={1}
            max={200}
            value={hourlyRate}
            onChange={setHourlyRate}
            formatter={(value) => `$ ${value}`}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Slider
          min={1}
          max={200}
          onChange={setHourlyRate}
          value={typeof hourlyRate === 'number' ? hourlyRate : 0}
        />

        <Card className="mt-6 bg-blue-50">
          <Title level={4}>Your Earnings</Title>
          <Text>Hourly Rate: ${hourlyRate}</Text>
          <br />
          <Text>Platform Commission ({(commission.rate * 100).toFixed(0)}%): ${commission.amount.toFixed(2)}</Text>
          <br />
          <Text strong>You Receive: ${(hourlyRate - commission.amount).toFixed(2)}</Text>
        </Card>

        <Title level={3} className="mt-8">Platform Commission Rates</Title>
        <Table columns={commissionColumns} dataSource={commissionData} pagination={false} />
      </Form>
    </div>
  );
};

export default PricingStep;
