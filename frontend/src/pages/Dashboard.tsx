import { useState, useEffect } from 'react';

interface Plan {
    name: string;
    description: string;
    access_level: number;
    status: string;
    current_period_end: string;
}

interface Course {
    course_id: string;
    course_title: string;
    course_description: string;
}

interface Receipt {
    payment_id: string;
    plan_name: string;
    amount_paid: number;
    currency: string;
    created_at: string;
}

export default function Dashboard() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const planRes = await fetch('http://localhost:3000/api/dashboard/plan');
                const coursesRes = await fetch('http://localhost:3000/api/dashboard/courses');
                const receiptsRes = await fetch('http://localhost:3000/api/dashboard/receipts');

                if (!planRes.ok || !coursesRes.ok || !receiptsRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const planData = await planRes.json();
                const coursesData = await coursesRes.json();
                const receiptsData = await receiptsRes.json();

                setPlan(planData);
                setCourses(coursesData);
                setReceipts(receiptsData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Could not load dashboard data at this time.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) return <div>Loading dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>My Dashboard</h1>

            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc' }}>
                <h2>Current Plan</h2>
                {plan ? (
                    <div>
                        <h3>{plan.name}</h3>
                        <p>{plan.description}</p>
                        <p><strong>Status:</strong> {plan.status}</p>
                        <p><strong>Valid until:</strong> {new Date(plan.current_period_end).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>No active plan found. Please upgrade!</p>
                )}
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2>My Courses</h2>
                {courses.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {courses.map((course) => (
                            <li key={course.course_id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                <h4>{course.course_title}</h4>
                                <p>{course.course_description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not started any courses yet.</p>
                )}
            </section>

            <section>
                <h2>Receipts</h2>
                {receipts.length > 0 ? (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th>Date</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Receipt ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt) => (
                                <tr key={receipt.payment_id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td>{new Date(receipt.created_at).toLocaleDateString()}</td>
                                    <td>{receipt.plan_name}</td>
                                    <td>{receipt.amount_paid} {receipt.currency}</td>
                                    <td style={{ fontSize: '0.8em', color: '#666' }}>{receipt.payment_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No payment history available.</p>
                )}
            </section>
        </div>
    );
};