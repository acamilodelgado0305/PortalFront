import React, { useState, useEffect } from "react";

const PaymentHistory = ({ studentId }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) {
        return <p className="text-blue-600 font-medium">Loading payment history...</p>;
    }

    if (error) {
        return <p className="text-red-600 font-medium">{error}</p>;
    }

    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-lg border-[2px] border-black">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <div className="overflow-x-auto mt-4">
                <table className="table-auto border-collapse border border-gray-200 w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-1 py-2">Number</th>
                            <th className="border border-gray-300 px-1 py-2">Via</th>
                            <th className="border border-gray-300 px-3 py-2">Process</th>
                            <th className="border border-gray-300 px-3 py-2">Date</th>
                            <th className="border border-gray-300 px-2 py-2">Amount</th>
                            <th className="border border-gray-300 px-2 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment, index) => (
                            <tr key={payment.id}>
                                <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-2 py-2">PayPal</td>
                                <td className="border border-gray-300 px-3 py-2">Automatic</td>
                                <td className="border border-gray-300 px-2 py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                <td className="border border-gray-300 px-3 py-2">USD&nbsp;{payment.amount}</td>
                                <td
                                    className={`border border-gray-300 px-2 py-2 ${payment.status === "Completed" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {payment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
