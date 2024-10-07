import React from 'react';

const Tutor = () => {
  return (
    <div className="bg-white h-auto w-full">
      <div className="bg-white max-w-screen-lg mx-auto  p-4 h-auto w-full">
        
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold">Find the right tutor for you.</h1>
          <p className="text-lg text-black mt-7">
            With over 30,000 tutors and 1M+ learners, we know language learning.
          </p>
        </div>

        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start">
          <div className="relative md:w-1/2 h-[500px] flex items-end justify-end">
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg"
              style={{
                width: '400px',
                height: '400px',
                top: '50px',
                left: '60px',
                zIndex: 1
              }}>
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </div>
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg"
              style={{
                width: '400px',
                height: '450px',
                top: '25px',
                left: '90px',
                zIndex: 2
              }}>
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </div>
            <div
              className="absolute bg-gray-200 rounded-lg shadow-lg"
              style={{
                width: '400px',
                height: '500px',
                top: '0',
                left: '120px',
                zIndex: 3
              }}>
              <img
                alt="Tutor"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src="https://randomuser.me/api/portraits/women/44.jpg"
              />
              <div className="absolute bottom-2 right-2 flex flex-row items-end gap-3 z-4">
                <div className="bg-white text-black border border-black rounded-sm px-2 py-1">
                  Brianna
                </div>
                <div className="bg-green-500 text-black border border-black rounded-sm px-2 py-1">
                  English tutor
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center md:w-1/2 h-96 ml-32">
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
