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
    <article className="plan-card">
      <h2 className="plan-card-title">{plan.name}</h2>
      <p className="plan-card-price">
        {plan.price} {plan.currency}
        <span>/ {plan.billing_interval}</span>
      </p>
      <ul className="plan-card-features">
        {plan.description
          .split(/\r?\n|,|;/)
          .map((feature) => feature.trim())
          .filter(Boolean)
          .map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      <button
        onClick={handleCheckout}
        disabled={loading || isActivePlan}
        className={isActivePlan ? "current-plan-button" : ""}
      >
        {isActivePlan
          ? "Currently Active"
          : loading
            ? "Processing..."
            : plan.price === 0
              ? "Get Started Free"
              : `Choose ${plan.name}`}
      </button>
    </article>
  );
};

export default PlanCard;
