import React, { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Modal, Spin, Table, Button, Popconfirm } from "antd"; // Importa el componente Modal de antd
import { CreditCardOutlined, BankOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import humanIcon from "../../../../../src/assets/humanicon.svg";
import BraintreeDropIn from "./dropContaine";
import PaymentSuccessCheck from "./checkAnimation";

const Pay = ({ teacher, user, daySelected, hourSelected, hourSelectedTeacher, hourValue }) => {
    const [currentView, setCurrentView] = useState("menu"); // Controla la vista actual del componente
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPayPalButtons, setShowPayPalButtons] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [editingCard, setEditingCard] = useState(false);
    const [isAutomatic, setIsAutomatic] = useState(false); // Estado de pago automático
    const [selectedPriority, setSelectedPriority] = useState({}); // Prioridad de tarjetas
    const [selectedCycle, setSelectedCycle] = useState("Monthly");
    const [isEventCardTemp, setIsEventCardTemp] = useState({ event: false, data: null });
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiration: "",
        cvv: "",
        firstName: "",
        lastName: "",
        country: "",
        billingAddress1: "",
        billingAddress2: "",
    });

    const [tempData, setTempData] = useState([]);

    const maxCards = Math.min(savedCards.length, 3);
    const maxCardsTemp = Math.min(tempData.length, 3);
    // Manejar el cambio de prioridad de tarjeta
    const handlePriorityChange = (cardNumber, priority) => {
        setSelectedPriority((prev) => ({
            ...prev,
            [cardNumber]: prev[cardNumber] === priority ? null : priority,
        }));
    };

    const handleEditCard = (card) => {
        setCardDetails(card);
        setEditingCard(card);
        setCurrentView("addCreditCard");
    };
    const cancelCardDetails = () => {

        setCardDetails({
            number: "",
            expiration: "",
            cvv: "",
            firstName: "",
            lastName: "",
            country: "",
            billingAddress1: "",
            billingAddress2: "",
        });

        //Resetear estado de edición y redirigir
        setEditingCard(false);
        setCurrentView("paymentOptions");
        setSelectedMethod(null)
    };

    const fetchSavedCards = async () => {
        setIsLoadingCards(true);
        try {
            const response = await fetch(`https://back.app.esturio.com/api/card/user/${user.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch saved cards");
            }
            const data = await response.json();
            setSavedCards(data.data || []);
            console.log("datostargeta", data)
            // Asegúrate de que el campo sea el correcto
        } catch (error) {
            console.error("Error fetching saved cards:", error);
        } finally {
            setIsLoadingCards(false);
        }
    };
    useEffect(() => {

        if (user.id) {
            fetchSavedCards();
        }
    }, [user.id]);

    const handleViewOtherMethods = () => {
        setSelectedMethod(null); // Restablecer para mostrar todas las opciones
    };
    const confirmDetails = () => {
        saveCardDetails();
    }

    const saveCardDetails = async () => {

        // Verificar que tempData no esté vacío
        if (tempData.length === 0) {
            alert("No cards to save. Please add at least one card.");
            return;
        }

        // Validar cada tarjeta en tempData
        for (const card of tempData) {
            const { number, expiration, cvv, firstName, lastName, country, billingAddress1 } = card;

            // Verificar campos obligatorios
            if (!number || !expiration || !cvv || !firstName || !lastName || !country || !billingAddress1) {
                alert(`Please fill in all required fields for the card ending with ${number.slice(-4)}.`);
                return;
            }

            // Verificar formato del número de tarjeta 
            if (number.replace(/\s/g, "").length !== 16) {
                alert(`Invalid card number for the card ending with ${number.slice(-4)}.`);
                return;
            }

            // Verificar formato del CVV (3 o 4 dígitos)
            if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
                alert(`Invalid CVV for the card ending with ${number.slice(-4)}.`);
                return;
            }
            delete card.id;
        }

        try {
            // Enviar cada tarjeta en tempData al servidor una por una
            for (const card of tempData) {
                // Formatear los datos de la nueva tarjeta
                const newCard = {
                    number: card.number.trim(),
                    expiration: card.expiration.trim(),
                    cvv: card.cvv.trim(),
                    firstName: card.firstName.trim(),
                    lastName: card.lastName.trim(),
                    country: card.country.trim(),
                    billingAddress1: card.billingAddress1.trim(),
                    billingAddress2: card.billingAddress2 ? card.billingAddress2.trim() : "",
                    userId: user.id,
                    position: selectedPriority[card.number],
                    automatic: isAutomatic,
                    billinperiod: selectedCycle
                };
                const response = await fetch("https://back.app.esturio.com/api/card/cards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCard), // Enviar una tarjeta a la vez
                });

                if (!response.ok) {
                    // Manejar errores HTTP (como 400, 500, etc.)
                    const errorData = await response.json();
                    console.error("HTTP error:", errorData);
                    alert(`Failed to save the card ending with ${card.number.slice(-4)}. ${errorData.message || "Please try again."}`);
                    return; // Detener el proceso si hay un error
                }

                const result = await response.json();

                if (!result.success) {
                    // Manejar el caso en el que la respuesta del servidor no sea exitosa
                    console.error("Server error:", result.message);
                    alert(`Failed to save the card ending with ${card.number.slice(-4)}. ${result.message || "Please try again."}`);
                    return; // Detener el proceso si hay un error
                }

                // Si la tarjeta se guardó correctamente, la agregamos a savedCards
                //setSavedCards((prevCards) => [...prevCards, result.data]);
            }

            // Si todas las tarjetas se guardaron correctamente
            alert("All cards saved successfully!");

            // Limpiar tempData después de guardar
            setTempData([]);
            setCurrentView("paymentOptions");
            setSelectedMethod("creditCard");
            fetchSavedCards();
        } catch (error) {
            // Manejar errores de red o de otra índole
            console.error("Error saving cards:", error);
            alert("An error occurred while saving the cards. Please try again later.");
        }
    };


    const updateCardDetails = async () => {
        // Verificar si los campos obligatorios están completos
        const { number, expiration, cvv, firstName, lastName, country, billingAddress1, id } = cardDetails;
        if (!id || !number || !expiration || !cvv || !firstName || !lastName || !country || !billingAddress1) {
            alert("Please fill in all required fields.");
            return;
        }

        const updatedCard = {
            number,
            expiration,
            cvv,
            firstName,
            lastName,
            country,
            billingAddress1,
            billingAddress2: cardDetails.billingAddress2 || "",
            userId: user.id,
            position: selectedPriority,
            automatic: isAutomatic,
            billinperiod: selectedCycle
        };

        try {
            const response = await fetch(`https://back.app.esturio.com/api/card/cards/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCard),
            });

            if (response.ok) {
                const result = await response.json();
                setSavedCards((prevCards) =>
                    prevCards.map((card) => (card.id === id ? { ...card, ...updatedCard } : card))
                );
                alert("Card updated successfully!");

                // Limpiar los campos y redirigir
                setCardDetails({
                    number: "",
                    expiration: "",
                    cvv: "",
                    firstName: "",
                    lastName: "",
                    country: "",
                    billingAddress1: "",
                    billingAddress2: "",
                });
                setEditingCard(false);
                setCurrentView("paymentOptions");
            } else {
                alert("Failed to update the card. Please try again.");
            }
        } catch (error) {
            console.error("Error updating card:", error);
            alert("An error occurred while updating the card.");
        }
    };

    const handleDeleteCardTemp = (data) => {
        const id = data.id;
        const updatedTempData = tempData.filter((card) => card.id !== id);
        setTempData(updatedTempData);
    };

    const handleDeleteCard = async (card) => {
        if (!card.id) {
            alert("Card ID is missing. Unable to delete the card.");
            return;
        }

        // Confirmación para evitar eliminaciones accidentales
        const confirmation = window.confirm(`Are you sure you want to delete the card ending in ${card.number.slice(-4)}?`);
        if (!confirmation) {
            return;
        }

        try {
            const response = await fetch(`https://back.app.esturio.com/api/card/cards/${card.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }), // Incluye el `userId` como lo requiere el backend
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Actualizar las tarjetas guardadas en el estado eliminando la tarjeta específica
                    setSavedCards((prevCards) => prevCards.filter((savedCard) => savedCard.id !== card.id));
                    alert("Card deleted successfully!");
                } else {
                    alert(result.message || "Failed to delete the card. Please try again.");
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete the card. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("An error occurred while deleting the card. Please try again later.");
        }
    };

    /* const handlePaymentWithSavedCard = async (card) => {
        // Verificar que la tarjeta tenga todos los datos necesarios
        if (!card || !card.number || !card.expiration || !card.cvv) {
            alert("Card details are incomplete. Please try again.");
            return;
        }

        // Crear el payload con los datos de la tarjeta y el monto a pagar
        const paymentData = {
            number: card.number,
            expiration: card.expiration,
            cvv: card.cvv,
            amount: hourValue, // Monto a pagar
            currency: "USD", // Asegúrate de usar la moneda adecuada
            userId: user.id, // Opcional si el backend lo requiere
        };

        try {
            // Llamar al backend para procesar el pago
            const response = await fetch("https://back.app.esturio.com/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Payment successful:", result);

                // Mostrar detalles de la transacción en un modal (opcional)
                showModal(result);
                alert("Payment successful!");
            } else {
                const errorData = await response.json();
                console.error("Payment failed:", errorData);
                alert("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred while processing the payment.");
        }
    }; */



    useEffect(() => {
        // Solicitar el historial de pagos al backend
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch(`https://back.app.esturio.com/api/transactions/studentId/${user.id}`);
                if (!response.ok) {
                    throw new Error("Error fetching payment history");
                }
                const data = await response.json();
                setPaymentHistory(data.data || []); // Actualizar el estado con los datos
            } catch (error) {
                console.error("Error fetching payment history:", error);
                setError("Failed to load payment history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [user.id]);
    // Mostrar estado de carga o error
    if (isLoading) {
        return <p className="text-blue-600 font-medium">Loading payment history...</p>;
    }

    if (error) {
        return <p className="text-red-600 font-medium">{error}</p>;
    }
    const showModal = (details) => {
        setTransactionDetails(details);
        setIsLoadingPayment(false);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setCurrentView("menu");
    };

    const handlePaymentWithSavedCard = async (details) => {
        // Aquí puedes enviar la información del pago al backend o procesarlo directamente
        console.log("Payment successful:", details);
        showModal(details);
        handlePaymentApproval(details); // Llamar a tu función para manejar la aprobación del pago
    };


    const handlePaymentApproval = async (transactionDetails) => {
        // Combinar los datos del pago con los datos del estudiante y profesor
        const combinedData = {
            transactionDetails: {
                transactionId: transactionDetails.id,
                payerName: `${transactionDetails.firstName} ${transactionDetails.lastName}`,
                payerEmail: transactionDetails.email,
                amount: transactionDetails.amount,
                currency: transactionDetails.currency,
                customerId: transactionDetails.customerId
            },
            student: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            },
            teacher: {
                id: teacher.id,
                name: `${teacher.firstName} ${teacher.lastName}`,
                email: teacher.email,
            },
            classDetails: {
                day: daySelected,
                hour: hourSelected,
                teacherAvailability: hourSelectedTeacher,
                cost: hourValue,
            },
        };
      
        try {
            // Enviar los datos al backend
            const response = await fetch("https://back.app.esturio.com/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(combinedData),
            });

            if (response.ok) {
                console.log("Transacción guardada exitosamente");
                setTimeout(() => {
                   setCurrentView("menu")
                }, 2000)
            } else {
                console.error("Error al guardar la transacción:", await response.json());
            }
        } catch (error) {
            console.error("Error en la solicitud al backend:", error);
        }

        // Guardar los datos combinados en el estado
        setPaymentData(combinedData);

        // Mostrar los datos en la consola
        console.log("Datos combinados para guardar:", combinedData);
    };

    const renderMenu = () => (
        <div className="flex flex-col bg-white rounded-lg w-full max-w-md border-2 border-black p-2">
            <div className="flex flex-col gap-4 w-full p-8 mb-20">
                <img
                    src={user?.profileImageUrl || humanIcon}
                    className="w-20 h-20"
                    alt="User Icon"
                />
                <h1> {user.firstName} {user.lastName}</h1>
                <button
                    className="flex items-center justify-between bg-purple-600 hover:bg-purple-500 p-2 rounded-lg shadow transition mt-8"
                    onClick={() => setCurrentView("proceedToPayment")}
                >
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-white">Proceed to Payment</h3>

                    </div>
                    <span className="text-white text-xl font-semibold">→</span>
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
       

    const processPayment = () => {

    }
    const renderPaymentOptions = () => {
        return (
            <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-lg border-2 border-black">
                {selectedMethod === null && (
                    <div className="flex flex-col items-start">
                        {/* Botón de retroceso */}
                        <button
                            className="text-purple-600"
                            onClick={() => setCurrentView("proceedToPayment")}
                        >
                            <span className="text-purple-600 font-bold text-4xl">←</span>
                        </button>

                        {/* Imagen del usuario */}
                        <img
                            src={"https://res.cloudinary.com/dybws2ubw/image/upload/v1734818674/caba_tmxsay.png"}
                            className="w-10 h-12"
                            alt="User Icon"
                        />
                    </div>
                )}

                {/* Título, solo cuando no hay método seleccionado */}
                {selectedMethod === null && (
                    <h2 className="flex flex-col items-center text-2xl text-center font-semibold my-6">
                        How do you plan to pay for your classes?
                    </h2>
                )}


                {/* Opciones principales */}
                {selectedMethod === null && (
                    <>
                        <button
                            className="flex items-center gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedMethod("creditCard")}
                        >
                            <span className="text-purple-600 text-xl">{selectedMethod === "creditCard" ? "●" : "○"}</span>
                            <div className="flex items-center gap-2">
                                <CreditCardOutlined style={{ fontSize: "36px", color: "#9333EA" }} />
                                <p className="text-lg font-semibold">Pay with Credit Card</p>
                            </div>
                        </button>
                        <button
                            className="flex items-center gap-4 p-4 mt-8 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedMethod("paypal")}
                        >
                            <span className="text-purple-600 text-xl">{selectedMethod === "paypal" ? "●" : "○"}</span>
                            <div
                                className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-blue-700 font-bold text-2xl py-1 px-14 rounded-lg transition-all"
                                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', color: "#003087" }}
                            >
                                Pay<span style={{ color: "#009CDE" }}>Pal</span>
                            </div>
                        </button>
                    </>
                )}

                {/* Formulario de nueva tarjeta */}
                {/* {selectedMethod === "newCard" && (
                    <>
                        {tempData.length > 0 ? renderPaymentOptionsbefore() : renderCreditCardForm()}
                        <button
                            className="text-blue-500 underline mt-4"
                            onClick={() => setSelectedMethod("creditCard")}
                        >
                            Back to Saved Cards
                        </button>
                    </>
                )}
 */}
                {/* Uso de tarjeta guardada */}
                {/*  {selectedMethod?.startsWith("card-") && (
                    <div> */}
                {/* Mostrar información de la tarjeta seleccionada */}
                {/* <p className="text-lg font-medium mb-4">
                            Using Card: **** **** **** {savedCards[parseInt(selectedMethod.split("-")[1])]?.number.slice(-4)}
                        </p> */}

                {/* Botón para procesar el pago */}
                {/* <button
                            className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-500"
                            onClick={() => handlePaymentWithSavedCard(savedCards[parseInt(selectedMethod.split("-")[1])])}
                        >
                            Pay Now
                        </button> */}

                {/* Botón para volver a las tarjetas guardadas */}
                {/* <button
                            className="text-blue-500 underline mt-4"
                            onClick={() => setSelectedMethod("creditCard")}
                        >
                            Back to Saved Cards
                        </button>
                    </div>
                )}
 */}            
                {selectedMethod === "creditCard" && <BraintreeDropIn amount={hourValue}  handlePaymentApproval={handlePaymentApproval} setCurrentView={setCurrentView}  />}
                {selectedMethod === "paypal" && (
                    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100">
                        <div className="mt-4 w-full">
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{ amount: { value: hourValue } }],
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    try {
                                        // Capture el pago (esto lo hace después de la aprobación)
                                        const details = await actions.order.capture();

                                        console.log("Payment successful:", details);

                                        // Si el pago es exitoso, guarda el acuerdo de facturación
                                        // Esto es opcional y solo si deseas guardar la información de pago
                                        if (details.purchase_units[0].payments.captures[0].status === "COMPLETED") {
                                            // Aquí puedes almacenar el 'payerId' para realizar futuros pagos sin que el estudiante ingrese sus datos
                                            const payerId = details.payer.payer_id;
                                            console.log("Saved payerId:", payerId);
                                        }

                                        // Mostrar modal de éxito y manejar la aprobación
                                        showModal(details);
                                        handlePaymentApproval(details);
                                    } catch (error) {
                                        console.error("PayPal error:", error);
                                        alert("An error occurred during payment.");
                                    }
                                }}
                                onError={(error) => console.error("PayPal error:", error)}
                            />
                        </div>
                        <button
                            className="text-blue-500 underline mt-4"
                            onClick={() => setSelectedMethod(null)}
                        >
                            View Other Payment Methods
                        </button>
                    </div>
                )}
                {/* Pago con PayPal */}
                {/* {selectedMethod === "paypal" && (
                    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100">
                        <div className="mt-4 w-full">
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{ amount: { value: hourValue } }],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        console.log("Payment successful:", details);
                                        showModal(details);
                                        handlePaymentApproval(details);
                                    });
                                }}
                                onError={(error) => console.error("PayPal error:", error)}
                            />
                        </div>
                        <button
                            className="text-blue-500 underline mt-4"
                            onClick={() => setSelectedMethod(null)}
                        >
                            View Other Payment Methods
                        </button>
                    </div>
                )} */}

                {/* Modal para mostrar detalles de la transacción */}
                <Modal
                    title=""
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleOk}
                    footer={null} // No default footer
                >
                    {transactionDetails && (
                        <div className="flex flex-col items-center space-y-6 p-4">
                            {/* Box with transaction details */}
                            <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-full max-w-md">
                                <h3 className="text-3xl font-semibold text-center text-green-500 mb-4">Your class has been paid</h3>
                                <p className="text-lg font-semibold">
                                    <strong>Name:</strong> {transactionDetails.payer.name.given_name} {transactionDetails.payer.name.surname}
                                </p>
                                <p className="text-lg font-semibold">
                                    <strong>Email:</strong> {transactionDetails.payer.email_address}
                                </p>
                                <p className="text-lg font-semibold">
                                    <strong>Transaction ID:</strong> {transactionDetails.id}
                                </p>
                                <p className="text-lg font-semibold">
                                    <strong>Amount:</strong> {transactionDetails.purchase_units[0].amount.value} {transactionDetails.purchase_units[0].amount.currency_code}
                                </p>
                                {/* "Capture" and "Print" buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition"
                                        onClick={() => console.log("Capture")}
                                    >
                                        Capture
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                        onClick={() => console.log("Print")}
                                    >
                                        Print
                                    </button>
                                </div>
                            </div>

                            {/* Box with additional actions */}
                            <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">Additional Actions</h3>
                                <div className="flex flex-col space-y-4">
                                    <button
                                        className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-100 transition"
                                        onClick={() => console.log("View payment history")}
                                    >
                                        View Payment History
                                    </button>
                                    <button
                                        className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-100 transition"
                                        onClick={() => console.log("Schedule a new class")}
                                    >
                                        Schedule a New Class
                                    </button>
                                    <button
                                        className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-100 transition"
                                        onClick={() => console.log("Other service")}
                                    >
                                        Other Service
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Opción de Transferencia Bancaria */}
                {(selectedMethod === null || selectedMethod === "bank") && (
                    <div
                        className={`flex flex-col items-start gap-4 p-4 mt-8 mb-8 rounded-lg border shadow-md cursor-pointer hover:bg-gray-100 ${selectedMethod === "bank" ? "bg-gray-200" : ""
                            }`}
                    >
                        <div
                            className="flex items-center gap-4"
                            onClick={() => setSelectedMethod("bank")} // Seleccionar método de transferencia bancaria
                        >
                            <span className="text-purple-600 text-xl">
                                {selectedMethod === "bank" ? "●" : "○"}
                            </span>
                            <BankOutlined style={{ fontSize: "36px", color: "#9333EA" }} />
                            <p className="text-lg font-semibold">Bank Transfer</p>
                        </div>

                        {/* Mostrar botón para volver a los demás métodos si se seleccionó "bank" */}
                        {selectedMethod === "bank" && (
                            <button
                                className="text-blue-500 underline mt-4"
                                onClick={() => {
                                    console.log("Volviendo a otros métodos de pago");
                                    setSelectedMethod(null); // Restablecer a null para mostrar todas las opciones
                                }}
                            >
                                View Other Payment Methods
                            </button>
                        )}
                    </div>
                )}
            </div>

        );
    };


    const renderPaymentOptionsbefore = () => {

        return (
            <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-lg border-2 border-black">


                {/* Título, solo cuando no hay método seleccionado */}
                {selectedMethod === null && (
                    <h2 className="flex flex-col items-center text-2xl text-center font-semibold my-6">
                        How do you plan to pay for your classes?
                    </h2>
                )}

                {/* Mostrar solo la flecha cuando hay un método de pago seleccionado */}

                {
                    !isEventCardTemp.event ?
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-medium mb-4">Card Details Confirmation</h3>

                            {isLoadingCards ? (
                                <p className="text-gray-500">Loading saved cards...</p>
                            ) : tempData && tempData.length > 0 ? (
                                <div>
                                    {
                                        tempData.map((data, key) => {
                                            return (
                                                <div
                                                    key={key || 0} // Usamos 0 como índice por defecto
                                                    className={`flex items-center justify-between p-4 border rounded-lg mb-2 ${selectedMethod === `card-0` ? "bg-gray-200" : ""}`}
                                                >
                                                    {/* Botón de eliminar */}
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => handleDeleteCardTemp(data)}
                                                    >
                                                        <img src="https://res.cloudinary.com/dybws2ubw/image/upload/v1738201771/Caneca_jgzvl3.jpg" alt="Eliminar" className="w-5 h-5" />
                                                    </button>

                                                    {/* Botón de editar */}
                                                    <button
                                                        className="text-purple-600 hover:text-purple-800"
                                                        onClick={() => { setIsEventCardTemp({ event: true, data }); setCardDetails(data) }}
                                                    >
                                                        <img src="https://res.cloudinary.com/dybws2ubw/image/upload/v1738201806/Lapiz_jfopar.jpg" alt="Editar" className="w-8 h-8" />
                                                    </button>

                                                    {/* Tarjeta */}
                                                    <div
                                                        onClick={() => setSelectedMethod(`card-0`)}
                                                        className="cursor-pointer flex flex-col bg-gradient-to-r from-gray-100 to-gray-200 shadow-md rounded-lg p-2 w-48 max-w-sm border border-gray-300 hover:shadow-lg transition"
                                                    >
                                                        {/* Número de la tarjeta */}
                                                        <p className="text-base font-semibold text-gray-800 tracking-wide mb-1">
                                                            **** **** **** {data?.number?.slice(-4) || "XXXX"}
                                                        </p>

                                                        {/* Nombre del titular */}
                                                        <p className="text-xs text-gray-700 mb-1 leading-tight">
                                                            {`${data?.firstName || "Unknown"} ${cardDetails?.lastName || "Unknown"}`}
                                                        </p>

                                                        {/* Fecha de expiración */}
                                                        <p className="text-xs text-gray-600 leading-tight">
                                                            Exp: {`${data?.expiration?.slice(0, 2) || "MM"}/${cardDetails?.expiration?.slice(2) || "YYYY"}`}
                                                        </p>

                                                        {/* Icono de tarjeta */}
                                                        <div className="flex justify-end mt-2">
                                                            {data?.number?.startsWith("4") ? (
                                                                <img
                                                                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                                                    alt="Visa"
                                                                    className="h-4"
                                                                />
                                                            ) : data?.number?.startsWith("5") ? (
                                                                <img
                                                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                                                                    alt="Mastercard"
                                                                    className="h-4"
                                                                />
                                                            ) : (
                                                                <p className="text-xs text-gray-500">Unknown</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Selección de prioridad (solo si es automático) */}
                                                    {isAutomatic && (
                                                        <div className="flex gap-2">
                                                            {[...Array(maxCardsTemp)].map((_, priority) => (
                                                                <button
                                                                    key={priority + 1}
                                                                    className={`w-8 h-8 border-2 rounded-full text-sm font-bold flex items-center justify-center transition-all ${selectedPriority[data?.number] === priority + 1
                                                                        ? "bg-green-400 border-green-600 text-white"
                                                                        : "border-gray-400 text-gray-700 hover:bg-gray-200"
                                                                        }`}
                                                                    onClick={() => handlePriorityChange(data?.number, priority + 1)}
                                                                >
                                                                    {priority + 1}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <p className="text-gray-600">No saved cards available.</p>
                            )}
                            {/* Botón para agregar nueva tarjeta */}
                            <button
                                className="flex flex-col items-center gap-2 p-4 cursor-pointer"
                                onClick={() => setIsEventCardTemp({ event: true, data: null })}
                            >
                                {/* Caja con borde y "+" en el centro */}
                                <div className="flex items-center justify-center w-12 h-8 border border-gray-800 rounded-md">
                                    <span className="text-xl font-bold text-gray-800">+</span>
                                </div>

                                {/* Texto debajo */}
                                <p className="text-sm font-medium text-gray-800">Add Card</p>
                            </button>

                            {/* Configuración de pago manual o automático */}
                            <div className="flex flex-col items-center gap-6 p-4 border rounded-lg shadow-md bg-white max-w-lg">
                                <h2 className="text-xl font-semibold">Select a payment cycle</h2>

                                {/* Opciones de ciclo (Cambian de color al seleccionar) */}
                                <div className="flex items-center gap-4">
                                    <button
                                        className={`px-4 py-2 border rounded-full ${selectedCycle === "Monthly" ? "bg-blue-400 text-white" : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        onClick={() => setSelectedCycle("Monthly")}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={`px-4 py-2 border rounded-full ${selectedCycle === "15 days" ? "bg-blue-400 text-white" : "bg-green-200 hover:bg-green-300"
                                            }`}
                                        onClick={() => setSelectedCycle("15 days")}
                                    >
                                        15 days
                                    </button>
                                </div>

                                {/* Switch Manual / Automático */}
                                <div className="flex items-center gap-4">
                                    <label className="text-lg font-medium">Manual</label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isAutomatic}
                                            onChange={() => setIsAutomatic(!isAutomatic)}
                                        />
                                        <span
                                            className={`relative inline-block w-10 h-6 rounded-full transition-all duration-200 ${isAutomatic ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all duration-200 ${isAutomatic ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></span>
                                        </span>
                                    </label>
                                    <label className="text-lg font-medium">Automatic</label>
                                </div>

                                {/* Botón para guardar selección */}
                                <div className="flex items-center justify-between w-full mt-4">

                                    <Popconfirm
                                        title="confirma el registro de tus targetas"
                                        description="revisa los detalles de las targetas si estas seguro de la informacion pulsa ok para guardar"
                                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        onConfirm={confirmDetails}
                                    >
                                        Save
                                    </Popconfirm>
                                    <button className=" text-blue-500 underline" onClick={() => { setSelectedMethod(null), setCurrentView("paymentOptions") }}>
                                        View Other Payment Methods
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        renderCreditCardFormTemp()
                }

            </div>

        );
    };
    const renderCreditCardForm = () => (
        <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-xl border-2 border-black">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {editingCard ? "Edit Credit Card" : "Add Credit Card"}
            </h2>
            <form className="flex flex-col gap-4">
                {/* Número de tarjeta */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Card Number *</label>
                    <input
                        type="text"
                        placeholder="4444 5555 6666 7777"
                        className="border rounded-lg p-2 w-full"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                </div>

                {/* Fecha de expiración */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Expiration *</label>
                        <input
                            type="text"
                            placeholder="MM/YYYY"
                            className="border rounded-lg p-2 w-full"
                            value={cardDetails.expiration}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiration: e.target.value })}
                        />
                    </div>

                    {/* CVV */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">CVV *</label>
                        <input
                            type="text"
                            placeholder="123"
                            className="border rounded-lg p-2 w-full"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                    </div>
                </div>

                {/* Nombre del titular */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                        <input
                            type="text"
                            placeholder="David"
                            className="border rounded-lg p-2 w-full"
                            value={cardDetails.firstName}
                            onChange={(e) => setCardDetails({ ...cardDetails, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                        <input
                            type="text"
                            placeholder="Martinez"
                            className="border rounded-lg p-2 w-full"
                            value={cardDetails.lastName}
                            onChange={(e) => setCardDetails({ ...cardDetails, lastName: e.target.value })}
                        />
                    </div>
                </div>

                {/* País */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country *</label>
                    <input
                        type="text"
                        placeholder="Mexico"
                        className="border rounded-lg p-2 w-full"
                        value={cardDetails.country}
                        onChange={(e) => setCardDetails({ ...cardDetails, country: e.target.value })}
                    />
                </div>

                {/* Dirección de facturación */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Billing Address Line 1 *</label>
                    <input
                        type="text"
                        placeholder="C Independencia No. 54"
                        className="border rounded-lg p-2 w-full"
                        value={cardDetails.billingAddress1}
                        onChange={(e) =>
                            setCardDetails({ ...cardDetails, billingAddress1: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Billing Address Line 2</label>
                    <input
                        type="text"
                        placeholder="D.F. Mexico, Mexico"
                        className="border rounded-lg p-2 w-full"
                        value={cardDetails.billingAddress2}
                        onChange={(e) =>
                            setCardDetails({ ...cardDetails, billingAddress2: e.target.value })
                        }
                    />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-400"
                        onClick={cancelCardDetails}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-400"
                        onClick={() => (editingCard ? updateCardDetails() :/*saveCardDetails() */ setCurrentView("addCreditCardConfirm"), setTempData([...tempData, { ...cardDetails, id: Date.now() }]))}
                    >
                        {editingCard ? "Update" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderCreditCardFormTemp = () => {
        const saveCardDetails = () => {
            if (isEventCardTemp.data != null) {
                // Si estamos editando, actualizamos la tarjeta existente en tempData
                const updatedTempData = tempData.map((card) =>
                    card.id === isEventCardTemp.data.id ? cardDetails : card
                );
                setTempData(updatedTempData);
            } else {
                // Si es una nueva tarjeta, la agregamos a tempData
                setTempData([...tempData, { ...cardDetails, id: Date.now() }]); // Usamos Date.now() como ID temporal
            }
            setIsEventCardTemp({ event: false, data: null }); // Cambiamos la vista después de guardar
            setCardDetails({
                number: "",
                expiration: "",
                cvv: "",
                firstName: "",
                lastName: "",
                country: "",
                billingAddress1: "",
                billingAddress2: "",
            });
        };

        return (
            <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-xl border-2 border-black">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    {isEventCardTemp.data && isEventCardTemp.event ? "Edit Credit Card" : "Add Credit Card"}
                </h2>
                <form className="flex flex-col gap-4">
                    {/* Número de tarjeta */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Card Number *</label>
                        <input
                            type="text"
                            placeholder="4444 5555 6666 7777"
                            className="border rounded-lg p-2 w-full"
                            value={isEventCardTemp.data && cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        />
                    </div>

                    {/* Fecha de expiración */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Expiration *</label>
                            <input
                                type="text"
                                placeholder="MM/YYYY"
                                className="border rounded-lg p-2 w-full"
                                value={isEventCardTemp.data && cardDetails.expiration}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiration: e.target.value })}
                            />
                        </div>

                        {/* CVV */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">CVV *</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="border rounded-lg p-2 w-full"
                                value={isEventCardTemp.data && cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Nombre del titular */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                            <input
                                type="text"
                                placeholder="David"
                                className="border rounded-lg p-2 w-full"
                                value={isEventCardTemp.data && cardDetails.firstName}
                                onChange={(e) => setCardDetails({ ...cardDetails, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                            <input
                                type="text"
                                placeholder="Martinez"
                                className="border rounded-lg p-2 w-full"
                                value={isEventCardTemp.data && cardDetails.lastName}
                                onChange={(e) => setCardDetails({ ...cardDetails, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* País */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Country *</label>
                        <input
                            type="text"
                            placeholder="Mexico"
                            className="border rounded-lg p-2 w-full"
                            value={isEventCardTemp.data && cardDetails.country}
                            onChange={(e) => setCardDetails({ ...cardDetails, country: e.target.value })}
                        />
                    </div>

                    {/* Dirección de facturación */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Billing Address Line 1 *</label>
                        <input
                            type="text"
                            placeholder="C Independencia No. 54"
                            className="border rounded-lg p-2 w-full"
                            value={isEventCardTemp.data && cardDetails.billingAddress1}
                            onChange={(e) =>
                                setCardDetails({ ...cardDetails, billingAddress1: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Billing Address Line 2</label>
                        <input
                            type="text"
                            placeholder="D.F. Mexico, Mexico"
                            className="border rounded-lg p-2 w-full"
                            value={isEventCardTemp.data && cardDetails.billingAddress2}
                            onChange={(e) =>
                                setCardDetails({ ...cardDetails, billingAddress2: e.target.value })
                            }
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-400"
                            onClick={() => setIsEventCardTemp({ event: false, data: null })}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-400"
                            onClick={saveCardDetails} // Usamos la nueva función saveCardDetails
                        >
                            {editingCard ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
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
        <div className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-2 w-full max-w-lg border-[1px] border-black">
            <div className="relative">
                {/* Contenedor principal */}
                <div className="flex flex-col items-start">
                    <button
                        className="text-purple-600"
                        onClick={() => setCurrentView("menu")}
                    >
                        <span className="text-purple-600 font-bold text-4xl">←</span>
                    </button>
                    <img
                        src={"https://res.cloudinary.com/dybws2ubw/image/upload/v1734818674/caba_tmxsay.png"}
                        className="w-10 h-12"
                        alt="User Icon"
                    />
                </div>

                {/* Fecha en la parte superior derecha */}
                <p className="absolute top-0 right-0 text-lg font-medium text-gray-800">
                    {new Date().toLocaleDateString("en-GB")}
                </p>
            </div>
            <div className="flex flex-col ">
                <h1 className="my-4"> {user.firstName} {user.lastName}</h1>
                <p className="text-gray-600"> You have a class on:</p>
                <span>Make sure you have paid for your class so you are ready to go at tke time you selected. </span>

                <div className="overflow-x-auto mt-8">
                    <table className="table-auto border-collapse border border-gray-200 w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Cost/hour</th>
                                <th className="border border-gray-300 px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-blue-600">1h</td>
                                <td className="border border-gray-300 px-4 py-2 text-blue-600">language tuition</td>
                                <td className="border border-gray-300 px-4 py-2 text-blue-600">USD {parseFloat(hourValue).toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-blue-600">USD {parseFloat(hourValue).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-xl text-center font-semibold text-gray-800 my-10">USD {parseFloat(hourValue).toFixed(2)}</p>

                <div className="flex justify-end">
                    <button
                        className="w-36 bg-purple-600 text-white py-2 mb-4 mt-20 rounded-[28px] text-lg font-semibold hover:bg-purple-400 transition"
                        onClick={() => {
                            console.log("Switching to Payment Options");
                            setCurrentView("paymentOptions"); // Cambia a la vista de opciones de pago
                        }}
                    >
                        Pay Now
                    </button>
                </div>

            </div>

        </div>
    );

    const renderPaymentHistory = () => {
        const columns = [
            {
                title: "Number",
                dataIndex: "number",
                key: "number",
                render: (text, record, index) => index + 1,
            },
            {
                title: "Via",
                dataIndex: "via",
                key: "via",
                render: () => "PayPal",
            },
            {
                title: "Process",
                dataIndex: "process",
                key: "process",
                render: () => "Automatic",
            },
            {
                title: "Date",
                dataIndex: "createdAt",
                key: "date",
                render: (text) => new Date(text).toLocaleDateString(),
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                defaultSortOrder: "descend",
            },
            {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                render: (text) => `USD ${parseFloat(text).toFixed(2)}`,
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (text) => (
                    <span className={text === "Completed" ? "text-green-600" : "text-red-600"}>
                        {text}
                    </span>
                ),
            },
        ];

        return (
            <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-full max-w-xl border-[2px] border-black">
                <div className="text-left mb-4">
                    <Button type="link" onClick={() => setCurrentView("menu")}>
                        <span className="text-purple-600 font-bold text-4xl">←</span>
                    </Button>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
                <div className="overflow-x-auto mt-4">
                    <Table
                        columns={columns}
                        dataSource={paymentHistory}
                        rowKey="id"
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20"],
                        }}
                        bordered
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 py-8">
            {isLoadingPayment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <Spin size="large" />
                </div>
            )}
            {currentView === "successPay" && <PaymentSuccessCheck />}
            {currentView === "menu" && renderMenu()}
            {currentView === "proceedToPayment" && renderProceedToPayment()}
            {currentView === "paymentSettings" && renderPaymentSettings()}
            {currentView === "billing" && renderBilling()}
            {currentView === "paymentOptions" && renderPaymentOptions()}
            {currentView === "paymentHistory" && renderPaymentHistory()}
            {currentView === "addCreditCard" && renderCreditCardForm()}
            {currentView === "addCreditCardConfirm" && renderPaymentOptionsbefore()}
        </div>
    );
};

export default Pay;