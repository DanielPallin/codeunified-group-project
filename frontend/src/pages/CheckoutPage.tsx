import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "./CheckoutPage.css";
import type { Plan } from "../types/plan.js";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { planId } = useParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);

    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const API_URL = import.meta.env.PROD
          ? "https://codeunified-group-project.onrender.com"
          : "http://localhost:3000";

        const response = await axios.get(`${API_URL}/api/plans/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlan(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorStatus(error.response.status);
          setError(error.response.data.message || "Failed to fetch plan");
        }
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    if (planId) {
      fetchPlan();
    }

    return () => clearTimeout(timer);
  }, [planId, navigate]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const API_URL = import.meta.env.PROD
      ? "https://codeunified-group-project.onrender.com"
      : "http://localhost:3000";

    try {
      const response = await axios.post(
        `${API_URL}/api/payments/checkout`,
        {
          plan_id: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Payment successful", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Payment failed:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        {showLoader && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        {errorStatus === 404 && (
          <>
            <p>Plan not found.</p>
            <Link to="/pricing">View available plans</Link>
          </>
        )}

        {errorStatus === 401 && (
          <>
            <p>Your session has expired. Please log in again.</p>

            <Link to="/login">Log in</Link>
          </>
        )}

        {errorStatus !== 401 && errorStatus !== 404 && <p>{error}</p>}
      </div>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      {plan && (
        <>
          <h2 className="plan-card-title">Chosen Plan: {plan.name}</h2>

          <p className="plan-card-price">
            {plan.price} {plan.currency}
            <span>/ {plan.billing_interval}</span>
          </p>
        </>
      )}

      <label htmlFor="card-number">
        Card number
        <input id="card-number" type="text" placeholder="4242 4242 4242 4242" />
      </label>

      <label htmlFor="expiry-date">
        Expiry date
        <input id="expiry-date" type="text" placeholder="12/28" />
      </label>

      <label htmlFor="cvc">
        CVC
        <input id="cvc" type="text" placeholder="123" />
      </label>

      <label htmlFor="name-on-card">
        Name on card
        <input id="name-on-card" type="text" placeholder="Your name" />
      </label>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Complete payment"}
      </button>
    </main>
  );
};

export default CheckoutPage;
