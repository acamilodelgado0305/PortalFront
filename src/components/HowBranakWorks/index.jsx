import Target from "./Target";
const HowBranakWorks = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center">
      <div className=" justify-center w-full max-w-screen-4xl px-6">

        <div className="mb-14 p-4 w-full">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 text-left">How Branak works:</h2>
        </div>
        <div className=" flex flex-col lg:flex-row gap-6  w-full">
          <Target number={1} title={'Find your tutor.'} description={` Your tutor will guide the way through your first lesson and help you plan your next steps.`}/>
          <Target number={2} title={'Start learning.'} description={` We'll connect you with a tutor who will motivate, challenge, and inspire you.`} img={'https://randomuser.me/api/portraits/men/32.jpg'}/>
          <Target number={3} title={'Speak. Read. Write. Repeat.'} description={`Choose how many lessons you want to take each week and get ready to reach your goals!`} img={'https://randomuser.me/api/portraits/men/45.jpg'}/>
        </div>
      </div>
    </div>
  );
};

export default HowBranakWorks;
