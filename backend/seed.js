const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Department = require('./models/Department');
const Complaint = require('./models/Complaint');

let uri = process.env.MONGO_URI;

// Connect to DB wrapper
const connectAndSeed = async () => {
  if (!uri || uri === 'mongodb://127.0.0.1:27017/campusfix') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log('Using In-Memory Database for Seeding...');
  }
  await mongoose.connect(uri);
  await seedData();
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Department.deleteMany();
    await Complaint.deleteMany();
    console.log('Database cleared...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@campusfix.edu',
      password: 'password123', // Raw password, model pre-save will NOT trigger for insertMany but we use .create
      role: 'admin',
    });

    // 2. Create Departments & Heads
    const depts = [
      { name: 'Electrical', headName: 'John Spark' },
      { name: 'Plumbing', headName: 'Mario Bros' },
      { name: 'Furniture', headName: 'Woody Craft' },
    ];

    const createdDepts = [];
    const createdWorkers = [];

    for (const d of depts) {
      // Create Dept Head
      const headUser = new User({
        name: d.headName,
        email: `${d.name.toLowerCase()}@campusfix.edu`,
        password: 'password123',
        role: 'authority',
      });

      // Create Workers
      const workers = [];
      for (let i = 1; i <= 3; i++) {
        const worker = new User({
          name: `${d.name} Worker ${i}`,
          email: `${d.name.toLowerCase()}worker${i}@campusfix.edu`,
          password: 'password123',
          role: 'authority',
        });
        workers.push(worker);
      }

      await headUser.save();
      for (let w of workers) await w.save();

      const dept = await Department.create({
        name: d.name,
        headUser: headUser._id,
        workers: workers.map(w => w._id),
      });

      headUser.department = dept._id;
      await headUser.save();
      
      for(let w of workers) {
        w.department = dept._id;
        await w.save();
        createdWorkers.push(w);
      }

      createdDepts.push(dept);
    }

    // 3. Create Students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const student = await User.create({
        name: `Student ${i}`,
        email: `student${i}@campusfix.edu`,
        password: 'password123',
        role: 'student',
        collegeId: `STU${1000 + i}`,
      });
      students.push(student);
    }

    // 4. Create sample complaints
    const complaintsData = [
      {
        title: 'Broken Fan in Lecture Hall',
        description: 'The ceiling fan in the middle row is making loud noises and sparking.',
        category: 'Electrical',
        priority: 'High',
        status: 'Pending',
        roomNumber: 'LH-1',
        block: 'Academic Block',
        floor: 'Ground',
        submittedBy: students[0]._id,
        department: createdDepts[0]._id,
      },
      {
        title: 'Leaking Sink in Washroom',
        description: 'The tap on the left most sink is constantly dripping water.',
        category: 'Plumbing',
        priority: 'Medium',
        status: 'Assigned',
        roomNumber: 'Washroom 2',
        block: 'Hostel A',
        floor: '2nd',
        submittedBy: students[1]._id,
        assignedTo: createdWorkers[3]._id,
        department: createdDepts[1]._id,
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
      {
        title: 'Two Chairs completely broken',
        description: 'Two chairs in the back row have their legs broken off.',
        category: 'Furniture',
        priority: 'Low',
        status: 'Resolved',
        roomNumber: 'Class 304',
        block: 'Academic Block',
        floor: '3rd',
        submittedBy: students[2]._id,
        assignedTo: createdWorkers[6]._id,
        department: createdDepts[2]._id,
        resolvedAt: Date.now(),
        resolutionNote: 'Replaced the chairs with new stock from inventory.',
        rating: 5,
        feedback: 'Very quick service!',
      }
    ];

    await Complaint.insertMany(complaintsData);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectAndSeed();
