import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Plan } from "../types/plan.js";
import "./PlanCard.css";
import axios from "axios";

interface PlanCardProps {
  plan: Plan;
  activePlanId: string | null;
}

const PlanCard = ({ plan, activePlanId }: PlanCardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isActivePlan = plan.id === activePlanId;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payments/checkout",

        {
          plan_id: plan.id,
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

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-card">
      <h3 className="plan-card-title">{plan.name}</h3>
      <p>
        {plan.price} {plan.currency} / {plan.billing_interval}
      </p>
      <p>{plan.description}</p>
      <button
        onClick={handleCheckout}
        disabled={loading || isActivePlan}
        className={isActivePlan ? "current-plan-button" : ""}
      >
        {isActivePlan
          ? "Currently Active"
          : loading
            ? "Processing..."
            : `Checkout ${plan.name}`}
      </button>
    </div>
  );
};

export default PlanCard;
