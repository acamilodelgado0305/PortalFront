import { CloseOutlined, LeftOutlined, RightOutlined, SunOutlined } from "@ant-design/icons"
import { Button, message, Modal, Popconfirm } from "antd"
import { useEffect, useState } from "react";
import './WeeklyCalendar.css';
import { useAuth } from "../../../Context/AuthContext";
import Cookies from 'js-cookie';
import Pay from "./pay";
import { createClassReservations, getClassReservationCurrentById } from "../../../services/classReservation";
import { ComputerIcon } from "lucide-react";
const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];


const CalendarModal = ({ showCalendarModal, setShowCalendarModal, teacher }) => {

  const success = (msg, type) => {
    message.open({ type, content: msg, style: { marginTop: "20vh" } });
  };


  //usuario context
  const { user } = useAuth();
  const [daySelected, setDaySelected] = useState("");
  const [fecha, setFecha] = useState("");
  const [timeSlots, setTimeSlots] = useState("");
  const [hourSelected, setHourSelected] = useState("");
  const [classInterval, setClassInterval] = useState([]);
  const [mañana, setMañana] = useState([]);
  const [tarde, setTarde] = useState([]);
  const [horaReservada, setHoraReservada] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [pay, setPay] = useState(false);
  const [calendarTeacher, setCalendarTeacher] = useState(
    [
      { name: 'Domingo', enable: teacher.Availability.Sunday.enabled, timeSlots: teacher.Availability.Sunday.timeSlots },
      { name: 'Lunes', enable: teacher.Availability.Monday.enabled, timeSlots: teacher.Availability.Monday.timeSlots },
      { name: 'Martes', enable: teacher.Availability.Tuesday.enabled, timeSlots: teacher.Availability.Tuesday.timeSlots },
      { name: 'Miércoles', enable: teacher.Availability.Wednesday.enabled, timeSlots: teacher.Availability.Wednesday.timeSlots },
      { name: 'Jueves', enable: teacher.Availability.Thursday.enabled, timeSlots: teacher.Availability.Thursday.timeSlots },
      { name: 'Viernes', enable: teacher.Availability.Friday.enabled, timeSlots: teacher.Availability.Friday.timeSlots },
      { name: 'Sábado', enable: teacher.Availability.Saturday.enabled, timeSlots: teacher.Availability.Saturday.timeSlots },
    ]
  );

  // Estado que guarda la fecha del inicio de la semana actual
  const [startOfWeek, setStartOfWeek] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });

  // funcion para optener las clases ya reservadas del profesor 
  const claseReservada = async () => {
    try {
      const response = await getClassReservationCurrentById(teacher.id);
      if (response.success) {
        setHoraReservada(response.data)
        return;
      }
      console.log(response)
    } catch (error) {
      console.log(Error)
    }
  }


  // Calcular los días de la semana en función del inicio de la semana
  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const handlePreviousWeek = () => {
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(startOfWeek.getDate() - 7); // Retrocede 7 días
    setStartOfWeek(newStartOfWeek);
  };

  const handleNextWeek = () => {
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(startOfWeek.getDate() + 7); // Avanza 7 días
    setStartOfWeek(newStartOfWeek);
  };


  // funciones para manejar horas 
  const getHour = (date) => {
    const dateString = new Date(date);

    let hours = dateString.getUTCHours();
    const minutes = dateString.getUTCMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convertir a formato de 12 horas
    hours = hours % 12 || 12; // Si la hora es 0 (medianoche), se convierte en 12

    const formattedTime = `${hours}:${minutes} ${period}`;
    return formattedTime
  }

  function convertToMinutes(time) {
    const [hourMinute, period] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":").map(Number);

    // Convertir formato de 12 horas a 24 horas
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  function convertToTimeString(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";

    // Convertir a formato de 12 horas
    hours = hours % 12 || 12; // 0 horas se convierte a 12 para AM/PM
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  // Procesar y generar intervalos de clases
  function processDate(date, timeSlots) {
    // agregar informacion a los datos 
    setDaySelected(date),
      setTimeSlots(timeSlots)
    getCLass(timeSlots, date)
    claseReservada();

  }

  const getCLass = (timeSlots, day) => {
    const timeStart = timeSlots[0].start;
    const timeEnd = timeSlots[0].end;

    // se resta los minutos 
    const startMinutes = convertToMinutes(getHour(timeStart))
    const endMinutes = convertToMinutes(getHour(timeEnd));
    const allMminuts = Math.abs(startMinutes - endMinutes)
    const classDuration = 30;
    const array = [];

    let currentMinutes = startMinutes;
    const interval = 30;

    // Generar intervalos de 30 minutos y agregar al array
    for (let elapsed = 0; elapsed < allMminuts; elapsed += interval) {
      const timeString = convertToTimeString(currentMinutes);
      array.push({ hora: timeString, fecha: day });
      currentMinutes += interval; // Incrementar la hora por cada intervalo de 30 minutos
    }
    setMañana(array.filter((hora) => hora.hora.includes("AM")));
    setTarde(array.filter((hora) => hora.hora.includes("PM")));
    setClassInterval(array)

  }


  // Función para crear una reserva
  const confirm = () =>
    new Promise((resolve) => {
      createClassReservation(resolve)
    });

  const createClassReservation = async (resolve) => {
    if (!daySelected) {
      success("selecciona un dia", "warning")
      resolve(null)
      return;
    }
    if (!user.id) {
      success("Inicia sesion", "warning")
      resolve(null)
      return;
    }
    if (!hourSelected) {
      success("selecciona una hora", "warning")
      resolve(null)
      return;
    }

    const dataReservation = {
      studentId: user.id,
      teacherId: teacher.id,
      diaReserva: daySelected,
      horaReserva: hourSelected,
      pay: false
    }
    resolve(null)
    try {
      const response = await createClassReservations(dataReservation)
      if (response.success) {
        success("realiza el pago", "success");
        setPay(true);
        resolve(null);
      }

    } catch (error) {
      console.log(error)

    }
  }

  // Efecto para actualizar los días de la semana y fecha
  useEffect(() => {
    const weekDays = getWeekDays();
    setWeekDays(weekDays);
    setFecha(`${weekDays[0].toString().split(" ")[2]}-${weekDays[weekDays.length - 1].toString().split(" ")[2]}  ${weekDays[3].toString().split(" ")[1]} ${weekDays[3].toString().split(" ")[3]}`)
  }, [startOfWeek])


  return (
    <Modal
      title={pay ? "realiza el pago y disfruta tu clase" : "Reserva tu clase"}
      open={showCalendarModal}
      onCancel={() => setShowCalendarModal(false)}
      footer={null}
      width={480}
      closeIcon={<CloseOutlined className="text-black" />}
      centered

    >
      {
        pay ?
          <Pay />
          :
          <>
            <div className="flex pb-3 mb-2 border-b gap-4 font-mono">
              <div className="w-10 rounded">
                <img className="rounded" src={teacher.profileImageUrl} alt="teacher" />
              </div>
              <div>
                <p className="font-bold font-sans text-lg">Reserva una clase de prueba con {teacher.firstName}</p>
                <p className="font-bold text-xs font-light">Para hablar de tus objetivos y plan de aprendizaje</p>
              </div>

            </div>
            <div className="text-center">
              <div className="flex w-full justify-around">
                <div className="border-2 rounded text-lg  cursor-pointer hover:bg-gray-200 w-10 h-10 p-1" onClick={handlePreviousWeek}><LeftOutlined /></div>
                <p className="font-mono">{fecha}</p>
                <div className="border-2 rounded text-lg  cursor-pointer hover:bg-gray-200 w-10 h-10 p-1" onClick={handleNextWeek}><RightOutlined /></div>
              </div>
              <div className="week-days border-b p-3">
                {weekDays.map((date, index) => {
                  return (
                    <div key={index} className="">
                      <div className="day-name">{daysOfWeek[date.getDay()].slice(0, 3)}</div>
                      <div
                        onClick={() => { calendarTeacher[date.getDay()].enable && processDate(date.toLocaleDateString(), calendarTeacher[date.getDay()].timeSlots) }}
                        className={`border border-white rounded w-10 h-8 p-1   border-3  ${calendarTeacher[date.getDay()].enable ? "cursor-pointer hover:border-pink-500 hover:bg-pink-100" : "bg-gray-200"} ${daySelected == date.toLocaleDateString() && "bg-pink-100 border-pink-500"}`}>{date.toLocaleDateString().split("/")[0]}</div>
                    </div>
                  )
                })}
              </div>
              <div className="font-mono">
                <div className="w-full flex justify-start text-xs font-light p-2">
                  {
                    daySelected ?
                      <p>Horario disponible {getHour(timeSlots[0]?.start)} hasta {getHour(timeSlots[0]?.end)} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                      :
                      <p>Elige un dia para reservar la clase</p>

                  }
                </div>

                <div className="border-b pb-2 overflow-y-scroll h-60">

                  <div>
                    <div className="flex gap-2 m-2 font-bold">
                      <SunOutlined className="border-b-2 border-gray-400" />
                      <p className="font-bold">Por la mañana</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">

                      {
                        mañana.length > 0 ?
                          mañana.map((item, i) => {
                            const hora = horaReservada.filter((hora) => hora.horaReserva == item.hora);
                            return (
                              <div
                                onClick={() => { hora[0]?.horaReserva == item.hora.split(" ")[0] && item.fecha == hora[0]?.diaReserva ? null : setHourSelected(item.hora) }}
                                key={i} className={`w-[100px] border p-1 rounded select-none ${hourSelected == item.hora ? "bg-pink-200" : null} ${hora[0]?.horaReserva == item.hora && item.fecha == hora[0]?.diaReserva ? "bg-gray-300" : "cursor-pointer hover:bg-pink-200"}`}>
                                {item.hora.split(" ")[0]}
                              </div>
                            )
                          })
                          :
                          <p className="m-2 font-light">clases no disponibles</p>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-2 m-2 font-bold">
                      <SunOutlined />
                      <p>Despues de medio dia</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {
                        tarde.length > 0 ?
                          tarde.map((tarde, i) => {
                            const hora = horaReservada.filter((hora) => hora.horaReserva == tarde.hora);
                            return (
                              <div onClick={() => { hora[0]?.horaReserva == tarde.hora && tarde.fecha == hora[0]?.diaReserva ? null : setHourSelected(tarde.hora) }} key={i} className={`w-[100px] border p-1 rounded select-none  ${hourSelected == tarde.hora ? "bg-pink-200" : null} ${hora[0]?.horaReserva == tarde.hora && tarde.fecha == hora[0]?.diaReserva ? "bg-gray-300" : "hover:bg-pink-200 cursor-pointer"}`}>
                                {tarde.hora.split(" ")[0]}
                              </div>
                            )
                          })
                          :
                          <p className="m-2 font-light">clases no disponibles</p>
                      }
                    </div>
                  </div>

                </div>
                <Popconfirm
                  title="confirma tu reserva"
                  description={`Reservaste una clase con el profesor ${teacher.firstName} 
                      el dia ${daySelected.split("/")[0]} 
                      a las ${hourSelected}`}
                  onConfirm={confirm}
                  onOpenChange={() => console.log('open change')}
                >
                  <Button className="m-2" type="primary">Continuar</Button>
                </Popconfirm>
              </div>
            </div>
          </>
      }
    </Modal>
  )
}


export default CalendarModal;