import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/ui/Loader';
import ErrorState from '../../components/ui/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, resumeRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/profile`),
        axios.get(`${API_BASE_URL}/resumes`)
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
        const prof = profileRes.value.data.profile;
        setProfile(prof);
        setFormData({
          fullName: prof.fullName || '',
          phone: prof.phone || '',
          bio: prof.bio || '',
          college: prof.college || '',
          degree: prof.degree || '',
          branch: prof.branch || '',
          graduationYear: prof.graduationYear || '',
          skills: prof.skills || []
        });
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value.data.success) {
        setResumes(resumeRes.value.data.resumes || []);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (formData.skills.includes(skillInput.trim())) {
      setSkillInput('');
      return;
    }
    setFormData({
      ...formData,
      skills: [...formData.skills, skillInput.trim()]
    });
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, formData);
      if (response.data.success) {
        setProfile(response.data.profile);
        setSaveSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching student profile details..." />;
  }

  if (error && !profile) {
    return <ErrorState message={error} onRetry={fetchProfileData} />;
  }

  const latestResume = resumes.length > 0 ? resumes[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff'
            }}
          >
            {profile?.fullName?.charAt(0).toUpperCase() || 'S'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
              {profile?.fullName}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {profile?.email} • Role: <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Student</span>
            </p>
            {profile?.college && (
              <p style={{ fontSize: '0.825rem', color: 'var(--cyan-accent)', marginTop: '4px' }}>
                🎓 {profile?.college} {profile?.degree ? `(${profile?.degree})` : ''}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setSaveSuccess(null);
          }}
          className="btn btn-primary"
          style={{ padding: '0.55rem 1.25rem' }}
        >
          {isEditing ? 'Cancel Editing' : '✏️ Edit Profile'}
        </button>
      </div>

      {saveSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.875rem' }}>
          ✅ {saveSuccess}
        </div>
      )}

      {/* Profile Form (Edit Mode) */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Edit Student Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Stanford University"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Degree
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Science"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Branch / Field of Study
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2026"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Short Professional Bio
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell recruiters about your goals and career interests..."
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
            />
          </div>

          {/* Skill Tag Editor */}
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Technical Skills
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill (e.g. React, Node.js) and click Add"
                style={{ flex: 1, padding: '0.55rem 0.85rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
              <button onClick={handleAddSkill} type="button" className="btn btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                + Add Skill
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.skills && formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {skill}
                  <span
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ cursor: 'pointer', fontWeight: 700, color: '#f87171' }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* Profile Display Mode */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Academic & Info Overview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              🎓 Academic Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>College / University</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{profile?.college || 'Not specified'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Degree & Branch</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>
                  {profile?.degree || 'N/A'} {profile?.branch ? `— ${profile.branch}` : ''}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Graduation Year</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{profile?.graduationYear || 'Not specified'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Contact Phone</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{profile?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Skills & Bio */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              🛠️ Skills & Biography
            </h3>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Professional Bio</span>
              <p style={{ fontSize: '0.875rem', color: profile?.bio ? '#fff' : 'var(--text-muted)' }}>
                {profile?.bio || 'No professional bio added yet. Click Edit Profile to add your bio.'}
              </p>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Skills ({profile?.skills?.length || 0})</span>
              {profile?.skills && profile.skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#818cf8',
                        fontWeight: 600
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed.</span>
              )}
            </div>
          </div>

          {/* Resume Reference */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              📄 Active Resume Document
            </h3>

            {latestResume ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>
                    {latestResume.originalName.endsWith('.pdf') ? '📕' : '📘'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {latestResume.originalName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Uploaded on {new Date(latestResume.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <span className="badge badge-success">Active Document</span>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No active resume document found on profile. Upload your resume under Resume Upload.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
