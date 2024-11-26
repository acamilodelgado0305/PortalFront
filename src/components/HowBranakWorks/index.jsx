import Target from "./Target";
const HowBranakWorks = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center lg:pb-8">
      <div className=" justify-center w-full md:w-[80%] h-auto m-auto">
   <div className="mb-5 w-[100%]">
          <h2 className="text-5xl lg:text-6xl font-bold text-[#86efac] text-left ">How Branak works:</h2>
        </div>
       
        <div className="mb-14 flex flex-col lg:flex-row gap-10 "> 
          <Target number={1} />
          <Target number={2}  />
          <Target number={3}  />
        </div>
      </div>
    </div>
  );
};

export default HowBranakWorks;
