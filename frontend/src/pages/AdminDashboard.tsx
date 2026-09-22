import { useState, useEffect } from 'react';

interface Course {
    course_id: string;
    course_title: string;
    course_slug: string;
    min_access_level: number;
    status: string;
}

interface Lesson {
    lesson_id: string;
    course_id: string;
    course_title: string;
    lesson_title: string;
    sequence_order: number;
    status: string;
}

export const AdminDashboard = () => {

    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [lessonsList, setLessonsList] = useState<Lesson[]>([]);

    const [courseTitle, setCourseTitle] = useState('');
    const [courseSlug, setCourseSlug] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [minAccessLevel, setMinAccessLevel] = useState(1);
    const [courseStatus, setCourseStatus] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [lessonCourseId, setLessonCourseId] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonSlug, setLessonSlug] = useState('');
    const [lessonContent, setLessonContent] = useState('');
    const [lessonSequence, setLessonSequence] = useState(1);
    const [lessonMediaUrl, setLessonMediaUrl] = useState('');
    const [lessonStatus, setLessonStatus] = useState('');

    const fetchAdminData = async () => {
        try {
            const [coursesRes, lessonsRes] = await Promise.all([
                fetch('http://localhost:3000/api/admin/courses'),
                fetch('http://localhost:3000/api/admin/lessons')
            ]);

            if (coursesRes.ok && lessonsRes.ok) {
                const coursesData = await coursesRes.json();
                const lessonsData = await lessonsRes.json();
                setCoursesList(coursesData);
                setLessonsList(lessonsData);
            }
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        }
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [coursesRes, lessonsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/admin/courses'),
                    fetch('http://localhost:3000/api/admin/lessons')
                ]);

                if (coursesRes.ok && lessonsRes.ok) {
                    const coursesData = await coursesRes.json();
                    const lessonsData = await lessonsRes.json();
                    setCoursesList(coursesData);
                    setLessonsList(lessonsData);
                }
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            }
        };

        fetchAdminData();
    }, [refreshTrigger]);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setCourseStatus('Creating course...');

        try {
            const response = await fetch('http://localhost:3000/api/admin/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_title: courseTitle,
                    course_slug: courseSlug,
                    course_description: courseDescription,
                    min_access_level: minAccessLevel,
                    media_url: lessonMediaUrl
                })
            });

            if (response.ok) {
                setCourseStatus('Success! Course created.');
                setCourseTitle('');
                setCourseSlug('');
                setCourseDescription('');
                setLessonContent('');
                setLessonMediaUrl('');
                setMinAccessLevel(1);
                setRefreshTrigger(prev => prev + 1);
            } else {
                const errorData = await response.json();
                setCourseStatus(`Failed: ${errorData.error}`);
            }
        } catch (error) {
            setCourseStatus('A network error occurred.');
            (console.error('Error creating course:', error));
        }
    };

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        setLessonStatus('Creating lesson...');

        try {
            const response = await fetch('http://localhost:3000/api/admin/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: lessonCourseId,
                    lesson_title: lessonTitle,
                    lesson_slug: lessonSlug,
                    content_body: lessonContent,
                    sequence_order: lessonSequence
                })
            });

            if (response.ok) {
                setLessonStatus('Success! Lesson created.');
                setLessonTitle('');
                setLessonSlug('');
                setLessonContent('');
                setLessonSequence(lessonSequence + 1);
                fetchAdminData();
            } else {
                const errorData = await response.json();
                setLessonStatus(`Failed: ${errorData.error}`);
            }
        } catch (error) {
            setLessonStatus('A network error occurred.');
            (console.error('Error creating lesson:', error));
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!window.confirm('Are you sure you want to delete this course? All connected lessons will also be deleted.')) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/admin/courses/${courseId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert('Failed to delete course.');
            }
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/admin/lessons/${lessonId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert('Failed to delete lesson.');
            }
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Admin Control Panel</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>

                <section style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h2>1. Create Course</h2>
                    <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Course Title</label>
                            <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>URL Slug</label>
                            <input type="text" value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                            <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required rows={3} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Required Access Level (1-3)</label>
                            <input type="number" min="1" max="3" value={minAccessLevel} onChange={(e) => setMinAccessLevel(Number(e.target.value))} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>1=Basic 2=Plus 3=Pro</div>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Publish Course</button>
                    </form>
                    {courseStatus && <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eef2f5', borderRadius: '4px' }}><strong>{courseStatus}</strong></div>}
                </section>

                <section style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h2>2. Add Lesson</h2>
                    <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Select Course</label>
                            <select 
                                value={lessonCourseId} 
                                onChange={(e) => setLessonCourseId(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="" disabled>-- Choose a course --</option>
                                {coursesList.map(c => (
                                    <option key={c.course_id} value={c.course_id}>{c.course_title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Lesson Title</label>
                            <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>URL Slug</label>
                            <input type="text" value={lessonSlug} onChange={(e) => setLessonSlug(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Content Body</label>
                            <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} required rows={3} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Media URL (Video/Image Link - Optional)</label>
                            <input 
                                type="text" 
                                value={lessonMediaUrl} 
                                onChange={(e) => setLessonMediaUrl(e.target.value)} 
                                placeholder="https://..."
                                style={{ width: '100%', padding: '8px' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Sequence Order</label>
                            <input type="number" min="1" value={lessonSequence} onChange={(e) => setLessonSequence(Number(e.target.value))} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>Publish Lesson</button>
                    </form>
                    {lessonStatus && <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eef2f5', borderRadius: '4px' }}><strong>{lessonStatus}</strong></div>}
                </section>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <section>
                    <h2>Existing Courses</h2>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <thead style={{ backgroundColor: '#f5f5f5' }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Title</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Slug</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Level</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Status</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coursesList.map(course => (
                                <tr key={course.course_id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{course.course_title}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{course.course_slug}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{course.min_access_level}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{course.status}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDeleteCourse(course.course_id)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                        title="Delete Course"
                                    >
                                        🗑️
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>Existing Lessons</h2>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <thead style={{ backgroundColor: '#f5f5f5' }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Course</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Order</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Lesson Title</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Status</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessonsList.map(lesson => (
                                <tr key={lesson.lesson_id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{lesson.course_title}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{lesson.sequence_order}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{lesson.lesson_title}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{lesson.status}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleDeleteLesson(lesson.lesson_id)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                            title="Delete Lesson"
                                        >
                                        🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};