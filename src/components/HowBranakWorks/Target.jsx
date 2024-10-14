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
    3: "Speak. Read. Write. Repeat.",
  };

  const description = {
    1: "Your tutor will guide the way through your first lesson and help you plan your next steps.",
    2: " We'll connect you with a tutor who will motivate, challenge, and inspire you.",
    3: "Choose how many lessons you want to take each week and get ready to reach your goals!",
  };

  const img = {
    2: "https://randomuser.me/api/portraits/men/32.jpg",
    3: "https://randomuser.me/api/portraits/men/45.jpg",
  };
  return (
    <div className="bg-[#d2edf769] h-auto w-full rounded-lg p-10 md:p-14 shadow-lg">
      <div className="mb-6 flex flex-col">
        {number in badgeColors && (
          <div
            className={`${badgeColors[number]} mb-3 flex h-16 w-16 items-center justify-center rounded-md text-5xl font-bold text-white`}
          >
            {number}
          </div>
        )}
        <h3 className="text-2xl font-bold lg:text-4xl">{title[number]}</h3>
      </div>
      <p className="mb-6 text-lg lg:text-xl">{description[number]}</p>
      {number === 1 ? (
        <OptionTutor />
      ) : (
        <div className="flex justify-center">
          <img
            className="mx-5 h-[20rem] w-full rounded-lg"
            src={img[number]}
            alt={number === 2 ? "Tutor teaching" : "Tutor working with student"}
          />
        </div>
      )}
    </div>
  );
}

export default Target;
