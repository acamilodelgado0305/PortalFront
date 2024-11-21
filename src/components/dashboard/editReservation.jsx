import { CloseOutlined, LeftOutlined, RightOutlined, SunOutlined } from "@ant-design/icons"
import { Button, message, Modal, Popconfirm } from "antd"
import { useEffect, useState } from "react";
import '../results/components/WeeklyCalendar.css';
import { useAuth } from "../../Context/AuthContext";
import { getClassReservationCurrentByIdStudent, updateClassReservation } from "../../services/classReservation";
const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const zonasHorarias = [
  { pais: "AR", zonaHoraria: "America/Argentina/Buenos_Aires", utc: -3 }, // Argentina
  { pais: "BO", zonaHoraria: "America/La_Paz", utc: -4 },               // Bolivia
  { pais: "BR", zonaHoraria: "America/Sao_Paulo", utc: -3 },             // Brasil
  { pais: "CA", zonaHoraria: "America/Toronto", utc: -5 },               // Canadá (Toronto)
  { pais: "CL", zonaHoraria: "America/Santiago", utc: -4 },              // Chile
  { pais: "CO", zonaHoraria: "America/Bogota", utc: -5 },                // Colombia
  { pais: "CR", zonaHoraria: "America/Costa_Rica", utc: -6 },            // Costa Rica
  { pais: "CU", zonaHoraria: "America/Havana", utc: -5 },                // Cuba
  { pais: "EC", zonaHoraria: "America/Guayaquil", utc: -5 },             // Ecuador
  { pais: "SV", zonaHoraria: "America/El_Salvador", utc: -6 },           // El Salvador
  { pais: "GT", zonaHoraria: "America/Guatemala", utc: -6 },             // Guatemala
  { pais: "HN", zonaHoraria: "America/Tegucigalpa", utc: -6 },           // Honduras
  { pais: "MX", zonaHoraria: "America/Mexico_City", utc: -6 },           // México
  { pais: "NI", zonaHoraria: "America/Managua", utc: -6 },               // Nicaragua
  { pais: "PA", zonaHoraria: "America/Panama", utc: -5 },                // Panamá
  { pais: "PY", zonaHoraria: "America/Asuncion", utc: -4 },              // Paraguay
  { pais: "PE", zonaHoraria: "America/Lima", utc: -5 },                  // Perú
  { pais: "DO", zonaHoraria: "America/Santo_Domingo", utc: -4 },         // República Dominicana
  { pais: "UY", zonaHoraria: "America/Montevideo", utc: -3 },            // Uruguay
  { pais: "VE", zonaHoraria: "America/Caracas", utc: -4 },               // Venezuela
];


