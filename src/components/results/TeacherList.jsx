import { useState, useEffect } from "react";
import { allCountries } from "../../services/allcountries";
import { BookOutlined } from "@ant-design/icons";

import DaysOfWeek from "./DaysOfWeek";
import SearchAndFilter from "./SearchAndFilter";
import CertificationModal from "./CertificationModal";
import ShowMoreText from "./ShowMoreText";

function TeacherList({ teachers = [], openModal}) {
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
            className="flex items-center space-x-4 rounded-xl bg-white p-4 shadow-md"
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
              <div className="mt-4 flex w-full flex-col md:flex-row md:justify-start lg:justify-end">
                <p className="mt-2 pr-5 text-[17px] text-sm text-gray-500" onClick={()=>openCertificarionModal(teacher)}>
                  <span className="transform cursor-pointer border border-[#8f34ea] p-2 italic text-[#8f34ea] transition duration-300 ease-in-out hover:scale-105 hover:bg-[#8f34ea] hover:text-white">
                    Education <BookOutlined style={{ fontSize: "24px" }} />
                  </span>
                </p>
                <DaysOfWeek Availability={teacher?.Availability} />
                <div className="flex md:ml-2">
                  <button
                    className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => openModal(teacher)}
                  >
                    One Free Class
                  </button>
                  <button
                    className="rounded bg-[#8f34ea] px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => openModal(teacher)}
                  >
                    View Video
                  </button>
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
