import type { Plan } from "../types/plan.js";
import "./PlanCard.css";

const PlanCard = ({ plan }: { plan: Plan }) => {
  return (
    <div className="plan-card">
      <h3>{plan.name}</h3>
      <p>{plan.price} {plan.currency} / {plan.billing_interval}</p>
      <p>{plan.description}</p>
      <button>Välj {plan.name}</button>
    </div>
  );
};

export default PlanCard;
