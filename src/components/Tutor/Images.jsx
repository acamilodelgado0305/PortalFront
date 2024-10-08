
function Images() {
    const windowWidth = window.innerWidth;
    const isWideScreen = windowWidth < 800;
  return (
    <div className={`relative md:w-1/2 h-[500px] flex items-end justify-end`}>
    <div
      className="absolute bg-gray-200 rounded-lg shadow-lg"
      style={{
        width: '400px',
        height: '400px',
        top: '50px',
        left: isWideScreen ?'0px' : '60px',
        zIndex: 1
      }}>
      <img
        alt="Tutor"
        className="w-full h-full object-cover rounded-lg shadow-lg"
        src="https://randomuser.me/api/portraits/women/44.jpg"
      />
    </div>
    <div
      className="absolute bg-gray-200 rounded-lg shadow-lg"
      style={{
        width: '400px',
        height: '450px',
        top: '25px',
        left:isWideScreen ? '30px' : '90px',
        zIndex: 2
      }}>
      <img
        alt="Tutor"
        className="w-full h-full object-cover rounded-lg shadow-lg"
        src="https://randomuser.me/api/portraits/women/44.jpg"
      />
    </div>
    <div
      className="absolute bg-gray-200 rounded-lg shadow-lg"
      style={{
        width: '400px',
        height: '500px',
        top: '0',
        left: isWideScreen ? '60px' : '120px',
        zIndex: 3
      }}>
      <img
        alt="Tutor"
        className="w-full h-full object-cover rounded-lg shadow-lg"
        src="https://randomuser.me/api/portraits/women/44.jpg"
      />
      <div className="absolute bottom-2 right-2 flex flex-row items-end gap-3 z-4">
        <div className="bg-white text-black   rounded-sm px-2 py-1">
          Brianna
        </div>
        <div className="bg-[#5E47D3] text-white  rounded-sm px-2 py-1">
          English tutor
        </div>
      </div>
    </div>
  </div>
  )
}

export default Images