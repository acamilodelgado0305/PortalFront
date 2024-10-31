import { useEffect, useState } from "react";

export const FormRegister = ({ manejoDatos, setVerifyPassword}) => {

        const [array, setArray] = useState(""); // Estado para el array
        const [estado, setEstado] = useState({}); 
      
        const verificar = (array) => {
          setEstado({
            minuscula:  /[a-z]/.test(array),
            mayuscula:  /[A-Z]/.test(array),
            numero:  /\d/.test(array),
            caracterEspecial:  /[^a-zA-Z0-9]/.test(array),
            longitud: array.length > 8
          });

          return{
            minuscula:  /[a-z]/.test(array),
            mayuscula:  /[A-Z]/.test(array),
            numero:  /\d/.test(array),
            caracterEspecial:  /[^a-zA-Z0-9]/.test(array),
            longitud: array.length > 8
          }
        };
      useEffect(() => {
           setVerifyPassword(verificar(array))
      }, [array])
    return (
        <div>
            <div 
            className="grid justify-items-center grid-cols-1  gap-7 md:gap-3  p-2 " action="">
                <input  required name="email" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm  " placeholder="e-mail" type="text" />
                  <input
                   onChange={(e) => setArray(e.target.value)}
                  required name="password" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm " placeholder="password" type="text" /> 
            </div>
            <div className="font-thin text-xs flex gap-3">
        <p className={estado.minuscula ? "text-green-500 hidden" : "text-red-500"}>
          Minú *
        </p>
        <p className={estado.mayuscula ? "text-green-500 hidden" : "text-red-500"}>
          Mayú *
        </p>
        <p className={estado.numero ? "text-green-500 hidden" : "text-red-500"}>
          Núm *
        </p>
        <p className={estado.caracterEspecial ? "text-green-500 hidden" : "text-red-500"}>
          CarEs *
        </p>
        <p className={estado.caracterEspecial ? "text-green-500 hidden" : "text-red-500"}>
          long 8 *
        </p>
      </div>
              <label className="text-xs" htmlFor="datos">
                <input className="" type="checkbox" name="manejoDatos" id="datos" /> Acepta nuestras políticas de manejo de datos para continuar.
              </label>
              {manejoDatos&&<p>Por favor, acepta las políticas de manejo de datos para continuar.</p>}
            </div>

    )
}