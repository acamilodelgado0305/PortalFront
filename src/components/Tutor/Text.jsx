function Text() {
  const windowWidth = window.innerWidth;
  const isWideScreen = windowWidth < 800;
  return (
    <div className="flex flex-col justify-center md:w-1/2 h-[10rem] ml-32" style={{marginTop:isWideScreen && '-180px'}}>
            <p className="text-3xl font-bold italic text-purple-500">
              "The energy she brings to each lesson is amazing."
            </p>
            <p className="text-gray-600 font-semibold mt-2">Ismael</p>
            <p className="text-gray-500" >English learner on Esturio</p>
          </div>
  )
}

export default Text