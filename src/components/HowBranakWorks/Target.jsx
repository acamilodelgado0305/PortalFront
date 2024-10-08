import OptionTutor from "./OptionTutor";

function Target({ number }) {
  // Define the background color for the badge based on the number
  const badgeColors = {
    1: "bg-green-300",
    2: "bg-yellow-300",
    3: "bg-blue-500",
  };

  const title = {
    1: "Find your tutor.",
    2: "Start learning.",
    3: "Speak. Read. Write. Repeat."
  }

  const description = {
    1: "Your tutor will guide the way through your first lesson and help you plan your next steps.",
    2: " We'll connect you with a tutor who will motivate, challenge, and inspire you.",
    3: "Choose how many lessons you want to take each week and get ready to reach your goals!"
  }

  const img = {
    2:"https://randomuser.me/api/portraits/men/32.jpg",
    3:"https://randomuser.me/api/portraits/men/45.jpg"
  }
  return (
    <div className="rounded-lg shadow-lg p-14 w-full h-auto lg:w-[720px] lg:h-[720px]">
      <div className="flex flex-col mb-6">
        {number in badgeColors && (
          <div className={`${badgeColors[number]} text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3`}>
            {number}
          </div>
        )}
        <h3 className="text-2xl lg:text-4xl font-bold">{title[number]}</h3>
      </div>
      <p className="text-lg lg:text-xl mb-6">{description[number]}</p>
      {number === 1 ? (
        <OptionTutor />
      ) : (
        <div className="flex justify-center">
          <img
            className="border border-black rounded-lg w-full h-96 mx-5"
            src={img[number]}
            alt={number === 2 ? "Tutor teaching" : "Tutor working with student"}
          />
        </div>
      )}
    </div>
  );
}

export default Target;
