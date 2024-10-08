import React from "react";

const HowBranakWorks = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center overflow-hidden">
      <div className="justify-center w-full xl:max-w-screen-xl px-4">

        <div className="mb-14 p-4 w-full">
          <h2 className="text-6xl xl:text-8xl font-bold text-gray-900 text-left">How Branak works:</h2>
        </div>

        <div className="flex flex-col xl:flex-row xl:flex-wrap gap-6 w-full">
          
          <div className="bg-white border border-black rounded-lg shadow-md p-7 sm:p-14 w-full xl:w-[31%] xl:flex-grow xl:min-h-[400px] h-auto xl:h-[920px]">
            <div className="flex flex-col mb-6">
              <div className="bg-green-300 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-4xl xl:text-6xl font-bold">Find your tutor.</h3>
            </div>
            <p className="text-lg xl:text-3xl mb-6">
              We'll connect you with a tutor who will motivate, challenge, and inspire you.
            </p>
            <div className="border border-black rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <img
                  className="w-12 h-12 rounded-md mr-3"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Tutor Milena"
                />
                <div>
                  <p className="font-semibold">Milena</p>
                  <p className="text-gray-500 text-sm">French tutor</p>
                </div>
                <span className="ml-auto font-semibold">4.9 ⭐</span>
              </div>
              <p className="text-gray-500 text-sm">Speaks French (Native), English (Advanced) +2</p>
            </div>
            <div className="border border-black rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img
                  className="w-12 h-12 rounded-md mr-3"
                  src="https://randomuser.me/api/portraits/men/45.jpg"
                  alt="Tutor John"
                />
                <div>
                  <p className="font-semibold">John</p>
                  <p className="text-gray-500 text-sm">Spanish tutor</p>
                </div>
                <span className="ml-auto font-semibold">4.8 ⭐</span>
              </div>
              <p className="text-gray-500 text-sm">Speaks Spanish (Native), English (Intermediate)</p>
            </div>
          </div>

          <div className="bg-white border border-black rounded-lg shadow-md p-7 sm:p-14 w-full xl:w-[31%] xl:flex-grow xl:min-h-[400px] h-auto xl:h-[920px]">
            <div className="flex flex-col mb-6">
              <div className="bg-yellow-300 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-4xl xl:text-6xl font-bold">Start learning.</h3>
            </div>
            <p className="text-lg xl:text-3xl mb-6">
              Your tutor will guide the way through your first lesson and help you plan your next steps.
            </p>
            <div className="flex justify-center">
              <img
                className="border border-black rounded-lg w-full h-96 mx-5"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Tutor teaching"
              />
            </div>
          </div>

          <div className="bg-white border border-black rounded-lg shadow-md p-7 sm:p-14 w-full xl:w-[31%] xl:flex-grow xl:min-h-[400px] h-auto xl:h-[1000px]">
            <div className="flex flex-col mb-6">
              <div className="bg-blue-500 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-4xl xl:text-6xl font-bold">Speak. Read. Write. Repeat.</h3>
            </div>
            <p className="text-lg xl:text-3xl mb-6">
              Choose how many lessons you want to take each week and get ready to reach your goals!
            </p>
            <div className="flex justify-center">
              <img
                className="border border-black rounded-lg w-full h-96 mx-5"
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Tutor working with student"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HowBranakWorks;
