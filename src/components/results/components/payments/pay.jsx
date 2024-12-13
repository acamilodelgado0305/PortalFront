import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Pay = () => {
    const [currentView, setCurrentView] = useState("menu"); // Controla la vista actual del componente
    const [selectedMethod, setSelectedMethod] = useState(null);
    const renderMenu = () => (
        <div className="flex flex-col  bg-white rounded-lg  w-full max-w-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Payment Account</h2>
            <div className="flex flex-col gap-4 w-full">
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow transition"
                    onClick={() => setCurrentView("proceedToPayment")}
                >
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Proceed to Payment</h3>
                        <p className="text-sm text-gray-600">Complete your pending payment.</p>
                    </div>
                    <span className="text-blue-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow transition"
                    onClick={() => setCurrentView("paymentSettings")}
                >
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Payment Settings</h3>
                        <p className="text-sm text-gray-600">Set your preferred payment method.</p>
                    </div>
                    <span className="text-blue-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow transition"
                    onClick={() => setCurrentView("billing")}
                >
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Billing</h3>
                        <p className="text-sm text-gray-600">Review your billing information.</p>
                    </div>
                    <span className="text-blue-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow transition"
                    onClick={() => setCurrentView("paymentHistory")}
                >
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Payment History</h3>
                        <p className="text-sm text-gray-600">View your past payments.</p>
                    </div>
                    <span className="text-blue-600 text-xl font-semibold">→</span>
                </button>
            </div>
            <button
                className="w-full bg-blue-600 text-white py-3 mt-6 rounded-lg text-lg font-semibold hover:bg-blue-500 transition"
                onClick={() => setCurrentView("proceedToPayment")}
            >
                Continue to Payment
            </button>
        </div>
    );

    const renderProceedToPayment = () => (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Proceed to Payment</h2>
            <p className="text-lg text-gray-800 mb-6">USD 420.00</p>
            <button
                className="w-full bg-blue-600 text-white py-3 mb-4 rounded-lg text-lg font-semibold hover:bg-blue-500 transition"
                onClick={() => {
                    console.log("Switching to Payment Options");
                    setCurrentView("paymentOptions"); // Cambia a "paymentOptions" en lugar de "billingInfo"
                }}
            >
                Pay Now
            </button>
            <button
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setCurrentView("menu")}
            >
                Back
            </button>
        </div>
    );

    const renderPaymentOptions = () => {
        console.log("Rendering Payment Options");

        return (
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4">Payment Options</h2>
                <button
                    className="self-start text-purple-600 mb-4 hover:underline"
                    onClick={() => setCurrentView("proceedToPayment")}
                >
                    ← Back
                </button>
                <div className="flex flex-col gap-6">
                    {/* Opción de Tarjeta de Crédito */}
                    <div
                        className={`flex items-center gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100 ${selectedMethod === "creditCard" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setSelectedMethod("creditCard")}
                    >
                        <span className="text-green-600 text-xl">
                            {selectedMethod === "creditCard" ? "●" : "○"}
                        </span>
                        <img
                            src="/path/to/credit-card-icon.png"
                            alt="Credit Card"
                            className="w-8 h-8"
                        />
                        <p className="text-lg">Credit Card</p>
                    </div>

                    {/* Opción de PayPal */}
                    <div className="p-4 rounded-lg border shadow-md">
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: "204.00", // Cambia este valor al monto dinámico
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order
                                    .capture()
                                    .then((details) => {
                                        console.log("Payment successful:", details);
                                        alert(
                                            `Transaction completed by ${details.payer.name.given_name}`
                                        );
                                    })
                                    .catch((error) => console.error("Payment error:", error));
                            }}
                            onError={(error) => {
                                console.error("PayPal error:", error);
                            }}
                        />
                    </div>

                    {/* Opción de Transferencia Bancaria */}
                    <div
                        className={`flex items-center gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100 ${selectedMethod === "bank" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setSelectedMethod("bank")}
                    >
                        <span className="text-green-600 text-xl">
                            {selectedMethod === "bank" ? "●" : "○"}
                        </span>
                        <img
                            src="/path/to/bank-icon.png"
                            alt="Bank"
                            className="w-8 h-8"
                        />
                        <p className="text-lg">Bank Transfer</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderPaymentSettings = () => (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Payment Settings</h2>
            <p className="text-gray-600 mb-6">Select or configure your preferred payment method:</p>
            <ul className="text-left w-full text-gray-800">
                <li className="mb-2">- PayPal</li>
                <li className="mb-2">- Credit Card</li>
                <li className="mb-2">- Bank Transfer</li>
            </ul>
            <button
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setCurrentView("menu")}
            >
                Back
            </button>
        </div>
    );

    const renderBilling = () => (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Billing</h2>
            <p className="text-gray-600 mb-4">Make sure you have paid for your class.</p>
            <p className="text-xl font-semibold text-gray-800 mb-6">USD 204.00</p>
            <button
                className="w-full bg-blue-600 text-white py-3 mb-4 rounded-lg text-lg font-semibold hover:bg-blue-500 transition"
                onClick={() => {
                    console.log("Switching to Payment Options");
                    setCurrentView("paymentOptions"); // Cambia a la vista de opciones de pago
                }}
            >
                Pay Now
            </button>
            <button
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setCurrentView("menu")}
            >
                Back
            </button>
        </div>
    );

    const renderPaymentHistory = () => (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Payment History</h2>
            <table className="w-full border-collapse border border-gray-300 text-left mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Number</th>
                        <th className="border border-gray-300 px-4 py-2">Via</th>
                        <th className="border border-gray-300 px-4 py-2">Process</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">2205130</td>
                        <td className="border border-gray-300 px-4 py-2">PayPal</td>
                        <td className="border border-gray-300 px-4 py-2">Automatic</td>
                        <td className="border border-gray-300 px-4 py-2">08-19-22</td>
                        <td className="border border-gray-300 px-4 py-2">$100.02</td>
                        <td className="border border-gray-300 px-4 py-2 text-green-600">Paid</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">2204121</td>
                        <td className="border border-gray-300 px-4 py-2">Card 6023</td>
                        <td className="border border-gray-300 px-4 py-2">Manual</td>
                        <td className="border border-gray-300 px-4 py-2">08-17-22</td>
                        <td className="border border-gray-300 px-4 py-2">$600.00</td>
                        <td className="border border-gray-300 px-4 py-2 text-green-600">Paid</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">2203122</td>
                        <td className="border border-gray-300 px-4 py-2">Card 6023</td>
                        <td className="border border-gray-300 px-4 py-2">Automatic</td>
                        <td className="border border-gray-300 px-4 py-2">08-16-22</td>
                        <td className="border border-gray-300 px-4 py-2">$600.00</td>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">Failed</td>
                    </tr>
                </tbody>
            </table>
            <button
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setCurrentView("menu")}
            >
                Back
            </button>
        </div>
    );

    return (
        <div className="flex justify-center items-center bg-gray-50 py-8">
            {currentView === "menu" && renderMenu()}
            {currentView === "proceedToPayment" && renderProceedToPayment()}
            {currentView === "paymentSettings" && renderPaymentSettings()}
            {currentView === "billing" && renderBilling()}
            {currentView === "paymentOptions" && renderPaymentOptions()}
            {currentView === "paymentHistory" && renderPaymentHistory()}
        </div>
    );
};

export default Pay;