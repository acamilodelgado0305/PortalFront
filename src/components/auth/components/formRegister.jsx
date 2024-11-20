import { useEffect, useState } from "react";
import { Progress } from "antd";

export const FormRegister = ({ manejoDatos, setVerifyPassword }) => {
    const [password, setPassword] = useState("");
    const [estado, setEstado] = useState({});
    const [strengthLabel, setStrengthLabel] = useState("");

    const verificar = (password) => {
        const checks = {
            minuscula: /[a-z]/.test(password),
            mayuscula: /[A-Z]/.test(password),
            numero: /\d/.test(password),
            caracterEspecial: /[^a-zA-Z0-9]/.test(password),
            longitud: password.length >= 8,
        };
        setEstado(checks);
        return checks;
    };

    useEffect(() => {
        const checks = verificar(password);
        setVerifyPassword(checks);
        setStrengthLabel(getStrengthLabel());
    }, [password]);

    // Calcula el progreso y devuelve la etiqueta de fuerza
    const calculateStrength = () => {
        const checksCompleted = Object.values(estado).filter(Boolean).length;
        return (checksCompleted / 5) * 100;
    };

    const getStrengthLabel = () => {
        const strength = calculateStrength();
        if (strength === 100) return "Fuerte";
        if (strength >= 60) return "Moderada";
        if (strength > 0) return "Débil";
        return "";
    };

    return (
        <div className="p-4 w-full max-w-sm mx-auto bg-white rounded-md shadow-md">
            <div className="grid gap-5">
                {/* Input de email */}
                <input 
                    required
                    name="email"
                    className="w-full border border-black rounded-md outline-none p-2 text-sm"
                    placeholder="e-mail"
                    type="text"
                />
                
                {/* Input de contraseña */}
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    name="password"
                    className="w-full border border-black rounded-md outline-none p-2 text-sm"
                    placeholder="password"
                    type="password"
                />
            </div>

            {/* Barra de fuerza de contraseña */}
            <Progress
                percent={calculateStrength()}
                showInfo={false}
                strokeColor={{
                    "0%": "#ff4d4f",
                    "50%": "#faad14",
                    "100%": "#52c41a"
                }}
                className="w-full mt-3"
            />
            
            {/* Etiqueta de fuerza */}
            <p className={`text-xs mt-1 font-semibold ${strengthLabel === 'Fuerte' ? 'text-purple-500' : strengthLabel === 'Moderada' ? 'text-yellow-500' : 'text-red-500'}`}>
                {strengthLabel}
            </p>

            {/* Mensaje de advertencia si la contraseña es débil */}
            {strengthLabel === "Débil" && (
                <p className="text-red-500 text-xs mt-2">
                    La contraseña debe contener mayúsculas, minúsculas, números, símbolos y al menos 8 caracteres.
                </p>
            )}

         
            {/* Checkbox de manejo de datos */}
            <div className="mt-4">
                <label className="text-xs flex items-center" htmlFor="datos">
                    <input
                        type="checkbox"
                        name="manejoDatos"
                        id="datos"
                        className="mr-2"
                    />
                    Acepta nuestras políticas de manejo de datos para continuar.
                </label>
                {manejoDatos && (
                    <p className="text-red-500 text-xs mt-1">
                        Por favor, acepta las políticas de manejo de datos para continuar.
                    </p>
                )}
            </div>
        </div>
    );
};
