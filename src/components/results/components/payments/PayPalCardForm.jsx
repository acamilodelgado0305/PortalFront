import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalHostedFieldsProvider, PayPalHostedField } from '@paypal/react-paypal-js';
import axios from 'axios';

const PayPalCardForm = ({ amount }) => {
    const [clientToken, setClientToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Obtener clientToken del servidor
    useEffect(() => {
        const fetchClientToken = async () => {
            try {
                const response = await axios.get("http://localhost:4005/api/payments/get-client-token");
                setClientToken(response.data.clientToken);  // Guardamos el token
            } catch (error) {
                setErrorMessage('Error al obtener el Client Token.');
            }
        };
        fetchClientToken();
    }, []);

    if (!clientToken) {
        return <div>Cargando el Client Token...</div>;
    }

    return (
        <PayPalScriptProvider
            options={{
                "client-id": "Ad7F7AE1fhfG2q47qS7PDWuN2N0GfwV9_FMSbEV6mlveiomxe2_5K-xfVCngqz1TNBLuiiWrRreJmVSn",  // Asegúrate de usar tu client-id
                "components": "hosted-fields",
                "currency": "USD",
                "data-client-token": clientToken,  // Asegúrate de pasar el clientToken
            }}
        >
            <PayPalHostedFieldsProvider
                createOrder={(data, actions) => {
                    return fetch("/create-paypal-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount }),
                    })
                        .then(res => res.json())
                        .then(order => order.id);
                }}
                clientToken={clientToken}  // Aquí también pasamos el token
            >
                <PayPalHostedField
                    id="card-number"
                    className="border p-2 rounded w-full"
                    options={{ placeholder: "1234 1234 1234 1234" }}
                />
                <PayPalHostedField
                    id="expiration-date"
                    className="border p-2 rounded w-1/2"
                    options={{ placeholder: "MM/YY" }}
                />
                <PayPalHostedField
                    id="cvv"
                    className="border p-2 rounded w-1/2"
                    options={{ placeholder: "CVC" }}
                />
            </PayPalHostedFieldsProvider>
        </PayPalScriptProvider>
    );
};

export default PayPalCardForm;
