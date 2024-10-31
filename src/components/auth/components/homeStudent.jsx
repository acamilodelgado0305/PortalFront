export const HomeStudent = ({closeRegisterModal}) => {
    return(
        <div className="w-10/12 h-[500px] bg-white border  grid justify-items-center grid-cols-1 rounded">
            
            <div>tu registro se a realizado exitosamente</div>
            <div onClick={() => closeRegisterModal()} className="w-[100px] h-[40px] bg-green-300 cursor-pointer border rounded text-center p-1">ir al home</div>

        </div>
    )
}