const http = require('http');

function makeRequest(options, body = null) {
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

async function runAuthTests() {
  console.log('=== SKILLSYNC PHASE 2 AUTHENTICATION & RBAC AUTOMATED SUITE ===\n');
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
  const studentEmail = `student_${timestamp}@university.edu`;
  const recruiterEmail = `recruiter_${timestamp}@company.com`;
  const password = 'Password123!';

  let studentToken = '';
  let recruiterToken = '';
  let adminToken = '';

  try {
    // 1. Student Registration
    const regStudentRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Test Student',
      email: studentEmail,
      password: password,
      confirmPassword: password,
      role: 'student'
    });

    assert(regStudentRes.status === 201 && regStudentRes.data.success, 'Student Registration (201 Created)');
    assert(regStudentRes.data.token && regStudentRes.data.user.role === 'student', 'Student JWT Token Returned');
    assert(!regStudentRes.data.user.password, 'Password Excluded in Registration Response');

    // 2. Recruiter Registration
    const regRecruiterRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Test Recruiter',
      email: recruiterEmail,
      password: password,
      confirmPassword: password,
      role: 'recruiter'
    });

    assert(regRecruiterRes.status === 201 && regRecruiterRes.data.user.role === 'recruiter', 'Recruiter Registration (201 Created)');

    // 3. Attempt Public Admin Registration (Must be Rejected)
    const regAdminRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Fake Admin',
      email: `fakeadmin_${timestamp}@admin.com`,
      password: password,
      confirmPassword: password,
      role: 'admin'
    });

    assert(regAdminRes.status === 400 && !regAdminRes.data.success, 'Public Admin Registration Blocked (400 Bad Request)');

    // 4. Duplicate Email Registration (Must be Rejected)
    const dupRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Duplicate User',
      email: studentEmail,
      password: password,
      confirmPassword: password,
      role: 'student'
    });

    assert(dupRes.status === 400 && dupRes.data.message.includes('already exists'), 'Duplicate Email Blocked (400 Bad Request)');

    // 5. Invalid Login
    const invalidLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: studentEmail,
      password: 'WrongPassword123'
    });

    assert(invalidLoginRes.status === 401, 'Invalid Password Rejected (401 Unauthorized)');

    // 6. Valid Student Login
    const studentLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: studentEmail,
      password: password
    });

    assert(studentLoginRes.status === 200 && studentLoginRes.data.token, 'Student Login Successful (200 OK)');
    studentToken = studentLoginRes.data.token;

    // Valid Recruiter Login
    const recruiterLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: recruiterEmail,
      password: password
    });

    assert(recruiterLoginRes.status === 200 && recruiterLoginRes.data.token, 'Recruiter Login Successful (200 OK)');
    recruiterToken = recruiterLoginRes.data.token;

    // Admin Login (Seeded account)
    const adminLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@skillsync.com',
      password: 'Admin@123456'
    });

    assert(adminLoginRes.status === 200 && adminLoginRes.data.user.role === 'admin', 'Seeded Admin Login Successful (200 OK)');
    adminToken = adminLoginRes.data.token;

    // 7. GET /api/auth/me without token (Must fail)
    const noTokenMe = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET'
    });

    assert(noTokenMe.status === 401, 'Protected Route without Token Rejected (401 Unauthorized)');

    // 8. GET /api/auth/me with Student token
    const studentMe = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });

    assert(studentMe.status === 200 && studentMe.data.user.email === studentEmail, 'GET /api/auth/me Verified Student Token');

    // 9. Role-based Protection: Student accessing Recruiter Route (Must fail with 403)
    const studentAccessRecruiter = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/test/recruiter-only',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });

    assert(studentAccessRecruiter.status === 403, 'Student Accessing Recruiter Route Forbidden (403 Forbidden)');

    // 10. Role-based Protection: Recruiter accessing Admin Route (Must fail with 403)
    const recruiterAccessAdmin = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/test/admin-only',
      method: 'GET',
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });

    assert(recruiterAccessAdmin.status === 403, 'Recruiter Accessing Admin Route Forbidden (403 Forbidden)');

    // 11. Admin Accessing Admin Route (Must succeed with 200)
    const adminAccessAdmin = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/test/admin-only',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    assert(adminAccessAdmin.status === 200 && adminAccessAdmin.data.success, 'Admin Accessing Admin Route Granted (200 OK)');

    // 12. Forgot Password Request
    const forgotRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: studentEmail
    });

    assert(forgotRes.status === 200 && forgotRes.data.resetToken, 'Forgot Password Token Generation (200 OK)');

    // 13. Reset Password using Token
    const resetToken = forgotRes.data.resetToken;
    const newPassword = 'NewSecretPassword123!';
    const resetRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      resetToken: resetToken,
      password: newPassword,
      confirmPassword: newPassword
    });

    assert(resetRes.status === 200 && resetRes.data.token, 'Reset Password Successful (200 OK)');

    // 14. Verify Login with New Password
    const newPasswordLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: studentEmail,
      password: newPassword
    });

    assert(newPasswordLoginRes.status === 200, 'Login with Reset Password Verified');

    console.log(`\n==================================================`);
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log(`==================================================\n`);

  } catch (err) {
    console.error('Test script error:', err);
  }
}

runAuthTests();
