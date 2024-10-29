
function ProgressBar({progressRef,progressWidth, handleMouseDown }) {
  return (
    <div className='absolute bottom-4 w-full px-[20px]'>
                {/* Línea blanca que muestra el fondo del progreso */}
                <div className="h-[4px] bg-white w-full rounded"  ref={progressRef}/>
                {/* Línea violeta que muestra el progreso */}
                <div 
                    className="h-[6px] bg-[#4B2B94] rounded mt-[-5px]" 
                    style={{ width: `${progressWidth}%` }}   onMouseDown={handleMouseDown}
                />
            </div>
  )
}

export default ProgressBar