const http = require('http');

function makeJsonRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function makeMultipartRequest(options, fileContent, filename, mimetype) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    
    let header = `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="resume"; filename="${filename}"\r\n`;
    header += `Content-Type: ${mimetype}\r\n\r\n`;
    
    const footer = `\r\n--${boundary}--\r\n`;

    const payload = Buffer.concat([
      Buffer.from(header, 'utf8'),
      Buffer.from(fileContent),
      Buffer.from(footer, 'utf8')
    ]);

    options.headers = {
      ...options.headers,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': payload.length
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runPhase4Tests() {
  console.log('=== SKILLSYNC PHASE 4 RESUME PARSING + ATS + AI/ML TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const student1Email = `phase4_student1_${timestamp}@univ.edu`;
  const student2Email = `phase4_student2_${timestamp}@univ.edu`;
  const password = 'Password123!';

  let s1Token = '';
  let s2Token = '';

  try {
    // 1. Direct Python ML Service Health Check
    const mlHealth = await makeJsonRequest({
      hostname: 'localhost', port: 8000, path: '/health', method: 'GET'
    });
    assert(mlHealth.status === 200 && mlHealth.data.status === 'healthy', 'Python ML Microservice Health Check (200 OK)');

    // 2. Direct Python ML Service Skill Extraction
    const mlSkillRes = await makeJsonRequest({
      hostname: 'localhost', port: 8000, path: '/api/ml/extract-skills', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { text: 'Experienced candidate in Python, React, Node.js, Express, MongoDB, and Docker.' });
    assert(mlSkillRes.status === 200 && mlSkillRes.data.skills.includes('React') && mlSkillRes.data.skills.includes('Python'), 'ML Service Skill Extraction Endpoint (200 OK)');

    // 3. Register Students
    const s1Reg = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { fullName: 'Alice Smith', email: student1Email, password, confirmPassword: password, role: 'student' });
    s1Token = s1Reg.data.token;

    const s2Reg = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { fullName: 'Bob Jones', email: student2Email, password, confirmPassword: password, role: 'student' });
    s2Token = s2Reg.data.token;

    // 4. Upload PDF Resume containing realistic resume text
    const sampleResumeText = `
    Alice Smith
    Email: alice.smith@univ.edu
    Phone: (555) 123-4567
    LinkedIn: linkedin.com/in/alicesmith

    PROFESSIONAL SUMMARY
    Dedicated Full Stack Software Developer with expertise in building scalable web applications.

    SKILLS
    Python, JavaScript, TypeScript, React, Node.js, Express, MongoDB, SQL, Git, Docker, REST API

    EDUCATION
    Bachelor of Science in Computer Science - Stanford University (2022 - 2026)

    WORK EXPERIENCE
    Software Engineer Intern - TechCorp Solutions (2025 - Present)
    Developed responsive React dashboards and optimized Express REST API endpoints.

    PROJECTS
    SkillSync AI Resume Parser - Built using FastAPI, Python, and React.
    `;

    const uploadPdfRes = await makeMultipartRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes/upload', method: 'POST',
      headers: { Authorization: `Bearer ${s1Token}` }
    }, sampleResumeText, 'Alice_Smith_Resume.pdf', 'application/pdf');
    assert(uploadPdfRes.status === 201 && uploadPdfRes.data.resume._id, 'Resume Upload for Analysis (201 Created)');
    const resumeId = uploadPdfRes.data.resume._id;

    // 5. Trigger Backend Analysis (calls ML Service)
    const analyzeRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/resumes/${resumeId}/analyze`, method: 'POST',
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    console.log('Analyze response status:', analyzeRes.status, 'data:', analyzeRes.data);
    assert(analyzeRes.status === 200 && analyzeRes.data?.resume?.analysisStatus === 'analyzed', 'Backend Trigger Resume Analysis (200 OK)');
    assert(analyzeRes.data.resume.atsScore > 0, 'ATS Score Calculation Computed');
    assert(analyzeRes.data.resume.detectedSkills.includes('React'), 'Detected Skills Extracted from Resume');

    // 6. Retrieve Resume Analysis
    const getAnalysisRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/resumes/${resumeId}/analysis`, method: 'GET',
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    assert(getAnalysisRes.status === 200 && getAnalysisRes.data.parsedData.contact.email === 'alice.smith@univ.edu', 'GET Resume Analysis Endpoint (200 OK)');
    assert(getAnalysisRes.data.atsBreakdown.recommendations.length > 0, 'Actionable Recommendations Generated');

    // 7. Verify Student Profile Skills Auto-Updated
    const profileRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/profile', method: 'GET',
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    assert(profileRes.status === 200 && profileRes.data.profile.skills.includes('React'), 'User Profile Skills Automatically Updated');

    // 8. Cross-User Authorization Check (Student 2 cannot access Student 1 analysis)
    const s2AccessAnalysis = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/resumes/${resumeId}/analysis`, method: 'GET',
      headers: { Authorization: `Bearer ${s2Token}` }
    });
    assert(s2AccessAnalysis.status === 403, 'Cross-User Analysis Access Blocked (403 Forbidden)');

    console.log(`\n==================================================`);
    console.log(`PHASE 4 SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log(`==================================================\n`);

  } catch (err) {
    console.error('Phase 4 test script error:', err);
  }
}

runPhase4Tests();
