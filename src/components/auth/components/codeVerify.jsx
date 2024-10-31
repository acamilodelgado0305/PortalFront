export const CodeVerify = ({setCode}) => {
    return (
        <div className="grid justify-items-center grid-cols-1 pl-8 pr-8">
            <div className="flex gap-4 flex-wrap justify-center">
                <input onChange={(e) =>setCode(e.target.value)} maxLength={6} className="w-10/12 border border-black rounded-md outline-none p-2 text-sm" type="text" name="1" id="" />
                
            </div>
            <p className="text-sx mt-2 text-center">Ingresa el codigo que llego a tu correo</p>
        </div>
    )
}