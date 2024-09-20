import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaTrashAlt,
  FaUserEdit,
  FaSearch,
  FaFilter,
  FaDownload,
  FaWhatsapp

} from "react-icons/fa";
import axios from "axios";
import CreateStudentModal from "./addStudent";
import { getStudents, deleteStudent } from "../../services/studentService";
import { Table, Input, Button, Dropdown, Menu, Modal, message } from "antd";
import { CSVLink } from "react-csv";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    coordinador: null,
    programa: null,
    activo: null,
  });

  useEffect(() => {
    fetchPrograms();
    fetchStudents();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(
        "https://fevaback.app.la-net.co/api/programs"
      );
      setProgramas(res.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      message.error("Error al cargar los programas");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      message.error("Error al cargar los estudiantes");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "¿Está seguro de que desea eliminar este estudiante?",
      content: "Esta acción no se puede deshacer.",
      onOk: async () => {
        try {
          await deleteStudent(id);
          setStudents(students.filter((student) => student.id !== id));
          message.success("Estudiante eliminado con éxito");
        } catch (error) {
          console.error("Error al eliminar el estudiante:", error);
          message.error("Error al eliminar el estudiante");
        }
      },
    });
  };

  const handleStudentAdded = () => {
    fetchStudents();
    message.success("Estudiante añadido con éxito");
  };

  const getCoordinatorStyle = (coordinator) => {
    if (coordinator === "Camilo Delgado") {
      return "text-orange-600";
    } else if (coordinator === "Adriana Benitez") {
      return "text-blue-600";
    }
    return "";
  };

  const getProgramName = (programId) => {
    const program = programas.find((p) => p.id === programId);
    return program ? program.nombre : "Programa no encontrado";
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.numero_cedula.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters =
        (!filters.coordinador || student.coordinador === filters.coordinador) &&
        (!filters.programa || student.programa_id === filters.programa) &&
        (filters.activo === null || student.activo === filters.activo);
      return matchesSearch && matchesFilters;
    });
  }, [students, searchTerm, filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "numero_cedula",
      key: "numero_cedula",
    },
    {
      title: "Coordinador",
      dataIndex: "coordinador",
      key: "coordinador",
      render: (text) => (
        <span className={getCoordinatorStyle(text)}>{text}</span>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      render: (activo) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            activo ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      title: "Programa",
      dataIndex: "programa_id",
      key: "programa_id",
      render: (programId) => getProgramName(programId),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Fecha de Graduación",
      dataIndex: "fecha_graduacion",
      key: "fecha_graduacion",
    },
    {
      title: "Facturas",
      key: "facturas",
      render: (_, record) => (
        <Link
          to={`/inicio/students/facturas/${record.id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          Ver Facturas
        </Link>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<FaTrashAlt />} onClick={() => handleDelete(record.id)} danger />
          <Link to={`/student/edit/${record.id}`}>
            <Button icon={<FaUserEdit />} type="primary" />
          </Link>
          <Button
            icon={<FaWhatsapp />}
            type="default"
            onClick={() => {
              let phoneNumber = record.telefono.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
              
              // Verifica si el número ya tiene el código de país
              if (!phoneNumber.startsWith('57')) {
                phoneNumber = `57${phoneNumber}`; // Agrega el código de país de Colombia
              }
    
              window.open(`https://wa.me/${phoneNumber}`, '_blank');  // Abre WhatsApp con el número formateado
            }}
          >
            WhatsApp
          </Button>
        </div>
      ),
    }
    
  ];

  const filterMenu = (
    <Menu>
      <Menu.SubMenu key="coordinador" title="Coordinador">
        <Menu.Item
          key="coordinador-todos"
          onClick={() => setFilters({ ...filters, coordinador: null })}
        >
          Todos
        </Menu.Item>
        <Menu.Item
          key="coordinador-camilo"
          onClick={() =>
            setFilters({ ...filters, coordinador: "Camilo Delgado" })
          }
        >
          Camilo Delgado
        </Menu.Item>
        <Menu.Item
          key="coordinador-adriana"
          onClick={() =>
            setFilters({ ...filters, coordinador: "Adriana Benitez" })
          }
        >
          Adriana Benitez
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="programa" title="Programa">
        <Menu.Item
          key="programa-todos"
          onClick={() => setFilters({ ...filters, programa: null })}
        >
          Todos
        </Menu.Item>
        {programas.map((programa) => (
          <Menu.Item
            key={`programa-${programa.id}`}
            onClick={() => setFilters({ ...filters, programa: programa.id })}
          >
            {programa.nombre}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="estado" title="Estado">
        <Menu.Item
          key="estado-todos"
          onClick={() => setFilters({ ...filters, activo: null })}
        >
          Todos
        </Menu.Item>
        <Menu.Item
          key="estado-activo"
          onClick={() => setFilters({ ...filters, activo: true })}
        >
          Activo
        </Menu.Item>
        <Menu.Item
          key="estado-inactivo"
          onClick={() => setFilters({ ...filters, activo: false })}
        >
          Inactivo
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <div className="mx-auto mt-8 p-2">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Gestión de Estudiantes</h1>
        <div className="space-x-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            type="primary"
            icon={<FaUserEdit />}
          >
            Crear Estudiante
          </Button>
          <CSVLink
            data={filteredStudents}
            filename={"estudiantes.csv"}
            className="ant-btn ant-btn-primary"
          >
            <FaDownload /> Exportar CSV
          </CSVLink>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Buscar por nombre, apellido o ID"
          prefix={<FaSearch />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Dropdown overlay={filterMenu} trigger={["click"]}>
          <Button icon={<FaFilter />}>Filtrar</Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <CreateStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default Students;
