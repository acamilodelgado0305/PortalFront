import React, { useState, useEffect } from "react";
import { getPrograms } from "../../services/studentService";
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const CreateStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [form] = Form.useForm();
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        const data = await getPrograms();
        setProgramas(data);
      } catch (err) {
        console.error("Error fetching Programs:", err);
        message.error("Error al cargar los programas");
      }
    };

    fetchProgramsData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    const apiUrl = "https://fevaback.app.la-net.co/api/students";
    try {
      const formattedValues = {
        ...values,
        fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
        fechaGraduacion: values.fechaGraduacion.format('YYYY-MM-DD'),
        programaId: parseInt(values.programaId, 10),
        ultimoCursoVisto: parseInt(values.ultimoCursoVisto, 10),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        message.success("Estudiante creado exitosamente");
        onStudentAdded();
        onClose();
        form.resetFields();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar el estudiante:", error);
      message.error("Hubo un error al crear el estudiante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Crear Nuevo Estudiante"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          modalidadEstudio: "Clases en Linea",
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre" />
          </Form.Item>

          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Apellido" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor ingrese el email' },
              { type: 'email', message: 'Por favor ingrese un email válido' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Teléfono" />
          </Form.Item>

          <Form.Item
            name="fechaNacimiento"
            label="Fecha de Nacimiento"
            rules={[{ required: true, message: 'Por favor seleccione la fecha de nacimiento' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="programaId"
            label="Programa"
            rules={[{ required: true, message: 'Por favor seleccione un programa' }]}
          >
            <Select placeholder="Seleccione un programa">
              {programas.map((programa) => (
                <Option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="coordinador"
            label="Coordinador"
            rules={[{ required: true, message: 'Por favor seleccione un coordinador' }]}
          >
            <Select placeholder="Seleccione un coordinador">
              <Option value="Adriana Benitez">Adriana Benitez</Option>
              <Option value="Camilo Delgado">Camilo Delgado</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ultimoCursoVisto"
            label="Último Curso Visto"
            rules={[{ required: true, message: 'Por favor seleccione el último curso visto' }]}
          >
            <Select placeholder="Seleccione el último curso visto">
              {[5, 6, 7, 8, 9, 10, 11].map((curso) => (
                <Option key={curso} value={curso}>
                  {curso}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="numeroCedula"
            label="Número de Cédula"
            rules={[{ required: true, message: 'Por favor ingrese el número de cédula' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Número de Cédula" />
          </Form.Item>

          <Form.Item
            name="modalidadEstudio"
            label="Modalidad de Estudio"
            rules={[{ required: true, message: 'Por favor seleccione la modalidad de estudio' }]}
          >
            <Select>
              <Option value="Clases en Linea">Clases en Línea</Option>
              <Option value="Modulos por WhatsApp">Módulos por WhatsApp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fechaGraduacion"
            label="Fecha de Graduación"
            rules={[{ required: true, message: 'Por favor seleccione la fecha de graduación' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end">
          <Button type="default" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar Estudiante
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStudentModal;