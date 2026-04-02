import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const initialForm = { company: '', role: '', status: 'Applied', location: '', link: '' };

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs`);
      setJobs(res.data);
      setError('');
    } catch (err) {
      setError('Could not load jobs. Start backend first.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = [job.company, job.role, job.location]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || job.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === 'Applied').length,
      interview: jobs.filter((j) => j.status === 'Interview').length,
      offer: jobs.filter((j) => j.status === 'Offer').length,
      rejected: jobs.filter((j) => j.status === 'Rejected').length
    };
  }, [jobs]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company || !form.role) {
      setError('Company and role are required.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/jobs/${editingId}`, form);
      } else {
        await axios.post(`${API_URL}/jobs`, form);
      }
      setForm(initialForm);
      setEditingId(null);
      setError('');
      fetchJobs();
    } catch (err) {
      setError('Could not save job.');
    }
  }

  function handleEdit(job) {
    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
      location: job.location || '',
      link: job.link || ''
    });
    setEditingId(job.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API_URL}/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError('Could not delete job.');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="badge">Full Stack Portfolio Project</p>
          <h1>Smart Job Tracker</h1>
          <p className="subtitle">
            Track applications, interviews, offers, and rejections in one clean dashboard.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Total Jobs" value={stats.total} />
        <StatCard label="Applied" value={stats.applied} />
        <StatCard label="Interview" value={stats.interview} />
        <StatCard label="Offer" value={stats.offer} />
        <StatCard label="Rejected" value={stats.rejected} />
      </section>

      <section className="content-grid">
        <div className="card">
          <h2>{editingId ? 'Update Job' : 'Add New Job'}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              placeholder="Application Link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <div className="button-row">
              <button type="submit">{editingId ? 'Update Job' : 'Add Job'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={() => { setForm(initialForm); setEditingId(null); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="card">
          <div className="toolbar">
            <h2>Job List</h2>
            <button className="secondary" onClick={fetchJobs}>Refresh</button>
          </div>
          <div className="filters">
            <input
              placeholder="Search company, role, location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <div className="job-item" key={job.id}>
                  <div>
                    <h3>{job.role}</h3>
                    <p>{job.company}</p>
                    <p>{job.location}</p>
                    <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                    {job.link && (
                      <p>
                        <a href={job.link} target="_blank" rel="noreferrer">Open link</a>
                      </p>
                    )}
                  </div>
                  <div className="actions">
                    <button className="secondary" onClick={() => handleEdit(job)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(job.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}
