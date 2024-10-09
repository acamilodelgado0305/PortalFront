import React from 'react';

const Tutor = () => {
  return (
    <div className="bg-white h-auto w-full">
      <div className="bg-white max-w-screen-lg mx-auto p-4 h-auto w-full">
        
        <div className="text-center mb-16">
          <h1 className="font-bold text-7xl lg:text-9xl">Find the right tutor for you.</h1>
          <p className="text-black mt-7 text-2xl ">
            With over 30,000 tutors and 1M+ learners, we know language learning.
          </p>
        </div>

        <div className="flex flex-col items-center  align-middle lg:flex-row borderrs border-red-500">
          <div className="relative w-1/2 h-[570px] sm:ml-20 items-center justify-center align-middle borderr border-green-500">
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg w-[300px] h-[350px] left-[-40px] lg:right-[-40px] lg:w-[400px] lg:h-[450px] top-[50px]  z-[1] "
            >
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </div>
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg w-[300px] h-[410px] left-[-20px] lg:right-[-20px] lg:w-[400px] lg:h-[510px] top-[25px]  z-[2]"
            >
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </div>
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg w-[300px] h-[463px] left-[0px] lg:right-[-0px] lg:w-[400px] lg:h-[563px] top-0  z-[3] "
            >
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
              <div className="absolute bottom-2 right-2 flex flex-row items-end gap-3 z-[4]">
                <div className="bg-white text-black border border-black rounded-sm px-2 py-1">
                  Brianna
                </div>
                <div className="bg-green-500 text-black border border-black rounded-sm px-2 py-1">
                  English tutor
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col  items-center h-48 lg:justify-center lg:w-1/2 lg:h-96 lg:ml-56 borderr border-pin-500">
            <p className="text-3xl font-bold italic">
              "The energy she brings to each lesson is amazing."
            </p>
            <p className="text-gray-900 font-semibold mt-2">Ismael</p>
            <p>English learner on Esturio</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Tutor;
