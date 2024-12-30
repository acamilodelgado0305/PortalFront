import React from "react";
import PaymentHistory from "./components/PaymentHistory";

const Payment = ({ user }) => {
    return (
        <div className="App">
            {/* Renderiza el historial de pagos directamente */}
            <PaymentHistory studentId={user.id} />
        </div>
    );
};

export default Payment;