const EditReservation = ({ showCalendarModal, setShowCalendarModal, teacher, idReservation, studentId}) => {

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
  const [mañana, setMañana] = useState([]);
  const [tarde, setTarde] = useState([]);
  const [horaReservada, setHoraReservada] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
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

  // funcion para optener las clases ya reservadas del estudiante 
  const claseReservada = async () => {
    try {
      const response = await getClassReservationCurrentByIdStudent(studentId, teacher.id);
      if (response.success) {
        setHoraReservada(response.data)
        return;
      }
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
  const getHourStudent = (date) => {
    const dateString = new Date(date);
    const timeZoneLocal= zonasHorarias.filter(zona => zona.zonaHoraria == Intl.DateTimeFormat().resolvedOptions().timeZone);
    const utcLocal = zonasHorarias.filter((z) => z.pais == timeZoneLocal[0].pais);
    const utcTeacher = zonasHorarias.filter((z) => z.pais == teacher.countryOfBirth.toUpperCase());
    const diferennciaHoraria = Math.abs(utcTeacher[0].utc) > Math.abs(utcLocal[0].utc)?Math.abs(utcLocal[0].utc) + utcTeacher[0].utc: Math.abs(utcLocal[0].utc) - Math.abs(utcTeacher[0].utc)

    let hours = dateString.getUTCHours();
    hours = hours + diferennciaHoraria
    const minutes = dateString.getUTCMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    // se suma las horas 
    //hours + horaUtc
    // Convertir a formato de 12 horas
    hours = hours % 12 || 12; // Si la hora es 0 (medianoche), se convierte en 12
  
    
    const formattedTime = `${hours}:${minutes} ${period}`;
    return formattedTime
  }
  const getHourTeacher = (date) => {
    const dateString = new Date(date);
    let hours = dateString.getUTCHours();

    const minutes = dateString.getUTCMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    // se suma las horas 
    //hours + horaUtc
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
    // optener tiempo de los estudiantes y mostrarlos en la interface
    const startMinutes = convertToMinutes(getHourStudent(timeStart))
    const endMinutes = convertToMinutes(getHourStudent(timeEnd));
    const allMminuts = Math.abs(startMinutes - endMinutes);

    // optener tiempo de los profesores
    const startMinutesTe = convertToMinutes(getHourTeacher(timeStart))
    // const endMinutesTe = convertToMinutes(getHourTeacher(timeEnd));
    //nconst allMminutsTe = Math.abs(startMinutesTe - endMinutesTe);

    const classDuration = 30;
    const array = [];
    
    let currentMinutesTeacher = startMinutesTe;
    let currentMinutes = startMinutes;
    const interval = 30;

    // Generar intervalos de 30 minutos y agregar al array
    for (let elapsed = 0; elapsed < allMminuts; elapsed += interval) {
      const timeString = convertToTimeString(currentMinutes);
      const timeTeacher = convertToTimeString(currentMinutesTeacher);
      array.push({ hora: timeString, fecha: day , horaTeacher: timeTeacher});
      currentMinutesTeacher += interval; // incrementer la hora a teacher
      currentMinutes += interval; // Incrementar la hora por cada intervalo de 30 minutos
    }
    setMañana(array.filter((hora) => hora.hora.includes("AM")));
    setTarde(array.filter((hora) => hora.hora.includes("PM")));
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

    const newDataReservation = {
      horaReservaProfesor: hourSelectedTeacher,
      diaReserva: daySelected,
      horaReserva: hourSelected
    }
    resolve(null)
    try {
      const response = await updateClassReservation(idReservation, newDataReservation)
      if (response.success) {
        success("la reserva fue Reprogramada", "success");
        resolve(null);
        setShowCalendarModal(false);
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
      title={
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          Reprograma tu clase 
        </div>
      } open={showCalendarModal}
      onCancel={() => setShowCalendarModal(false)}
      footer={null}
      width={550}
      height={800}
      closeIcon={<CloseOutlined className="text-black text-xl" />}
      centered

    >
      
        
          <>
            <div className="flex pb-3 mb-2 border-b gap-4 font-mono ">
              <div>
                <p className="font-bold font-sans text-xl">Elige un nuevo dia y hora </p>
                <p className="font-bold text-md font-light">Tu estudiante resivira la notificacion de la Reprogramacion de la clase </p>
              </div>

            </div>
            <div className="text-center">
              <div className="flex w-full justify-around">
                <div className="border-2 rounded text-xl  cursor-pointer hover:bg-gray-200 w-10 h-10 p-1" onClick={handlePreviousWeek}><LeftOutlined /></div>
                <p className="font-mono text-xl">{fecha}</p>
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
                <div className="w-full flex justify-start text-md font-light p-2 ">
                  {
                    daySelected ?
                      <p>Horario disponible {getHourStudent(timeSlots[0]?.start)} hasta {getHourStudent(timeSlots[0]?.end)} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                      :
                      <p>Elige un dia para reservar la clase</p>

                  }
                </div>

                <div className="border-b pb-2 overflow-y-scroll h-90">

                  <div>
                    <div className="flex gap-2 m-2 font-bold">
                      <SunOutlined className="border-b-2 border-gray-400 text-xl" />
                      <p className="font-bold text-xl">Por la mañana</p>
                    </div>
                    <div className="flex gap-2 flex-wrap text-xl ">

                      {
                        mañana.length > 0 ?
                          mañana.map((item, i) => {
                            const hora = horaReservada.filter((hora) => hora.horaReserva == item.hora);
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
                          <p className="m-2 text-lg">clases no disponibles</p>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-2 m-2 font-bold text-xl">
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
                  description={`Reprogramaste la clase
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
                    Reprogramar
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </>
      
    </Modal>
  )
}


export default EditReservation;