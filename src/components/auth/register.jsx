import { useEffect, useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { verifyNumber } from "../../services/validations";

export const Register = ({selectedTeacher, closeRegisterModal, setInicioSesion}) => {

    const [classMode, setClassMode] = useState(null);
    const [manejoDatos, setManejoDatos] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail]= useState("");
   
    const showFormF =() => {
        console.log(email)
        if (email.length > 0) {
          setShowForm(true)
        } else {
          setShowForm(false)
          
        }
       
      }
       
      useEffect(() => {
        showFormF()
      }, [email])
      const onchangeData = async (data) => {
        data.preventDefault();
        const dataForm= Object.fromEntries( new FormData(data.target));
        if (!classMode) {
          return;
        }
        if (!dataForm.manejoDatos) {
          setManejoDatos(true)
          return;
        }
        setManejoDatos(false)
    
        if (!verifyNumber(dataForm.phone)) {
          console.log("es numero")
          return;
        }
        
       const student = {
        ...dataForm,
        idTeacher: selectedTeacher.id,
        status: false,
        modalidad:classMode
       }
       console.log(student)
       console.log(selectedTeacher)
       /*
       try {
       const result = await createStudent(dataForm)
       console.log(result);
       } catch (error) {
        console.log(error)
       }*/
      }
      
   
    return (
        <div className=" w-11/12 md:w-3/12 rounded-lg bg-white p-6 shadow-lg font-normal z-40">
        <div className=" w-full grid justify-items-center grid-cols-1 border-b">
          <div className="w-3/12 rounded-md ">
            <img className="rounded-2xl" src={selectedTeacher.profileImageUrl} alt="Teacher" />
          </div>
          <p className="text-sm">Aprende mas con el profesor  {selectedTeacher.firstName}</p>
        </div>
      <form
     onSubmit={(e) => onchangeData(e)}
       className="p-5 text-sm md:text-xs">
               {/* Encabezado de inicio de sesión */}
               <h2 className="text-lg font-bold text-center mb-3">Registrate</h2>

{/* Botones de inicio de sesión con redes sociales (sin color de fondo) */}
<div className="mb-6 text-sm">
    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
        <FaGoogle className="mr-2 text-red-500" /> {/* El icono de Google con sus colores */}
        Continuar con Google
    </button>
    <button className="w-full p-2 mb-3 border rounded-lg flex items-center justify-center">
        <FaFacebook className="mr-2 text-blue-600" /> {/* El icono de Facebook en azul */}
        Continuar con Facebook
    </button>
    <button className="w-full p-2 border rounded-lg flex items-center justify-center">
        <FaApple className="mr-2 text-black" /> {/* El icono de Apple en negro */}
        Continuar con Apple
    </button>
</div>
        <div className="mt-2  p-2 border rounded text-sm">
            <div 
            className="grid justify-items-center grid-cols-1  gap-7 md:gap-3  p-2 " action="">
                <input onInput={(e) => setEmail(e.target.value) } required name="email" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm  " placeholder="e-mail" type="text" />
                {
                  showForm &&
                  <div>
                  <input required name="name" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm  " placeholder="Enter Full Name" type="text" />
                  <input required name="phone" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm " placeholder="phone" type="text" />
                  <input required name="password" className="w-10/12 border-b rounded-md outline-none p-0.5 text-sm " placeholder="password" type="text" />
                </div> 
                }               
                 
            </div>
              <label className="text-xs" htmlFor="datos">
                <input className="" type="checkbox" name="manejoDatos" id="datos" /> I agree to the collection and use of my personal data in accordance with the privacy policy.
              </label>
              {manejoDatos&&<p>You must agree to the terms to continue</p>}
        </div>
        <div>
          
        </div>
        <div className="w-full flex justify-center m-3 text-xs"
        onClick={() => setInicioSesion(true)}
        >
          <p className="cursor-pointer underline decoration-sky-600 hover:text-blue-500">inicia sesion</p>
        </div>

        <div className="w-full flex justify-center m-3 text-xs">
           <div
             className="text-center cursor-pointer border w-28 rounded p-1 hover:bg-red-400 mr-20"
             onClick={()=>closeRegisterModal(null)}
            >
             cancel
           </div>

           <button
             className="w-5/12 bg-green-200 border rounded-md hover:bg-green-600"
             type="submit">
              Register 
           </button>
        </div>
      </form>  
      </div>
    )
}