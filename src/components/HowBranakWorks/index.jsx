import Target from "./Target";
const HowBranakWorks = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center">
      <div className=" justify-center w-full max-w-screen-4xl px-6">

        <div className="mb-14 px-4 w-full">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 text-left">How Branak works:</h2>
        </div>
        <div className=" flex flex-col lg:flex-row gap-6  w-full">
          <Target number={1} />
          <Target number={2}  />
          <Target number={3}  />
        </div>
      </div>
    </div>
  );
};

export default HowBranakWorks;
