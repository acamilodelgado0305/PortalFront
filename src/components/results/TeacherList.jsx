import { useState, useEffect } from "react";
import { allCountries } from "../../services/allcountries";
import { BookOutlined, ReadOutlined } from "@ant-design/icons";

import DaysOfWeek from "./DaysOfWeek";
import SearchAndFilter from "./SearchAndFilter";
import CertificationModal from "./CertificationModal";
import ShowMoreText from "./ShowMoreText";

function TeacherList({ teachers = [], openModal, closeRegisterModal}) {
  const [filterTeachers, setFilterTeachers] = useState(teachers);
  const [teacherCertification, setTeacherCertification] = useState(null)
  const [isCertificationModalOpen, setIsCertificationModalOpen ] = useState(null)

  const openCertificarionModal = (teacher) =>{
    setTeacherCertification(teacher);
    setIsCertificationModalOpen(true);
 

  }

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string") return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    console.log("teachers: " + JSON.stringify(filterTeachers));
  }, [filterTeachers]);


  return (
    <>
    <ul className="space-y-4">
      <SearchAndFilter
        setFilterTeachers={setFilterTeachers}
        teachers={teachers}
      />
      {filterTeachers.map((teacher) => {
        const country = allCountries.find(
          (country) => country.code === teacher.countryOfBirth,
        );
        return (
          <li
            key={teacher.id}
            className="flex items-center space-x-4 rounded-xl bg-white p-4 shadow-md flex-col md:flex-row"
          >
            <img
              src={teacher.profileImageUrl || "/api/placeholder/400/400"}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="h-24 w-24 rounded-full object-cover md:mx-6"
            />
            <div className="flex-1">
              <div className="flex items-center gap-[40%]  md:justify-between ">
                <h2 className="pb-2 pt-6 text-lg font-semibold">
                  {teacher.firstName} {teacher.lastName}
                </h2>        
              </div>
             <div className="relative">
                  <p className="absolute right-5  text-xl text-gray-600">
                    Tarifa:{" "}
                    <span className="font-semibold">${teacher.hourlyRate}</span>
                  </p>
                </div>

                
              <p className="mt-2 text-[17px] text-sm text-gray-500">
                <span className="text-[#8f34ea]">Country:</span>{" "}
                {country ? country.name : "No country info"}
              </p>
              <p className="mt-2 text-[17px] text-sm text-gray-500">
                <span className="text-[#8f34ea]">Language:</span>{" "}
                {capitalizeFirstLetter(teacher.language)}
              </p>
              <p className="mt-2 text-[17px] text-sm text-gray-500">
                <span className="text-[#8f34ea]">Subjects Taught:</span>{" "}
                {capitalizeFirstLetter(teacher.subjectYouTeach)}
              </p>

              <p className="mt-2 pt-5 text-[17px] text-sm text-gray-500">
                <span className="text-[#8f34ea]">
                  Why Am I the Best Choice?:{" "}
                </span>{" "}
                
                <span className="italic">
                <ShowMoreText text={teacher?.description?.motivateStudents && 'No info'}/>
                </span>
                
              </p>
              <div className="mt-4 flex w-full flex-col md:flex-row md:justify-start lg:justify-end items-end">
                <div className="flex flex-start gap-5 flex-row mr-7">
                  <button
                  onClick={()=>closeRegisterModal(teacher)} 
                  className="  w-[160px] h-[40px] rounded-2xl bg-[#5CEFFF] px-2 py-2 text-[1rem] text-black">
                    Quiero aprender!
                  </button>
                  <button
                  onClick={()=>closeRegisterModal(teacher)} 
                  className=" w-[160px] h-[40px] rounded-2xl border px-2 py-2 text-[1rem] text-black">
                    Enviar un mensaje!
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-end w-full">
                  <div className="flex flex-col md:flex-row items-center md:ml-2 w-full">
                    <p className="mt-2 text-[17px] text-sm text-gray-500 mb-3" onClick={()=>openCertificarionModal(teacher)}>
                      <span className="transform cursor-pointer border border-[#8f34ea] p-2 italic text-[#8f34ea] transition duration-300 ease-in-out hover:scale-105 hover:bg-[#8f34ea] hover:text-white">
                       Education <BookOutlined style={{ fontSize: "24px" }} />
                      </span>
                    </p>
                    <DaysOfWeek Availability={teacher?.Availability} />
                   </div>
                  <div className="flex flex-row md:flex-col md:ml-2  items-center gap-2">
                    <button
                     className="mr-2 w-[140px] h-[40px] rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                     onClick={() => openModal(teacher)}
                    >
                     One Free Class
                    </button>
                    <button
                     className="mr-2 w-[140px] h-[40px] rounded bg-[#8f34ea] px-4 py-2 text-white hover:bg-blue-600"
                     onClick={() => openModal(teacher)}
                    >
                     View Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>

    <CertificationModal teacherCertification={teacherCertification} isCertificationModalOpen={isCertificationModalOpen} setIsCertificationModalOpen={setIsCertificationModalOpen}/>
    </>
  );
}

export default TeacherList;