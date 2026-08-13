const http = require('http');
const fs = require('fs');
const path = require('path');

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

async function runPhase3Tests() {
  console.log('=== SKILLSYNC PHASE 3 STUDENT MODULE AUTOMATED TEST SUITE ===\n');
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
  const student1Email = `student1_${timestamp}@univ.edu`;
  const student2Email = `student2_${timestamp}@univ.edu`;
  const recruiterEmail = `recruiter_${timestamp}@corp.com`;
  const password = 'Password123!';

  let student1Token = '';
  let student2Token = '';
  let recruiterToken = '';

  try {
    // 1. Register Student 1
    const s1Reg = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { fullName: 'Student One', email: student1Email, password, confirmPassword: password, role: 'student' });
    assert(s1Reg.status === 201 && s1Reg.data.token, 'Student 1 Registration (201 Created)');
    student1Token = s1Reg.data.token;

    // Register Student 2
    const s2Reg = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { fullName: 'Student Two', email: student2Email, password, confirmPassword: password, role: 'student' });
    student2Token = s2Reg.data.token;

    // Register Recruiter
    const recReg = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { fullName: 'Recruiter One', email: recruiterEmail, password, confirmPassword: password, role: 'recruiter' });
    recruiterToken = recReg.data.token;

    // 2. Unauthenticated access blocked on /api/profile
    const unauthRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/profile', method: 'GET'
    });
    assert(unauthRes.status === 401, 'Unauthenticated Access Blocked (401 Unauthorized)');

    // 3. Recruiter forbidden from student resume routes
    const recAccessStudent = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes', method: 'GET',
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    assert(recAccessStudent.status === 403, 'Recruiter Accessing Student Route Forbidden (403 Forbidden)');

    // 4. Student 1 Profile Retrieval
    const profGet = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/profile', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(profGet.status === 200 && profGet.data.profile.email === student1Email, 'Student Profile Retrieval (200 OK)');

    // 5. Student 1 Profile Update
    const profUpdate = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/profile', method: 'PUT',
      headers: { Authorization: `Bearer ${student1Token}`, 'Content-Type': 'application/json' }
    }, {
      college: 'MIT University',
      degree: 'B.S.',
      branch: 'Computer Science',
      graduationYear: '2026',
      skills: ['React', 'Node.js', 'Python']
    });
    assert(profUpdate.status === 200 && profUpdate.data.profile.college === 'MIT University', 'Student Profile Update (200 OK)');

    // 6. Resume Upload PDF
    const samplePdfContent = '%PDF-1.4 sample pdf content for resume upload testing';
    const pdfUploadRes = await makeMultipartRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes/upload', method: 'POST',
      headers: { Authorization: `Bearer ${student1Token}` }
    }, samplePdfContent, 'resume.pdf', 'application/pdf');
    assert(pdfUploadRes.status === 201 && pdfUploadRes.data.resume.originalName === 'resume.pdf', 'Resume PDF Upload (201 Created)');
    const s1ResumeId = pdfUploadRes.data.resume._id;

    // 7. Resume Upload DOCX
    const sampleDocxContent = 'PK\x03\x04 sample docx content';
    const docxUploadRes = await makeMultipartRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes/upload', method: 'POST',
      headers: { Authorization: `Bearer ${student1Token}` }
    }, sampleDocxContent, 'resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    assert(docxUploadRes.status === 201 && docxUploadRes.data.resume.originalName === 'resume.docx', 'Resume DOCX Upload (201 Created)');

    // 8. Invalid File Type Rejected (.txt)
    const invalidUploadRes = await makeMultipartRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes/upload', method: 'POST',
      headers: { Authorization: `Bearer ${student1Token}` }
    }, 'invalid text content', 'resume.txt', 'text/plain');
    assert(invalidUploadRes.status === 400 && !invalidUploadRes.data.success, 'Invalid File Type Rejected (400 Bad Request)');

    // 9. Resume Listing
    const resumeListRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/resumes', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(resumeListRes.status === 200 && resumeListRes.data.resumes.length >= 2, 'Student Resume Listing (200 OK)');

    // 10. Student 2 cannot access Student 1 resume (403 Forbidden)
    const s2AccessS1Resume = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/resumes/${s1ResumeId}`, method: 'GET',
      headers: { Authorization: `Bearer ${student2Token}` }
    });
    assert(s2AccessS1Resume.status === 403, 'Cross-Student Resume Access Forbidden (403 Forbidden)');

    // 11. Resume Deletion
    const deleteResumeRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/resumes/${s1ResumeId}`, method: 'DELETE',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(deleteResumeRes.status === 200, 'Student Resume Deletion (200 OK)');

    // 12. Job Listing
    const jobsRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/jobs', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(jobsRes.status === 200 && jobsRes.data.jobs.length > 0, 'Job Listing (200 OK)');
    const targetJobId = jobsRes.data.jobs[0]._id;

    // 13. Save Job
    const saveJobRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/jobs/${targetJobId}/save`, method: 'POST',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(saveJobRes.status === 201, 'Save Job (201 Created)');

    // 14. Saved Jobs Listing
    const savedJobsListRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/jobs/saved', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(savedJobsListRes.status === 200 && savedJobsListRes.data.savedJobs.length > 0, 'Saved Jobs Listing (200 OK)');

    // 15. Unsave Job
    const unsaveJobRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: `/api/jobs/${targetJobId}/save`, method: 'DELETE',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(unsaveJobRes.status === 200, 'Remove Saved Job (200 OK)');

    // 16. Application Submission
    const appSubmitRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/applications', method: 'POST',
      headers: { Authorization: `Bearer ${student1Token}`, 'Content-Type': 'application/json' }
    }, { jobId: targetJobId, notes: 'Excited to apply!' });
    assert(appSubmitRes.status === 201 && appSubmitRes.data.application.status === 'Applied', 'Application Submission (201 Created)');

    // 17. Application Listing
    const appListRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/applications', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(appListRes.status === 200 && appListRes.data.applications.length > 0, 'Application Listing (200 OK)');

    // 18. Notifications Listing
    const notifsRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/notifications', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(notifsRes.status === 200, 'Notifications Listing (200 OK)');

    // 19. Recommended Courses Listing
    const coursesRes = await makeJsonRequest({
      hostname: 'localhost', port: 5000, path: '/api/courses/recommended', method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` }
    });
    assert(coursesRes.status === 200 && coursesRes.data.courses.length > 0, 'Recommended Courses Listing (200 OK)');

    console.log(`\n==================================================`);
    console.log(`PHASE 3 SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log(`==================================================\n`);

  } catch (err) {
    console.error('Phase 3 test script error:', err);
  }
}

runPhase3Tests();
