import { useNavigate } from "react-router-dom";
import type { Plan } from "../types/plan.js";
import "./PlanCard.css";

const PlanCard = ({ plan }: { plan: Plan }) => {
  const navigate = useNavigate();
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/api/payments/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            plan_id: plan.id,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Payment successful", data);
        navigate("/dashboard");
      } else {
        console.error("Payment failed with status:", response.status);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="plan-card">
      <h3>{plan.name}</h3>
      <p>
        {plan.price} {plan.currency} / {plan.billing_interval}
      </p>
      <p>{plan.description}</p>
      <button onClick={handleCheckout}>Checkout {plan.name}</button>
    </div>
  );
};

export default PlanCard;
