import { useEffect, useState } from "react";
import type { Plan } from "../types/plan.js";
import PlanCard from "../components/PlanCard.js";
import "./Pricing.css";

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3000/api/plans");

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <h2>Choose your plan</h2>

      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default Pricing;
