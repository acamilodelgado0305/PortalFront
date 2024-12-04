import {
  CloseOutlined,
  ConsoleSqlOutlined,
  LeftOutlined,
  RightOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import "./WeeklyCalendar.css";
import { useAuth } from "../../../Context/AuthContext";
import Pay from "./pay";
import { createClass } from "../../../services/class.services";
import {
  createClassReservations,
  getClassReservationCurrentById,
} from "../../../services/classReservation";
import { ComputerIcon } from "lucide-react";
import { zonasHorariasg } from "./ZonaHoraria";
import { getLocalStartAndEnd } from "../../../helpers/getLocalStartAndEnd";
const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const zonasHorarias = zonasHorariasg

const CalendarModal = ({
  showCalendarModal,
  setShowCalendarModal,
  teacher,
}) => {
  const success = (msg, type) => {
    message.open({ type, content: msg, style: { marginTop: "20vh" } });
  };

  //usuario context
  const { user } = useAuth();
  const [daySelected, setDaySelected] = useState("");
  const [fecha, setFecha] = useState("");
  const [timeSlots, setTimeSlots] = useState("");
  const [hourSelected, setHourSelected] = useState("");
  const [hourSelectedTeacher, setHourSelectedTeacher] = useState("");
  const [classInterval, setClassInterval] = useState([]);
  const [mañana, setMañana] = useState([]);
  const [tarde, setTarde] = useState([]);
  const [horaReservada, setHoraReservada] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [pay, setPay] = useState(false);
  const [calendarTeacher, setCalendarTeacher] = useState([
    {
      name: "Domingo",
      enable: teacher.Availability.Sunday.enabled,
      timeSlots: teacher.Availability.Sunday.timeSlots,
    },
    {
      name: "Lunes",
      enable: teacher.Availability.Monday.enabled,
      timeSlots: teacher.Availability.Monday.timeSlots,
    },
    {
      name: "Martes",
      enable: teacher.Availability.Tuesday.enabled,
      timeSlots: teacher.Availability.Tuesday.timeSlots,
    },
    {
      name: "Miércoles",
      enable: teacher.Availability.Wednesday.enabled,
      timeSlots: teacher.Availability.Wednesday.timeSlots,
    },
    {
      name: "Jueves",
      enable: teacher.Availability.Thursday.enabled,
      timeSlots: teacher.Availability.Thursday.timeSlots,
    },
    {
      name: "Viernes",
      enable: teacher.Availability.Friday.enabled,
      timeSlots: teacher.Availability.Friday.timeSlots,
    },
    {
      name: "Sábado",
      enable: teacher.Availability.Saturday.enabled,
      timeSlots: teacher.Availability.Saturday.timeSlots,
    },
  ]);

  // Estado que guarda la fecha del inicio de la semana actual
  const [startOfWeek, setStartOfWeek] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });

  const claseReservada = async () => {
    try {
      const response = await getClassReservationCurrentById(teacher.id);
      if (response.success) {
        setHoraReservada(response.data);
        return;
      }
      console.log(response);
    } catch (error) {
      console.log(Error);
    }
  };

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

  const getHourTeacher = (date) => {
    const dateString = new Date(date);
    console.log('dateString \n'+JSON.stringify(dateString))
    let hours = dateString.getUTCHours();

    const minutes = dateString.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
 
    hours = hours % 12 || 12; 

    const formattedTime = `${hours}:${minutes} ${period}`;
    return formattedTime;
  };

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

    hours = hours % 12 || 12; 
    return `${hours}:${mins.toString().padStart(2, "0")} ${period}`;
  }

  function processDate(date, timeSlots) {
    setDaySelected(date),
    setTimeSlots(timeSlots)
    claseReservada();
    getHoursFormat(timeSlots, date);
  }
   
  const getHoursFormat = (timeSlots, date) =>{
    let allHours = [];
    for (let i = 0; i < timeSlots.length; i++) {
      const getHours = getCLass(timeSlots[i], date);
      for (let i = 0; i < getHours.length; i++) {
        allHours.push(getHours[i]);
      }
    }
    console.log('Esto debe ir en mañana '+JSON.stringify(allHours))

    setMañana(allHours.filter((hora) => hora.hora.includes("AM")));
    setTarde(allHours.filter((hora) => hora.hora.includes("PM")));
    setClassInterval(allHours);
    };
  const getCLass = (timeSlots, day) => {
    const timeStart = timeSlots.start;
    const timeEnd = timeSlots.end;
   const hrs = getLocalStartAndEnd({start:timeStart, end:timeEnd})

    const startMinutes = convertToMinutes(hrs.start);
    const endMinutes = convertToMinutes(hrs.end);
    const allMminuts = Math.abs(startMinutes - endMinutes);
    
    const startMinutesTe = convertToMinutes(getHourTeacher(timeStart));


    const classDuration = 30;
    const array = [];

    let currentMinutesTeacher = startMinutesTe;
    let currentMinutes = startMinutes;
    const interval = 30;

    // Generar intervalos de 30 minutos y agregar al array
    for (let elapsed = 0; elapsed < allMminuts; elapsed += interval) {
      const timeString = convertToTimeString(currentMinutes);
      const timeTeacher = convertToTimeString(currentMinutesTeacher);
      array.push({ hora: timeString, fecha: day, horaTeacher: timeTeacher });
      currentMinutesTeacher += interval; 
      currentMinutes += interval; 
    }
    return array;
  };

  const confirm = () =>
    new Promise((resolve) => {
      createClassReservation(resolve);
    });

  const createClassReservation = async (resolve) => {
    if (!daySelected) {
      success("selecciona un dia", "warning");
      resolve(null);
      return;
    }
    if (!user.id) {
      success("Inicia sesion", "warning");
      resolve(null);
      return;
    }
    if (!hourSelected) {
      success("selecciona una hora", "warning");
      resolve(null);
      return;
    }
   const data = {
      teacherId: teacher.userId || teacher.id,
      studentId:user.id,
      date: daySelected,
      hours: hourSelected,
    }
    resolve(null);
    try {
      const response = await createClass(data);
      if (response.success) {
        success("realiza el pago", "success");
        setPay(true);
        resolve(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const weekDays = getWeekDays();
    setWeekDays(weekDays);
    setFecha(
      `${weekDays[0].toString().split(" ")[2]}-${weekDays[weekDays.length - 1].toString().split(" ")[2]}  ${weekDays[3].toString().split(" ")[1]} ${weekDays[3].toString().split(" ")[3]}`,
    );
  }, [startOfWeek]);

  return (
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
        {pay ? "realiza el pago y disfruta tu clase" : "Reserva tu clase"}
      </div>
    } open={showCalendarModal}
    onCancel={() => setShowCalendarModal(false)}
    footer={null}
    width={550}
    height={800}
    closeIcon={<CloseOutlined className="text-black text-xl" />}
    centered

  >
    {
      pay ?
        <Pay />
        :
        <>
          <div className="flex pb-3 mb-2 border-b gap-4 font-mono ">
            <div className="md:w-10 w-24 rounded">
              <img className="rounded md:w-14 w-20 h-14" src={teacher.profileImageUrl} alt="teacher" />
            </div>
            <div>
              <p className="font-bold font-sans text-xl">Reserva una clase de prueba con {teacher.firstName}</p>
              <p className="text-md font-sans">Para hablar de tus objetivos y plan de aprendizaje</p>
            </div>

          </div>
          <div className="text-center">
            <div className="flex w-full justify-around">
              <div className="border-2 rounded text-xl  cursor-pointer hover:bg-gray-200 w-10 h-10 p-1" onClick={handlePreviousWeek}><LeftOutlined /></div>
              <p className="font-sans text-xl">{fecha}</p>
              <div className="border-2 rounded text-xl  cursor-pointer hover:bg-gray-200 w-10 h-10 p-1" onClick={handleNextWeek}><RightOutlined /></div>
            </div>
            <div className="week-days border-b p-3 text-xl">
              {weekDays.map((date, index) => {
                return (
                  <div key={index} className="">
                    <div className="day-name text-xl">{daysOfWeek[date.getDay()].slice(0, 3)}</div>
                    <div
                      onClick={() => { calendarTeacher[date.getDay()].enable && processDate(date.toLocaleDateString(), calendarTeacher[date.getDay()].timeSlots) }}
                      className={`border border-white rounded w-10 h-8 p-1   border-3  ${calendarTeacher[date.getDay()].enable ? "cursor-pointer hover:border-purple-800 hover:bg-purple-500" : "bg-gray-200"} ${daySelected == date.toLocaleDateString() && "bg-purple-400 border-purple-500"}`}>{date.toLocaleDateString().split("/")[0]}</div>
                  </div>
                )
              })}
            </div>
            <div className="font-mono">
              <div className="w-full flex justify-start text-md font-sans p-2 ">
                {
                  daySelected ?
                    <p>Horario disponible {mañana[0]?.hora || tarde[0]?.hora} hasta {classInterval[classInterval.length -1]?.hora || mañana[mañana.length -1]?.hora} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                    :
                    <p>Elige un dia para reservar la clase</p>

                }
              </div>

              <div className="border-b pb-2 overflow-y-scroll h-90">

                <div>
                  <div className="flex gap-2 m-2 font-sans font-bold">
                    <SunOutlined className="border-b-2 border-gray-400 text-xl" />
                    <p className=" text-xl">Por la mañana</p>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xl ">

                    {
                      mañana.length > 0 ?
                        mañana.map((item, i) => {
                          const hora = horaReservada.filter((hora) => hora.horaReserva == item.hora);
                          console.log('hora reservada  '+horaReservada)
                          return (
                            <div
                              onClick={() => { hora[0]?.horaReserva == item.hora && item.fecha == hora[0]?.diaReserva  ? null : setHourSelected(item.hora), setHourSelectedTeacher(item.horaTeacher)}}
                              key={i}
                              className={`w-[100px] border p-1 rounded select-none ${hourSelected == item.hora ? "bg-purple-500" : null} ${hora[0]?.horaReserva == item.hora && item.fecha == hora[0]?.diaReserva ? "bg-gray-300" : "cursor-pointer hover:bg-purple-500"}`}>
                              <span style={{ fontFamily: 'fontSize, sans-serif' }}>{item.hora.split(" ")[0]}</span>
                            </div>
                          )
                        })
                        :
                        <p className="m-2 text-lg font-sans">clases no disponibles</p>
                    }
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-2 m-2 font-sans font-bold  text-xl">
                    <SunOutlined />
                    <p>Despues de medio dia</p>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xl">
                    {
                      tarde.length > 0 ?
                        tarde.map((tarde, i) => {
                          const hora = horaReservada.filter((hora) => hora.horaReserva == tarde.hora);
                          return (
                            <div onClick={() => { hora[0]?.horaReserva == tarde.hora && tarde.fecha == hora[0]?.diaReserva  ? null : setHourSelected(tarde.hora), setHourSelectedTeacher(tarde.horaTeacher)}} key={i} className={`w-[100px] border p-1 rounded select-none  ${hourSelected == tarde.hora ? "bg-purple-400" : null} ${hora[0]?.horaReserva == tarde.hora && tarde.fecha == hora[0]?.diaReserva ? "bg-gray-300" : "hover:bg-purple-500 cursor-pointer"}`}>
                              <span style={{ fontFamily: 'fontSize, sans-serif' }}>{tarde.hora.split(" ")[0]}</span>
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
                <Button
                  className="m-2"
                  style={{ backgroundColor: '#9D4EDD' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9D4EDD')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9D4EDD')}
                  type="primary"
                >
                  Continuar
                </Button>
              </Popconfirm>
            </div>
          </div>
        </>
    }
  </Modal>
  );
};

export default CalendarModal;
