import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const PaymentHistory = ({ studentId }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch(`https://back.app.esturio.com/api/transactions/studentId/${studentId}`);
                if (!response.ok) {
                    throw new Error("Error fetching payment history");
                }
                const data = await response.json();
                setPaymentHistory(data.data || []);
            } catch (error) {
                console.error("Error fetching payment history:", error);
                setError("Failed to load payment history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [studentId]);

    const openModal = (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPayment(null);
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <p className="text-blue-600 font-medium text-lg">Loading payment history...</p>;
    }

    if (error) {
        return <p className="text-red-600 font-medium text-lg">{error}</p>;
    }

    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto border-[2px] border-gray-300">
            <h2 className="text-3xl font-bold mb-6 text-center">Payment History</h2>
            <div className="overflow-x-auto mt-4">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left text-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-3">Number</th>
                            <th className="border border-gray-300 px-4 py-3">Payer</th>
                            <th className="border border-gray-300 px-4 py-3">Amount</th>
                            <th className="border border-gray-300 px-4 py-3">Date</th>
                            <th className="border border-gray-300 px-4 py-3">Status</th>
                            <th className="border border-gray-300 px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment, index) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-3">{payment.payerName}</td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {payment.currency} {payment.amount}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </td>
                                <td
                                    className={`border border-gray-300 px-4 py-3 ${payment.status === "Completed" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                                        }`}
                                >
                                    {payment.status}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <button
                                        className="text-blue-600 underline hover:text-blue-800"
                                        onClick={() => openModal(payment)}
                                    >
                                        View More
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para mostrar detalles adicionales */}
            {selectedPayment && (
                <Modal
                    title={<h2 className="text-2xl font-bold">Payment Details</h2>}
                    visible={isModalOpen}
                    onCancel={closeModal}
                    footer={null}
                    width={600}
                >
                    <div className="text-lg">
                        <p><strong>Payer Name:</strong> {selectedPayment.payerName}</p>
                        <p><strong>Email:</strong> {selectedPayment.payerEmail}</p>
                        <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
                        <p><strong>Amount:</strong> {selectedPayment.currency} {selectedPayment.amount}</p>
                        <p><strong>Class Time:</strong> {selectedPayment.classDetails.hour}</p>
                        <p><strong>Class Date:</strong> {selectedPayment.classDetails.day}</p>
                        <p><strong>Teacher Availability:</strong> {selectedPayment.classDetails.teacherAvailability}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PaymentHistory;
