import { useEffect, useState } from "react";
import type { Plan } from "../types/plan.js";
import PlanCard from "../components/PlanCard.js";
import "./Pricing.css";
import axios from "axios";

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [plansResponse, activeSubscriptionResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/plans"),

          axios.get(
            "http://localhost:3000/api/dashboard/plan",

            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
        ]);

        setPlans(plansResponse.data);
        setActivePlanId(activeSubscriptionResponse.data.plan_id);
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch plans");
        } else {
          setError("Failed to fetch plans");
        }
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    fetchData();
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
      <h1 className="pricing-page-title">Choose Your Plan</h1>
      {error && <p>{error}</p>}

      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} activePlanId={activePlanId} />
      ))}
    </div>
  );
};

export default Pricing;
