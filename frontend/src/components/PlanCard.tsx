import type { Plan } from "../types/plan.js";
import "./PlanCard.css";

const PlanCard = ({ plan }: { plan: Plan }) => {
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

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();

      console.log("Receipt:", data);
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
