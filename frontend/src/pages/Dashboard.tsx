import { useState, useEffect } from 'react';
import './Dashboard.css';

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

    const [activeDrawer, setActiveDrawer] = useState<'none' | 'courses' | 'receipts'>('none');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const planRes = await fetch('http://localhost:3000/api/dashboard/plan', { headers });
                const coursesRes = await fetch('http://localhost:3000/api/dashboard/courses', { headers });
                const receiptsRes = await fetch('http://localhost:3000/api/dashboard/receipts', { headers });

                if (planRes.ok) {
                    const planData = await planRes.json();
                    setPlan(planData);
                } else if (planRes.status === 404) {
                    setPlan(null);
                } else {
                    throw new Error('Backend error when fetching plan');
                }

                if (!coursesRes.ok || !receiptsRes.ok) {
                    throw new Error('Failed to fetch courses or receipts');
                }

                const coursesData = await coursesRes.json();
                const receiptsData = await receiptsRes.json();

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
    if (error) return <div className="error-text">{error}</div>;

    const closeDrawer = () => setActiveDrawer('none');

    return (
        <div className="dashboard-container">
            <h1>My Dashboard</h1>

            <section className="dashboard-section">
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

            <div style={{ display: 'flex', gap: '20px' }}>
                <section className="dashboard-section" style={{ flex: 1, marginBottom: 0 }}>
                    <h2>My Courses</h2>
                    <p>{courses.length} active courses.</p>
                    <button className="open-drawer-btn" onClick={() => setActiveDrawer('courses')}>
                        View My Courses
                    </button>
                </section>

                <section className="dashboard-section" style={{ flex: 1, marginBottom: 0 }}>
                    <h2>Receipts</h2>
                    <p>{receipts.length} previous payments.</p>
                    <button className="open-drawer-btn" onClick={() => setActiveDrawer('receipts')}>
                        View Payment History
                    </button>
                </section>
            </div>

            <div 
                className={`drawer-overlay ${activeDrawer !== 'none' ? 'open' : ''}`} 
                onClick={closeDrawer}
            />

            <div className={`drawer ${activeDrawer !== 'none' ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h2>{activeDrawer === 'courses' ? 'My Courses' : 'Receipts'}</h2>
                    <button className="drawer-close-btn" onClick={closeDrawer}>✕</button>
                </div>

                {activeDrawer === 'courses' && (
                    <div>
                        {courses.length > 0 ? (
                            <ul className="course-list">
                                {courses.map((course) => (
                                    <li key={course.course_id} className="course-item">
                                        <h4>{course.course_title}</h4>
                                        <p>{course.course_description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>You have not started any courses yet.</p>
                        )}
                    </div>
                )}

                {activeDrawer === 'receipts' && (
                    <div>
                        {receipts.length > 0 ? (
                            <table className="receipts-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Plan</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((receipt) => (
                                        <tr key={receipt.payment_id}>
                                            <td>{new Date(receipt.created_at).toLocaleDateString()}</td>
                                            <td>{receipt.plan_name}</td>
                                            <td>{receipt.amount_paid} {receipt.currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No payment history available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}