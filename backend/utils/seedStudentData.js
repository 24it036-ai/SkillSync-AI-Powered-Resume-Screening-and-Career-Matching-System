const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job.model');
const Course = require('../models/Course.model');

dotenv.config();

const sampleJobs = [
  {
    title: 'Frontend React Developer',
    company: 'TechCorp Solutions',
    companyLogo: '💻',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$90,000 - $110,000 / year',
    jobType: 'Full-time',
    description: 'Looking for a passionate React developer with strong JavaScript, CSS, and modern web application skills to build high-performance client dashboards.',
    requiredSkills: ['React', 'JavaScript', 'CSS3', 'TypeScript', 'Git'],
    experienceLevel: 'Entry-level',
    isActive: true
  },
  {
    title: 'Full Stack Node.js Engineer',
    company: 'CloudScale Innovations',
    companyLogo: '☁️',
    location: 'Austin, TX (Remote)',
    salary: '$95,000 - $120,000 / year',
    jobType: 'Full-time',
    description: 'Join our cloud infrastructure team to build scalable REST APIs, microservices, and interactive frontend interfaces using React, Express, and MongoDB.',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'React', 'REST API'],
    experienceLevel: 'Mid-level',
    isActive: true
  },
  {
    title: 'AI / Data Science Intern',
    company: 'Nexus AI Labs',
    companyLogo: '🤖',
    location: 'New York, NY (On-site)',
    salary: '$35 - $45 / hour',
    jobType: 'Internship',
    description: 'Work closely with Senior Data Scientists to build machine learning models, NLP text parsers, and recommendation pipelines in Python and PyTorch.',
    requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'Scikit-Learn', 'SQL'],
    experienceLevel: 'Entry-level',
    isActive: true
  },
  {
    title: 'Junior DevOps Engineer',
    company: 'NextGen Systems',
    companyLogo: '🚀',
    location: 'Seattle, WA (Hybrid)',
    salary: '$85,000 - $105,000 / year',
    jobType: 'Full-time',
    description: 'Manage CI/CD pipelines, Docker containers, AWS Cloud resources, and automated deployment scripts for modern enterprise applications.',
    requiredSkills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Python'],
    experienceLevel: 'Entry-level',
    isActive: true
  }
];

const sampleCourses = [
  {
    courseName: 'Full Stack Web Development with MERN',
    platform: 'SkillSync Academy',
    instructor: 'Dr. Sarah Jenkins',
    rating: 4.9,
    duration: '24 hours',
    difficulty: 'Intermediate',
    skillCovered: 'React, Node.js, Express, MongoDB',
    progress: 0,
    link: 'https://coursera.org'
  },
  {
    courseName: 'Practical Python for Data Science & ML',
    platform: 'Udemy',
    instructor: 'Alex Rivera',
    rating: 4.8,
    duration: '18 hours',
    difficulty: 'Beginner',
    skillCovered: 'Python, Data Analysis, Pandas, Scikit-Learn',
    progress: 0,
    link: 'https://udemy.com'
  },
  {
    courseName: 'Mastering Modern Data Structures & Algorithms',
    platform: 'edX',
    instructor: 'Prof. Michael Chang',
    rating: 4.7,
    duration: '30 hours',
    difficulty: 'Advanced',
    skillCovered: 'Data Structures, Algorithms, Problem Solving',
    progress: 0,
    link: 'https://edx.org'
  },
  {
    courseName: 'Cloud Native DevOps & Docker Fundamentals',
    platform: 'Pluralsight',
    instructor: 'Elena Rostova',
    rating: 4.9,
    duration: '12 hours',
    difficulty: 'Intermediate',
    skillCovered: 'Docker, CI/CD, Kubernetes, Linux',
    progress: 0,
    link: 'https://pluralsight.com'
  }
];

async function seedData() {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillsync';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB for seeding sample jobs & courses...');

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany(sampleJobs);
      console.log(`[Seed] Successfully inserted ${sampleJobs.length} sample jobs.`);
    } else {
      console.log(`[Seed] Jobs collection already contains ${jobCount} documents. Skipping job seed.`);
    }

    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      await Course.insertMany(sampleCourses);
      console.log(`[Seed] Successfully inserted ${sampleCourses.length} sample courses.`);
    } else {
      console.log(`[Seed] Courses collection already contains ${courseCount} documents. Skipping course seed.`);
    }

    await mongoose.disconnect();
    console.log('[Seed] Seeding completed.');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
  }
}

seedData();
