import { useEffect, useState } from "react";
import type { Plan } from "../types/plan.js";

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
        const data = await response.json();
        setPlans(data);
        console.log("Fetched plans:", data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div>
      <h1>Priser</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <h2>{plan.name}</h2>
            <p>Pris: {plan.price} kr</p>
            <p>{plan.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pricing;
