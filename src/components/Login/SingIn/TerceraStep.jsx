function TerceraStep({handleRegisterStatus}) {
  return (
    <div className="mx-[4rem] md:mx-[10rem] py-6 mt-[10vh]">
      <h2 className="text-[30px] md:text-[38px] text-violet-600 text-center">Registration Form</h2>
      <div className="h-auto w-[80%]  lg:w-[50%] m-auto border-1 border-dashed border-[#dbc9fa91]">
        <div>
          <input
            type="text"
            className="w-[100%] h-[100%] bg-[#dbc9fa91] p-6 text-[25px] text-violet-600 text-center mt-2 bg-[#dbc9fa91] placeholder-violet-400 duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="name"
            required
            placeholder="Presentation Title"
          />
        </div>
        {/* Se agregaron los mismos efectos al textarea */}
        <textarea
          className="w-full bg-[#dbc9fa91] h-[30vh] mt-2 p-6 text-[25px] text-violet-600 text-center placeholder-violet-400 duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Write what you wish..."
        />
        <div>
        <button
          onClick={handleRegisterStatus}
          className="mt-4 bg-violet-600 text-white rounded p-2  w-[120px] transition duration-200 hover:bg-violet-800"
        >
          Send
        </button>
        </div>
      </div>
    </div>
  );
}

export default TerceraStep;


  