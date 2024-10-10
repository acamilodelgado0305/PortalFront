const TutorCard = (props) => {
    const { imgSrc, name, subject, rating, languages } = props;
    return (
      <div className={`bg-white rounded-lg p-4 mb-4`}>
        <div className="flex items-center mb-2">
          <img className="w-12 h-12 rounded-md mr-3" src={imgSrc} alt={`Tutor ${name}`} />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-gray-500 text-sm">{subject}</p>
          </div>
          <span className="ml-auto font-semibold">{rating} ⭐</span>
        </div>
        <p className="text-gray-500 text-sm">{languages}</p>
      </div>
    );
  };



function OptionTutor() {
  const tutors = [
    {
      imgSrc: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Milena",
      subject: "French tutor",
      rating: "4.9",
      languages: "Speaks French (Native), English (Advanced) +2",
    },
    {
      imgSrc: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "John",
      subject: "Spanish tutor",
      rating: "4.8",
      languages: "Speaks Spanish (Native), English (Intermediate)",
    }
  ];
  return (
    <div>
      {tutors.map((tutor, index) => (
        <TutorCard key={index} {...tutor} />
      ))}
    </div>
  );
}


export default OptionTutor;
