import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { CreditCardOutlined, BankOutlined } from "@ant-design/icons";
const Pay = ({ teacher, user, daySelected, hourSelected, hourSelectedTeacher, hourValue }) => {
    const [currentView, setCurrentView] = useState("menu"); // Controla la vista actual del componente
    const [selectedMethod, setSelectedMethod] = useState(null);
    const renderMenu = () => (
        <div className="flex flex-col bg-white rounded-lg w-full max-w-md border-2 border-black p-2">
            <div className="flex flex-col gap-4 w-full p-8 mb-20">
                <img
                    src={user?.profileImageUrl || "/src/components/StandardMessages/humanicon.svg"}
                    className="w-20 h-20"
                    alt="User Icon"
                />
                <h1> {user.firstName} {user.lastName}</h1>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow transition mt-8"
                    onClick={() => setCurrentView("proceedToPayment")}
                >
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-800">Proceed to Payment</h3>

                    </div>
                    <span className="text-purple-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow transition"
                    onClick={() => setCurrentView("paymentSettings")}
                >
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-800">Payment Settings</h3>

                    </div>
                    <span className="text-purple-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow transition"
                    onClick={() => setCurrentView("billing")}
                >
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-800">Billing</h3>

                    </div>
                    <span className="text-purple-600 text-xl font-semibold">→</span>
                </button>
                <button
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow transition"
                    onClick={() => setCurrentView("paymentHistory")}
                >
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-800">Payment History</h3>

                    </div>
                    <span className="text-purple-600 text-xl font-semibold">→</span>
                </button>
            </div>
            <div className="flex gap-6 items-center mx-8">
                <h1 className="flex-grow text-lg">Direct assistant</h1>
                <button
                    className="w-28 bg-purple-600 text-white py-2 rounded-[28px] text-lg font-semibold hover:bg-purple-400 transition"
                    onClick={() => setCurrentView("proceedToPayment")}
                >
                    Pay now
                </button>
            </div>

        </div>
    );

    const renderProceedToPayment = () => (
        <div className="flex flex-col  bg-white shadow-lg rounded-lg p-4 w-full max-w-lg border-[1px] border-black">
            <div className=" text-left">
                <button
                    className="text-purple-600 text-right"
                    onClick={() => setCurrentView("menu")}
                >
                    <span className="text-purple-600 font-bold  text-4xl">←</span>
                </button>
            </div>
            <div className=" flex  flex-col items-center p-10 mb-48">
                <h2 className="text-2xl mb-8">Proceed to Payment</h2>
                <p className="text-4xl font-bold text-gray-800 mb-14">
                    USD {parseFloat(hourValue).toFixed(2)}
                </p>
                <button
                    className="w-36 bg-purple-600 text-white py-3 mb-8 rounded-[28px] text-lg font-semibold hover:bg-purple-400 transition"
                    onClick={() => {
                        console.log("Switching to Payment Options");
                        setCurrentView("paymentOptions");
                    }}
                >
                    Pay Now
                </button>
            </div>


        </div>
    );

    const renderPaymentOptions = () => {
        console.log("Rendering Payment Options");

        return (
            <div className="flex flex-col  bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border-2 border-black">
                <div className="flex flex-col items-start gap-4">
                    <button
                        className="text-purple-600 "
                        onClick={() => setCurrentView("proceedToPayment")}
                    >
                        <span className="text-purple-600 font-bold text-4xl">←</span>
                    </button>
                    <img
                        src={"/src/assets/caba.png"}
                        className="w-10 h-12"
                        alt="User Icon"
                    />
                </div>

                <h2 className=" flex flex-col items-center text-2xl font-semibold  mb-4">Payment Options</h2>
                <div className="flex flex-col gap-6 p-8">
                    {/* Opción de Tarjeta de Crédito */}
                    <div
                        className={`flex items-center gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100 ${selectedMethod === "creditCard" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setSelectedMethod("creditCard")}
                    >
                        <span className="text-purple-600 text-xl ">
                            {selectedMethod === "creditCard" ? "●" : "○"}
                        </span>
                        <CreditCardOutlined style={{ fontSize: '36px', color: '#9333EA' }} />
                        <p className="text-lg font-semibold">Credit Card</p>
                    </div>

                    {/* Opción de PayPal */}
                    <div className="p-4 rounded-lg border shadow-md flex items-center gap-4">
                        <span className="text-purple-600 text-xl">
                            {selectedMethod === "paypal" ? "●" : "○"}
                        </span>
                        <div className="flex-1">
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: hourValue,
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
                                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                                        })
                                        .catch((error) => console.error("Payment error:", error));
                                }}
                                onError={(error) => {
                                    console.error("PayPal error:", error);
                                }}
                            />
                        </div>
                    </div>


                    {/* Opción de Transferencia Bancaria */}
                    <div
                        className={`flex items-center gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100 ${selectedMethod === "bank" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setSelectedMethod("bank")}
                    >
                        <span className="text-purple-600 text-xl">
                            {selectedMethod === "bank" ? "●" : "○"}
                        </span>
                        <BankOutlined style={{ fontSize: '36px', color: '#9333EA' }} />
                        <p className="text-lg font-semibold">Bank Transfer</p>
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