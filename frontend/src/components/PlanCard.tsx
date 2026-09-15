import type { Plan } from "../types/plan.js";

const PlanCard = ({ plan }: { plan: Plan }) => {
  return (
    <div>
      <h3>{plan.name}</h3>
      <p>{plan.price} kr</p>
      <p>{plan.description}</p>
      <button>Välj {plan.name}</button>
    </div>
  );
};

export default PlanCard;
