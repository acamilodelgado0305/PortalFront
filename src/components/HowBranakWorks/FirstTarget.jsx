import OptionTutor from "./OptionTutor"

function FirstTarget({number, title, description, img}) {
  return (
    <div className="bg-white border border-black rounded-lg shadow-md p-14 w-full h-auto lg:w-[720px] lg:h-[720px]">
    <div className="flex flex-col mb-6">
        {/* hasta aqui es igual */}

      { number == 1 &&
      <div className="bg-green-300 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
        1
      </div> }

      { number == 2 && 
     <div className="bg-yellow-300 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
             2
      </div>
      }

      {
        number == 3 &&      
    <div className="bg-blue-500 text-black font-bold text-5xl w-16 h-16 rounded-md flex items-center justify-center mb-3">
        3
      </div>

      }
      <h3 className="text-2xl lg:text-4xl font-bold">{title}</h3>
    </div>
    <p className="text-lg lg:text-xl mb-6">
      {description}
    </p>
    { number == 1 ?   
    <OptionTutor/> :
    <div className="flex justify-center">
    <img
      className="border border-black rounded-lg w-full h-96 mx-5"
      src={img}
      alt="Tutor teaching"
    />
    </div>
    }


  </div>
  )
}

export default FirstTarget