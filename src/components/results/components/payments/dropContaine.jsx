import { useEffect, useState } from 'react';
import dropin from 'braintree-web-drop-in';
import axios from 'axios';
import { useAuth } from '../../../../Context/AuthContext';
import { CheckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PaymentSuccessCheck from './checkAnimation';

const BraintreeDropIn = ({ amount, handlePaymentApproval, setCurrentView }) => {
  const [customerId, setCustomerId] = useState(null);
  const [clientToken, setClientToken] = useState(null);
  const [dropinInstance, setDropinInstance] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSaveCardChange = (e) => {
    setSaveCard(e.target.checked);
  };


  // optener token del usuario
  const fetchClientToken = async () => {
    try {
      const response = await axios.get("https://back.app.esturio.com/api/payments/get-client-token");
      setClientToken(response.data.clientToken);
      buildUi(response.data.clientToken);
    } catch (error) {
      setErrorMessage('Error al obtener el Client Token.');
    }
  };

  useEffect(() => {
    fetchClientToken();
    user.paypalId ? setCustomerId(user.paypalId) : setCustomerId(null)
    getCards();
  }, []);



  // guardar targeta
  const cardSave = async (pNonce) => {
    if (!customerId && !pNonce) {
      setErrorMessage("faltan datos revisa los campos")
      return;
    }
    setErrorMessage("");

    try {
      const response = await axios.post("https://back.app.esturio.com/api/payments/save-card", {
        paymentMethodNonce: pNonce,
        customerId: user.paypalId ? user.paypalId : customerId
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Tarjeta guardada:", response);
    } catch (error) {
      console.log(error);
    }
  };

  // crear usuario 
  const createCustomer = async () => {
    if (!formData.firstName && !formData.lastName && !formData.email) {
      setErrorMessage("Datos incompletos");
      return;
    }

    setErrorMessage("");
    try {
      const response = await axios.post("https://back.app.esturio.com/api/payments/create-customer", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        id: user.id
      });

      const customerId = response.data.customerId;
      setCustomerId(customerId);
      console.log("Customer ID:", customerId);
    } catch (error) {
      console.error("Error al crear el cliente:", error);
    }
  };

  // construir la interface de la targeta 
  function buildUi(token) {
    dropin.create({
      authorization: token,
      container: '#dropin-container'
    }, (err, instance) => {
      if (err) {
        console.error(err);
        return;
      }
      setDropinInstance(instance);
    });
  }

  // peticion de generar pago
  const pagar = async (pNonce) => {

    try {
      const response = await axios.post("https://back.app.esturio.com/api/payments/process-payment", {
        customerId: user.paypalId ? user.paypalId : customerId,
        paymentMethodNonce: pNonce,
        paymentMethodToken: selectedCard,
        selectCard: selectedCard ? true : false,
        amount
      });
      console.log("pago realizado", response)
      if (!response.data.success) {

        return;
      }

      const transaction = {
        firstName: response.data.transaction.customer.firstName,
        lastName: response.data.transaction.customer.lastName,
        email: response.data.transaction.customer.email,
        id: response.data.transaction.id,
        currency: response.data.transaction.currencyIsoCode,
        customerId: response.data.transaction.customer.id,
        amount

      }
      handlePaymentApproval(transaction);
      setCurrentView("successPay")
    } catch (error) {
      console.log(error);
    }
  }

  // generar pago
  const handlePurchase = async () => {
    if (selectedCard) {
      pagar("");
      return;
    }
    if (dropinInstance) {
      dropinInstance.requestPaymentMethod(async (err, payload) => {
        if (err) {
          console.error(err);
          return;
        }

        const paymentMethodNonce = payload.nonce;
        setNonce(paymentMethodNonce);

        if (!customerId || !paymentMethodNonce) {
          console.log("Cliente o nonce no disponibles");
          return;
        }

        pagar(paymentMethodNonce);

        if (saveCard) {
          await cardSave(paymentMethodNonce);
        }
      });
    }
  };

  const getCards = async () => {
    try {
      const cards = await axios.get(`https://back.app.esturio.com/api/payments/get-cards/${user.paypalId}`)
      setCards(cards.data)
    } catch (error) {
      console.log(error);
    }
  }

  const newCard = () => {
    setSelectedCard(null);
    fetchClientToken();
  }

  return (
    <div>
      <Button type="link" onClick={() => setCurrentView("menu")}>
        <span className="text-purple-600 font-bold text-4xl">←</span>
      </Button>
      <div className='W-100 flex p-3 justify-center text-xl font-semibold'>
        <p>Pagaras {amount} US</p>
      </div>
      {!user.paypalId && (
        <>
          {
            !customerId &&
            (
              <>
                <h2 className="text-2xl font-bold mb-4">Ingresa tus datos</h2>
                <form
                  onSubmit={(e) => { e.preventDefault(); createCustomer(); }}
                  className="bg-white shadow-md rounded-lg p-6 mb-6"
                >
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400 transition"
                  >
                    Registrar Usuario
                  </button>
                  {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
                </form>
              </>
            )
          }
        </>
      )}
      <div>
        <h2>Elige una tarjeta para pagar</h2>
        {cards.map((card) => (
          <div
            key={card.token}
            className="mb-3 flex items-center justify-between gap-4 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => { setSelectedCard(card.token) }}
          >
            <div className="flex flex-col">
              <span>Card: {card.cardType}</span>
              <span>Expiration: {card.expirationMonth}/{card.expirationYear}</span>
              <span>Number: {`${card.maskedNumber}`}</span>
            </div>
            {selectedCard === card.token && <span className="text-blue-500n text-white font-bold rounded-full border bg-green-300 p-2"><CheckOutlined className='m-2' /></span>}
            <img src={card.img} className='w-12' />
          </div>
        ))}
      </div>
      <div id="checkout-message"></div>
      {!selectedCard && <div id="dropin-container"></div>}
      <div className='w-100 flex justify-center gap-5'>
        {
          !selectedCard &&
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={handleSaveCardChange}
              className="mr-2"
            />
            Guardar tarjeta para próximos pagos
          </label>
        }
        <button
          id="submit-button"
          onClick={handlePurchase}
          className="cursor-pointer font-medium relative text-center border rounded-md appearance-none inline-block px-5 py-2 text-sm bg-green-400 border-green-400 text-white transition duration-200 ease-in-out hover:bg-green-300 hover:text-white"
        >
          Pay
        </button>
        {
          selectedCard &&
          <button
            id="submit-button"
            onClick={newCard}
            className="cursor-pointer font-medium relative text-center border rounded-md appearance-none inline-block px-5 py-2 text-sm bg-green-400 border-green-400 text-white transition duration-200 ease-in-out hover:bg-green-300 hover:text-white"
          >
            New Card
          </button>
        }
      </div>
    </div>
  );
};

export default BraintreeDropIn;
