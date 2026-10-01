import PlanCard from "./PlanCard.js";
import type { Plan } from "../types/plan.js";

const PlanList = ({plans, activePlanId,}: { plans: Plan[]; activePlanId: string | null;}) => {
  return (
    <div className="pricing-plans">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} activePlanId={activePlanId} />
      ))}
    </div>
  );
};

export default PlanList;
