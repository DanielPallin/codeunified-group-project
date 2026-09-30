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

        const API_URL = import.meta.env.PROD 
            ? 'https://codeunified-group-project.onrender.com' 
            : 'http://localhost:3000';

        const plansResponse = await axios.get(`${API_URL}/api/plans`);
        setPlans(plansResponse.data);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const activeSubscriptionResponse = await axios.get(
              `${API_URL}/api/dashboard/plan`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            setActivePlanId(activeSubscriptionResponse.data.plan_id);
          } catch {
            setActivePlanId(null);
          }
        }
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
    <main className="pricing-page">
      <section className="pricing-content" aria-labelledby="pricing-title">
        <header className="pricing-intro">
          <h1 id="pricing-title" className="pricing-page-title">
            Choose Your Learning Plan
          </h1>
          <p>Start free and unlock more as you progress.</p>
        </header>

        {error ? (
          <p className="pricing-error">{error}</p>
        ) : (
          <div className="pricing-plans">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                activePlanId={activePlanId}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Pricing;
