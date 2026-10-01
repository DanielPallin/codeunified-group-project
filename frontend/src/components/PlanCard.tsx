import { useNavigate } from "react-router-dom";
import type { Plan } from "../types/plan.js";
import "./PlanCard.css";

interface PlanCardProps {
  plan: Plan;
  activePlanId: string | null;
}

const PlanCard = ({ plan, activePlanId }: PlanCardProps) => {
  const navigate = useNavigate();

  const isActivePlan = plan.id === activePlanId;

  const handlePlanSelect = () => {
    navigate(`/checkout/${plan.id}`);
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
          .map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
      </ul>
      <button
        onClick={handlePlanSelect}
        disabled={isActivePlan}
        className={isActivePlan ? "current-plan-button" : ""}
      >
        {isActivePlan
          ? "Currently Active"
          : plan.price === 0
            ? "Get Started Free"
            : `Choose ${plan.name}`}
      </button>
    </article>
  );
};

export default PlanCard;
