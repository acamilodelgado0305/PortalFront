import React from "react";
import TeacherPaymentHistory from "./components/TeacherPaymentHistory";

const PaymenTeacher = ({ user }) => {
    return (
        <div className="App">
            {/* Renderiza el historial de pagos directamente */}
            <TeacherPaymentHistory teacherId={user.id} />
        </div>
    );
};

export default PaymenTeacher;