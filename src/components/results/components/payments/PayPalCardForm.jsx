import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields } from "@paypal/react-paypal-js";

const PayPalCardForm = ({ amount }) => {
    const [savingCard, setSavingCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [cardSaved, setCardSaved] = useState(false);
    const [clientToken, setClientToken] = useState(null); // Almacenamos el clientToken

    useEffect(() => {
        const fetchClientToken = async () => {
            try {
                const response = await fetch("http://localhost:4005/api/payments/get-client-token");
                const data = await response.json();
                console.log("Client Token recibido:", data.clientToken); // Verifica que se recibe el token
                if (data.clientToken) {
                    setClientToken(data.clientToken); // Almacena el clientToken
                }
            } catch (error) {
                setErrorMessage("Error al obtener el Client Token.");
            }
        };
        fetchClientToken();
    }, []); // Solo se ejecuta una vez cuando el componente se monta

    if (!clientToken) {
        return <div>Cargando el Client Token...</div>; // Mostrar mientras se obtiene el token
    }

    const SubmitButton = () => {
        const hostedFields = usePayPalHostedFields();

        const handlePayment = async () => {
            if (!hostedFields || !hostedFields.submit) return;
            setSavingCard(true);

            try {
                const order = await fetch("/create-paypal-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                }).then((res) => res.json());

                const { orderId } = order;
                const { liabilityShift, authenticationStatus } = await hostedFields.submit({ orderId });

                if (liabilityShift !== "NO" && authenticationStatus !== "FAILED") {
                    setCardSaved(true);
                } else {
                    throw new Error("Error verificando la tarjeta.");
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setSavingCard(false);
            }
        };

        return (
            <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                disabled={savingCard || !clientToken}
            >
                {savingCard ? "Procesando..." : `Confirmar pago - $${amount}`}
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-4 p-4 rounded-lg border shadow-md">
            <h2 className="text-lg font-semibold">Pagar con Tarjeta (PayPal)</h2>

            <PayPalScriptProvider
                options={{
                    "client-id": "Ad7F7AE1fhfG2q47qS7PDWuN2N0GfwV9_FMSbEV6mlveiomxe2_5K-xfVCngqz1TNBLuiiWrRreJmVSn",
                    "components": "buttons,hosted-fields",
                    "environment": "sandbox", // Revisa que esté en el entorno adecuado
                }}
            >
                <PayPalHostedFieldsProvider
                    createOrder={() => {
                        return fetch("/create-paypal-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ amount }),
                        })
                            .then((res) => res.json())
                            .then((order) => order.id);
                    }}
                    clientToken={clientToken}  // Pasa el clientToken a Hosted Fields
                >
                    {/* Campos de la tarjeta */}
                    <div className="p-2 border rounded-lg shadow-sm">
                        <PayPalHostedField
                            id="card-number"
                            className="border p-2 rounded w-full"
                            options={{ selector: "#card-number", placeholder: "1234 1234 1234 1234" }}
                        />
                        <div className="flex gap-2 mt-2">
                            <PayPalHostedField
                                id="expiration-date"
                                className="border p-2 rounded w-1/2"
                                options={{ selector: "#expiration-date", placeholder: "MM/YY" }}
                            />
                            <PayPalHostedField
                                id="cvv"
                                className="border p-2 rounded w-1/2"
                                options={{ selector: "#cvv", placeholder: "CVC" }}
                            />
                        </div>
                    </div>

                    {/* Checkbox para guardar la tarjeta */}
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        Guardar esta tarjeta para futuros pagos
                    </label>

                    {/* Botón de pago */}
                    <SubmitButton />
                </PayPalHostedFieldsProvider>
            </PayPalScriptProvider>

            {/* Mensajes de error */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {cardSaved && <p className="text-green-500">Tarjeta guardada exitosamente.</p>}
        </div>
    );
};

export default PayPalCardForm;
