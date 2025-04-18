require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcrypt");

// Database connection configuration
const client = new Client({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT || 5432, 
});

// User data with hashed passwords
const users = [
  {
    username: "chrissy",
    email: "chrissy.com",
    password: "$2b$12$2R3oRzhj.MTz5SGcUGgjf.LJBBsYIZZl0Rm2imBi04fXj/OD9Mz8G",
    job_title: "data analyst",
    contact: "+263 71 234 5678",
    role: "admin",
    department: "Marketing",
  },
  {
    username: "lewis",
    email: "lewis.luwi.com",
    password: "$2b$12$ZqExiEiYh58CV7QyMrNUhutt8xcCCqTzI5tGlotg1tGTId1BoyMdu",
    job_title: "Software Developer",
    contact: "+263 71 123 4567",
    role: "teamleader",
    department: "IT",
  },
  {
    username: "vanessa",
    email: "vanessa.com",
    password: "$2b$12$0A99cfO3souC3cGtroYQV.7xlSbDjzeOSLK3Ds0N4pUfVSchsAGVK",
    job_title: "Customer Support Agent",
    contact: "+263 71 345 6789",
    role: "agent",
    department: "Support",
  },
];

// Function to seed the database
const seedUsers = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to the database");

    // Insert each user into the database
    for (const user of users) {
      const query = `
        INSERT INTO users (username, email, password, job_title, contact, role, department)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [
        user.username,
        user.email,
        user.password,
        user.job_title,
        user.contact,
        user.role,
        user.department,
      ];

      await client.query(query, values);
      console.log(`✅ Inserted user: ${user.username}`);
    }

    console.log("✅ 3 users seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (error.code === "23505") {
      console.log("❌ Error: One of the usernames or emails already exists");
    }
  } finally {
    await client.end();
    console.log("✅ Disconnected from the database");
  }
};

// Run the seed function
seedUsers();
