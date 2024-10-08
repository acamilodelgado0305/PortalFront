import Target from "./Target";
const HowBranakWorks = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center lg:pb-8">
      <div className=" justify-center w-full max-w-screen-4xl px-6">

        <div className="mb-5  px-4 w-full">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 text-left pl-20">How Branak works:</h2>
        </div>
        <div className="mb-14 flex flex-col lg:flex-row gap-10  w-full sm:px-10 sm:pb-7 md:px-20 ">
          <Target number={1} />
          <Target number={2}  />
          <Target number={3}  />
        </div>
      </div>
    </div>
  );
};

export default HowBranakWorks;
