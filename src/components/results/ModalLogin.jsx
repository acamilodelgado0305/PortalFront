import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://back.app.esturio.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.accessToken, data.idToken, data.refreshToken);
        onClose();
      } else {
        console.error('Error en el inicio de sesión: ' + (data.message || 'Credenciales incorrectas'));
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Iniciar sesión
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              type="button"
              className="w-full border-2 border-black flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600"
            >
              <img src="/api/placeholder/24/24" alt="Google Logo" />
              Continuar con Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full border-2 border-black flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600"
            >
              Continuar con Facebook
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full border-2 border-black flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              Continuar con Apple
            </Button>
          </div>

          <div className="relative flex items-center">
            <span className="border-t flex-grow"></span>
            <span className="px-4 text-gray-500">o</span>
            <span className="border-t flex-grow"></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
              type="email"
              placeholder="Introduce tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-center"
                type={passwordVisible ? "text" : "password"}
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? 
                  <EyeOff className="text-gray-400 h-5 w-5" /> : 
                  <Eye className="text-gray-400 h-5 w-5" />
                }
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Recuérdame</label>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold"
            >
              Iniciar sesión
            </Button>
          </form>

          <div className="flex justify-between text-sm text-gray-600">
            <button className="hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
            <button className="hover:underline">
              Regístrate
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;