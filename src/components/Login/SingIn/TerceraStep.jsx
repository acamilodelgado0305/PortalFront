function TerceraStep() {
    return (
      <div className="mx-[4rem]  md:mx-[10rem]">
        <h2 className="text-[30px] text-violet-600 text-center">Registration Form</h2>
        <div className="h-auto border-1 border-dashed border-[#dbc9fa91] ">
          <div className=" p-4 bg-[#dbc9fa91]">
            <h4 className="text-[25px] text-violet-600 text-center ">Presentation Title</h4>
           
          </div> <textarea
              className="w-full bg-[#dbc9fa91] h-[30vh] mt-2 p-4 text-violet-400 focus:outline-none focus:border-violet-800 text-[20px] text-center"
              placeholder="Write what you wish..."
        
            />
        </div>
      </div>
    );
  }
  
  export default TerceraStep;
  