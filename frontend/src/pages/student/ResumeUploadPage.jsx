import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes`);
      if (response.data.success) {
        setResumes(response.data.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const validateFile = (file) => {
    setValidationError(null);
    setSuccessMessage(null);

    if (!file) {
      setValidationError('Please select a resume file.');
      return false;
    }

    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setValidationError('Invalid file format. Only PDF (.pdf) and Word documents (.docx) are supported.');
      return false;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      setValidationError('File size exceeds 5 MB limit. Please select a smaller file.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setValidationError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setValidationError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success && response.data.resume) {
        const newResume = response.data.resume;
        setSuccessMessage('Resume uploaded! Starting Phase 4 AI analysis...');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Trigger ML Analysis
        await handleTriggerAnalysis(newResume._id);
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Failed to upload resume file.');
      setUploading(false);
    }
  };

  const handleTriggerAnalysis = async (resumeId) => {
    setAnalyzingId(resumeId);
    setValidationError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/resumes/${resumeId}/analyze`);
      if (res.data.success) {
        navigate('/student/resume-analysis');
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Error running resume analysis with ML service.');
    } finally {
      setAnalyzingId(null);
      setUploading(false);
      fetchResumes();
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this uploaded resume?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/resumes/${id}`);
      fetchResumes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting resume');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  if (loading) {
    return <Loader message="Loading your resume documents..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Upload Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
          Resume Upload & Management
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Upload your resume in PDF or DOCX format. SkillSync Python ML Service will extract text, skills, and ATS scores.
        </p>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        className="card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #6366f1' : '2px dashed var(--border-color)',
          background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '2rem',
            margin: '0 auto 1rem auto'
          }}
        >
          📤
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
          Drag & Drop your resume here, or <span style={{ color: 'var(--cyan-accent)' }}>browse</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Supported formats: PDF, DOCX (Max size: 5 MB)
        </p>
      </div>

      {/* Selected File Card & Actions */}
      {selectedFile && (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.75rem' }}>
              {selectedFile.name.endsWith('.pdf') ? '📕' : '📘'}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Size: {formatFileSize(selectedFile.size)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleRemoveFile}
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f87171',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              Remove
            </button>

            <button
              onClick={handleUploadAndAnalyze}
              disabled={uploading}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              {uploading ? 'Uploading & Analyzing...' : 'Upload & Analyze Resume'}
            </button>
          </div>
        </div>
      )}

      {/* Validation / Success Notifications */}
      {validationError && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', fontSize: '0.875rem' }}>
          ⚠️ {validationError}
        </div>
      )}

      {successMessage && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.875rem' }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Uploaded Resumes List */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          Uploaded Resumes ({resumes.length})
        </h3>

        {resumes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="card"
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '1.1rem 1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>
                    {resume.originalName.endsWith('.pdf') ? '📕' : '📘'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {resume.originalName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()} • {formatFileSize(resume.fileSize)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span
                    className={
                      resume.analysisStatus === 'analyzed'
                        ? 'badge badge-success'
                        : resume.analysisStatus === 'failed'
                        ? 'badge badge-error'
                        : 'badge badge-pending'
                    }
                  >
                    {resume.analysisStatus || resume.status || 'uploaded'}
                  </span>

                  <button
                    onClick={() => handleTriggerAnalysis(resume._id)}
                    disabled={analyzingId === resume._id}
                    className="btn btn-primary"
                    style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
                  >
                    {analyzingId === resume._id ? 'Analyzing...' : 'Run Analysis'}
                  </button>

                  <button
                    onClick={() => navigate('/student/resume-analysis')}
                    className="btn"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
                  >
                    View Analysis
                  </button>

                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}
                    title="Delete resume"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📄"
            title="No Resumes Uploaded Yet"
            description="Upload your resume above to start resume analysis and ATS score calculations."
          />
        )}
      </div>
    </div>
  );
}
