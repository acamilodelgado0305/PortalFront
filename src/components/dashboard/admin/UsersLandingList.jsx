import React, { useEffect, useState } from "react";
import { Table, Button, Input, Menu, Dropdown, DatePicker } from "antd";
import { getAllUsersLanding } from "../../../services/studendent.services";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { SlidersHorizontal, Circle, Triangle } from "lucide-react";
import isBetween from "dayjs/plugin/isBetween";
import { styled } from "@mui/material";
dayjs.extend(isBetween);



const DEFAULT_DATE = dayjs("2025-01-25T00:00:00Z");

function UsersLandingList() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [visible, setVisible] = useState(false);
    const [showFilters, setShowFilters] = useState(false)


    const handleDateRangeChange = (date, dateString, picker) => {
        if (picker === "start") {
            setStartDate(dayjs(dateString, "DD/MM/YYYY").startOf("day"));
        } else if (picker === "end") {
            setEndDate(dayjs(dateString, "DD/MM/YYYY").endOf("day"));
            setSelectedMonth(null)
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            setVisible(false);
            const filteredUsers = allUsers.filter((user) => {
                const userDate = dayjs(user.createdAt, "DD/MM/YYYY");
                return userDate.isBetween(startDate, endDate, "day", "[]");
            });
            setUsers(filteredUsers);
        }
    }, [startDate, endDate]);

    const handleVisibleChange = (visible) => {
        if (endDate) {
            setVisible(false); // Ocultar dropdown si endDate tiene un valor
        } else {
            setVisible(visible); // Mantener dropdown visible si endDate es null
        }
    };

    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleApplyFilters = () => {
        // Aquí aplicas el filtro con el startDate y endDate
        console.log("Fechas seleccionadas:", startDate, endDate);
        setIsMenuVisible(false); // Cerrar el menú después de aplicar el filtro
    };

    const formatDate = (dateString) => {
        if (!dateString || !dayjs(dateString).isValid()) {
            return DEFAULT_DATE.format("DD/MM/YYYY");
        }
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getAllUsersLanding();
                const formattedUsers = response.map((user) => ({
                    ...user,
                    createdAt: formatDate(user.createdAt),
                }));
                setUsers(formattedUsers);
                setAllUsers(formattedUsers); // Guardamos todos los usuarios
            } catch (error) {
                console.error("Error obteniendo usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const monthColors = {
        0: "text-purple-700",
        1: "text-blue-700",
        2: "text-teal-800",
        3: "text-green-800",
        4: "text-yellow-800",
        5: "text-orange-800",
        6: "text-red-800",
        7: "text-pink-800",
        8: "text-indigo-800",
        9: "text-gray-800",
        10: "text-lime-800",
        11: "text-cyan-800",
    };

    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const handleMonthFilter = (value) => {
        setSelectedMonth(value);
        if (value !== null) {
            const filteredUsers = allUsers.filter((user) => {
                const month = dayjs(user.createdAt, "DD/MM/YYYY").month();
                return month === value;
            });
            setUsers(filteredUsers);
            setStartDate(null)
            setEndDate(null)
            setShowFilters(false)
        } else {
            setUsers(allUsers);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setUsers(allUsers);
        } else {
            const filteredUsers = allUsers.filter((user) => {
                return (
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                );
            });
            setUsers(filteredUsers);
        }
    };

    const handleSort = (order) => {
        setSortOrder(order);
        const sortedUsers = [...users].sort((a, b) => {
            if (order === "ascend") {
                return dayjs(a.createdAt, "DD/MM/YYYY").isBefore(
                    dayjs(b.createdAt, "DD/MM/YYYY"),
                )
                    ? -1
                    : 1;
            } else {
                return dayjs(a.createdAt, "DD/MM/YYYY").isAfter(
                    dayjs(b.createdAt, "DD/MM/YYYY"),
                )
                    ? -1
                    : 1;
            }
        });
        setUsers(sortedUsers);
    };

    const columns = [
        {
            title: <span className="text-lg font-bold text-blue-700">Nombre</span>,
            dataIndex: "name",
            key: "name",
            render: text => <span style={{ fontSize: '18px' }}>{text}</span>
        },
        {
            title: (
                <span className="text-lg font-bold text-green-700">
                    Correo Electrónico
                </span>
            ),
            dataIndex: "email",
            key: "email",
            render: text => <span style={{ fontSize: '18px' }}>{text}</span>
        },
        {
            title: (
                <span className="text-lg font-bold text-red-700">
                    Fecha de Creación
                </span>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => {
                const month = dayjs(text, "DD/MM/YYYY").month(); // Extrae el mes de la fecha
                return (
                    <span className={`${monthColors[month]} font-bold text-lg`}>{text}</span>
                );
            },
        },
    ];

    const handleDownloadExcel = () => {
        const excelData = users.map((user) => ({
            Nombre: user.name,
            Email: user.email,
            "Fecha de Creación": user.createdAt,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "UsuariosLanding.xlsx");
    };

    const sortMenu = (
        <Menu>
            <Menu.Item onClick={() => handleSort("ascend")}>
                <span className="block">
                    {" "}
                    <Circle
                        className={`m-2 inline h-3 w-3 ${sortOrder === "ascend" ? "fill-current text-purple-600" : "text-blue-600"}`}
                    />
                    Ascendente
                </span>
            </Menu.Item>
            <Menu.Item onClick={() => handleSort("descend")}>
                <span>
                    <Circle
                        className={`m-2 inline h-3 w-3 ${sortOrder === "descend" ? "fill-current text-purple-600" : "text-blue-600"}`}
                    />
                    Descendente
                </span>
            </Menu.Item>
        </Menu>
    );

    const monthMenu = (
        <Menu>
            {months.map((month, index) => (
                <Menu.Item key={index} onClick={() => handleMonthFilter(index)}>
                    <span>
                        <Circle
                            className={`m-2 inline h-3 w-3 ${selectedMonth === index ? "fill-current text-purple-600" : "text-blue-600"}`}
                        />
                        {month}
                    </span>
                </Menu.Item>
            ))}
            <Menu.Item onClick={() => handleMonthFilter(null)}>
                Todos los meses
            </Menu.Item>
        </Menu>
    );

    const dateRangeMenu = (
        <Menu>
            <Menu.Item>
                <span>Desde:</span>
                <DatePicker
                    format="DD/MM/YYYY"
                    value={startDate}
                    onChange={(date, dateString) =>
                        handleDateRangeChange(date, dateString, "start")
                    }
                    picker="date"
                    className="ml-4"
                />
            </Menu.Item>
            <Menu.Item>
                <span>Hasta:</span>
                <DatePicker
                    format="DD/MM/YYYY"
                    value={endDate}
                    onChange={(date, dateString) =>
                        handleDateRangeChange(date, dateString, "end")
                    }
                    picker="date"
                    className="ml-4"
                />
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-blue-600">
                Usuarios Landing
            </h2>

            <div className="mb-4 flex items-center justify-between">
                <Button
                    type="primary"
                    onClick={handleDownloadExcel}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                >
                    Descargar Excel
                </Button>

                <Input
                    placeholder="Buscar por nombre o correo"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-60"
                />

                <div className="flex justify-center items-center relative">

                    Filtros:


                    <div className="flex">
                        <Dropdown overlay={sortMenu} trigger={["click"]}>
                            <Button className="ml-4">
                                Orden{" "}
                                {sortOrder === "descend" ? (
                                    <Triangle className="h-3 w-3 rotate-180 fill-current text-purple-600" />
                                ) : (
                                    <Triangle className="h-3 w-3 fill-current text-purple-600" />
                                )}
                            </Button>
                        </Dropdown>

                        <Dropdown overlay={monthMenu} trigger={["click"]} className="ml-4">
                            <Button>
                                {selectedMonth !== null ? <span className="text-purple-700 font-medium">{months[selectedMonth]}</span> : "Mes"}
                            </Button>
                        </Dropdown>

                        <Dropdown
                            overlay={dateRangeMenu}
                            trigger={["click"]}
                            visible={visible}
                            onVisibleChange={setVisible}
                            className="ml-4"
                        >
                            <Button>{startDate && endDate ? (
                                <span>
                                    <span className="text-purple-600 font-medium">
                                        {startDate.format("DD/MM/YYYY")}
                                    </span>{" "}
                                    -{" "}
                                    <span className="text-purple-600 font-medium">
                                        {endDate.format("DD/MM/YYYY")}
                                    </span>
                                </span>
                            ) : (
                                "Rango de Fecha"
                            )}</Button>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{ fontSize: "24px" }}
            />
        </div>
    );
}



export default UsersLandingList;
