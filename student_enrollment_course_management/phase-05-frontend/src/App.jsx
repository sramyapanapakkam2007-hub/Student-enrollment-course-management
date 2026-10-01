import { useEffect, useState } from 'react';
import { api } from './api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [login, setLogin] = useState({ email: '', password: '' });

  async function load() {
    const [s, c, e] = await Promise.all([
      api.get('/students'), api.get('/courses'), api.get('/enrollments')
    ]);
    setStudents(s.data); setCourses(c.data); setEnrollments(e.data);
  }

  useEffect(() => { if (loggedIn) load().catch(console.error); }, [loggedIn]);

  async function submitLogin(e) {
    e.preventDefault();
    try {
      const r = await api.post('/auth/login', login);
      localStorage.setItem('token', r.data.token);
      setLoggedIn(true);
    } catch {
      alert('Login failed');
    }
  }

  if (!loggedIn) return (
    <main className="container">
      <h1>Student Enrollment System</h1>
      <form onSubmit={submitLogin} className="card">
        <input placeholder="Email" type="email"
          value={login.email} onChange={e => setLogin({...login, email:e.target.value})}/>
        <input placeholder="Password" type="password"
          value={login.password} onChange={e => setLogin({...login, password:e.target.value})}/>
        <button>Login</button>
      </form>
    </main>
  );

  return (
    <main className="container">
      <header>
        <h1>Student Enrollment & Course Management</h1>
        <button onClick={() => { localStorage.removeItem('token'); setLoggedIn(false); }}>
          Logout
        </button>
      </header>

      <section className="stats">
        <div className="card"><b>{students.length}</b><span>Students</span></div>
        <div className="card"><b>{courses.length}</b><span>Courses</span></div>
        <div className="card"><b>{enrollments.length}</b><span>Enrollments</span></div>
      </section>

      <section className="card">
        <h2>Students</h2>
        <table><thead><tr><th>Roll No</th><th>Name</th><th>Email</th><th>Department</th></tr></thead>
        <tbody>{students.map(s => <tr key={s.id}><td>{s.roll_no}</td><td>{s.name}</td><td>{s.email}</td><td>{s.department}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="card">
        <h2>Courses</h2>
        <table><thead><tr><th>Code</th><th>Name</th><th>Credits</th><th>Capacity</th></tr></thead>
        <tbody>{courses.map(c => <tr key={c.id}><td>{c.code}</td><td>{c.name}</td><td>{c.credits}</td><td>{c.capacity}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="card">
        <h2>Recent Enrollments</h2>
        <table><thead><tr><th>Roll No</th><th>Student</th><th>Course</th><th>Date</th></tr></thead>
        <tbody>{enrollments.map(e => <tr key={e.id}><td>{e.roll_no}</td><td>{e.student_name}</td><td>{e.course_code || e.code} - {e.course_name}</td><td>{new Date(e.enrolled_at).toLocaleString()}</td></tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}
