import { useEffect, useState } from "react";
import type { Plan } from "../types/plan.js";
import PlanCard from "../components/PlanCard.js";
import "./Pricing.css";

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);

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
        clearTimeout(timer);
      }
    };

    fetchPlans();
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="pricing-page">
        {showLoader && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pricing-page">
      <h1>Choose Your Plan</h1>
      {error && <p>{error}</p>}

      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default Pricing;
