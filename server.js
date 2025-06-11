require("dotenv").config({ path: "./.env" })

const express = require("express");
const path = require('path');

const mysql = require("mysql2/promise");
const multer = require('multer');
const cors = require("cors");
const crypto = require('crypto');
const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage()  });

app.use(express.static(path.join(__dirname, 'public')));


let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    console.log("✅ Connected to MySQL Database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();




app.get("/timetable/student/:studentId", async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Step 1: Get the section of the student
        const [[{ section_id }]] = await db.query(
            "SELECT section_id FROM Takes WHERE student_id = ?",
            [studentId]
        );

        // Step 2: Get all teaches_id entries for this section, including faculty name
        const [teaches] = await db.query(
            "SELECT c.name AS course_name, f.faculty_id, u.name AS faculty_name, ts.day, ts.time FROM Teaches t JOIN Course c ON t.course_id = c.course_id JOIN Faculty f ON t.faculty_id = f.faculty_id JOIN User u ON f.user_id = u.user_id JOIN Teaches_Schedule ts ON ts.teaches_id = t.teaches_id JOIN Takes tk ON t.section_id = tk.section_id WHERE tk.student_id = ?",
            [studentId]
        );

        res.json(teaches);
    } catch (err) {
        console.error("Error fetching timetable:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/timetable/faculty/:facultyId', async (req, res) => {
    const facultyId = req.params.facultyId;

    try {
        // Query to fetch the timetable for the faculty's section
        const [timetable] = await db.query("SELECT ts.day, ts.time, c.name AS course_name, u.name AS faculty_name FROM Teaches_Schedule ts JOIN Teaches t ON ts.teaches_id = t.teaches_id JOIN Course c ON t.course_id = c.course_id JOIN Faculty f ON t.faculty_id = f.faculty_id JOIN User u ON f.user_id = u.user_id WHERE f.faculty_id = ?", [facultyId]);

        // Check if timetable is empty
        if (timetable.length === 0) {
            return res.status(404).json({ message: 'No timetable found for this faculty.' });
        }

        // Convert any potential buffers to strings if necessary
        

        // Send the timetable data
        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: 'Error fetching timetable' });
    }
});

app.get('/user-profile/:userId', async (req, res) => {
    console.log("📥 /user-profile hit with ID:", req.params.userId);
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    try {
        const [userResults] = await db.query('SELECT name, role FROM User WHERE user_id = ?', [userId]);
        
        if (userResults.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const { name, role } = userResults[0];
        console.log("name and role: ", name, role);

        const [emailResults] = await db.query('SELECT email FROM User_Email WHERE user_id = ?', [userId]);
        const email = emailResults[0]?.email || null;

        if (role.toLowerCase() === 'admin') {
            console.log("📥 admin hit");
            const [adminResults] = await db.query(`
                SELECT a.admin_id, ai.admin_type
                FROM Admin a
                JOIN Admin_Info ai ON a.admin_id = ai.admin_id
                WHERE a.user_id = ?`, [userId]);

            if (adminResults.length === 0) {
                return res.status(404).json({ success: false, error: 'Admin record not found' });
            }

            const { admin_id, admin_type } = adminResults[0];
            return res.json({
                success: true,
                user: {
                    user_id: userId,
                    name,
                    role,
                    email,
                    admin_id,
                    admin_type
                }
            });
        }

        if (role.toLowerCase() === 'faculty') {
            console.log("📥 faculty hit");
            const [facultyResults] = await db.query(`
                SELECT f.faculty_id, c.name AS course_name, s.section_id
                FROM Faculty f
                JOIN Teaches t ON f.faculty_id = t.faculty_id
                JOIN Course c ON t.course_id = c.course_id
                JOIN Section s ON t.section_id = s.section_id
                WHERE f.user_id = ?`, [userId]);

            if (facultyResults.length === 0) {
                return res.status(404).json({ success: false, error: 'Faculty record not found' });
            }

            const faculty_id = facultyResults[0].faculty_id;
            const teaches = facultyResults.map(row => ({
                course_name: row.course_name,
                section_id: row.section_id
            }));

            return res.json({
                success: true,
                user: {
                    user_id: userId,
                    name,
                    role,
                    email,
                    faculty_id,
                    teaches
                }
            });
        }

        if (role.toLowerCase() === 'student') {
            console.log("📥 student hit");
            const [studentResults] = await db.query(`
                SELECT s.student_id, tk.section_id
                FROM Student s
                JOIN Takes tk ON s.student_id = tk.student_id
                WHERE s.user_id = ?`, [userId]);

            if (studentResults.length === 0) {
                return res.status(404).json({ success: false, error: 'Student record not found' });
            }

            const { student_id, section_id } = studentResults[0];
            return res.json({
                success: true,
                user: {
                    user_id: userId,
                    name,
                    role,
                    email,
                    student_id,
                    section_id
                }
            });
        }

        return res.status(400).json({ success: false, error: 'Unknown role' });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});






app.get("/api/discussions", async (req, res) => {
    try {
      // Get all discussions with user names
      const [discussions] = await db.query(`
        SELECT d.discussion_id, d.message, d.timestamp, u.name AS sender, u.role
        FROM Discussion d
        JOIN User u ON d.user_id = u.user_id
        ORDER BY d.timestamp DESC
      `);
  
      // Get all replies with user names
      const [replies] = await db.query(`
        SELECT r.reply_id, r.discussion_id, r.answer AS message, r.timestamp, u.name AS sender, u.role
        FROM Reply r
        JOIN User u ON r.user_id = u.user_id
        ORDER BY r.timestamp ASC
      `);
  
      // Group replies under their respective discussions
      const discussionMap = {};
      discussions.forEach(d => {
        discussionMap[d.discussion_id] = { ...d, replies: [] };
      });
  
      replies.forEach(r => {
        if (discussionMap[r.discussion_id]) {
          discussionMap[r.discussion_id].replies.push({
            reply_id: r.reply_id,
            sender: r.sender,
            message: r.message,
            timestamp: r.timestamp,
            role: r.role
          });
        }
      });
  
      // Convert map to array
      const result = Object.values(discussionMap);
  
      res.json(result);
    } catch (err) {
      console.error("Error fetching discussions:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



app.get("/users", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM User JOIN User_Email ON User.user_id = User_Email.user_id");
        res.json({ success: true, users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error retrieving users" });
    }
});


app.get('/courses', async (req, res) => {
    try {
        const query = 'SELECT * FROM Course';
        const [courses] = await db.execute(query);

        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: 'No courses found' });
        }

        console.log('Courses retrieved:', courses);  
        res.json({ success: true, courses });  
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ success: false, message: 'Error fetching courses' });
    }
});

// Call the procedure



app.get('/user-profile/plsql/:user_id', async (req, res) => {
    const userId = req.params.user_id;
  
    try {
      const conn = await pool.getConnection();
  
      
      const [rows] = await conn.query('CALL GET_USER_PROFILE_INFO(?)', [userId]);
  
      conn.release();
  
      
      res.json({ success: true, data: rows[0] });
  
    } catch (err) {
      console.error('Error executing procedure:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });



//nested suquery

  app.get('/faculty/valid-course-match', async (req, res) => {
    try {
      const conn = await pool.getConnection();
  
      const [rows] = await conn.query(`
        SELECT *
        FROM Faculty f
        WHERE EXISTS (
          SELECT *
          FROM Teaches t1
          JOIN Section s1 ON t1.section_id = s1.section_id
          WHERE t1.faculty_id = f.faculty_id
            AND t1.course_id = (
              SELECT t2.course_id
              FROM Teaches t2
              WHERE t2.faculty_id = f.faculty_id
             
            )
        )
      `);
  
      conn.release();
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error('Error executing subquery:', err);
      res.status(500).json({ success: false, error: err.message });
    }
});
  
  
app.get('/dashboard/stats', async (req, res) => {
    try {
     
  
      const [[{ total_users }]] = await db.query(`SELECT COUNT(*) AS total_users FROM \`User\`;`);
      const [[{ total_faculty }]] = await db.query(`SELECT COUNT(*) AS total_faculty FROM Faculty;`);
      const [[{ total_students }]] = await db.query(`SELECT COUNT(*) AS total_students FROM Student;`);
      const [[{ total_resources }]] = await db.query(`SELECT COUNT(*) AS total_resources FROM Resource;`);
      const [[{ total_courses }]] = await db.query(`SELECT COUNT(*) AS total_courses FROM Course;`);
      const [[{ total_enrollments }]] = await db.query(`SELECT COUNT(*) AS total_enrollments FROM Takes;`);
      const [[{ total_credits }]] = await db.query(`SELECT SUM(credits) AS total_credits FROM Course;`);
      const [[{ total_sections }]] = await db.query(`SELECT Count(*) AS total_sections FROM Section;`);
      
  
      res.json({
        success: true,
        data: {
          total_users,
          total_faculty,
          total_students,
          total_resources,
          total_courses,
          total_enrollments,
          total_credits,
          total_sections
        }
      });
    } catch (err) {
      console.error('Dashboard stats error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  


app.get('/sections', async (req, res) => {
    try {
        const query = 'SELECT * FROM Section';
        const [sections] = await db.execute(query);

        if (!sections || sections.length === 0) {
            return res.status(404).json({ success: false, message: 'No sections found' });
        }

       
        res.json({ success: true, sections });  // Send courses as a response
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({ success: false, message: 'Error fetching sections' });
    }
});

app.get('/resources/:id/download', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const [rows] = await db.query('SELECT file_name, file_type, file_data FROM Resource WHERE resource_id = ?', [resourceId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      const file = rows[0];
  
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.file_name}"`,
        'Content-Length': file.file_data.length
      });
  
      res.send(file.file_data);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ success: false, message: "Error downloading file" });
    }
});

app.get("/resources", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.resource_id, r.file_name, r.file_type, r.file_size, u.name AS uploaded_by
            FROM Resource r
            JOIN User u ON r.uploaded_by = u.user_id
            ORDER BY r.resource_id DESC
        `);
        res.json({ success: true, resources: rows });
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({ success: false, message: "Error fetching resources" });
    }
});




///////////////////////////////////


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [users] = await db.execute(
        `SELECT * FROM User NATURAL JOIN User_Email WHERE email = ? AND password = ?`, 
        [email, password]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = users[0];
  
      const sessionId = crypto.randomUUID();
      const sessionData = JSON.stringify({
        user_id: user.user_id,
        name: user.name,
        role: user.role
      });
  
      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 hours from now
  
      await db.execute(`
        INSERT INTO Session (session_id, user_id, session_data, expiry) 
        VALUES (?, ?, ?, ?)`,
        [sessionId, user.user_id, sessionData, expiry]
      );
  
      res.json({ session_id: sessionId, user: { user_id: user.user_id,name: user.name, role: user.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  









app.post('/add-user', async (req, res) => {
    const { name, email, password, role, adminType, sectionId, year, courseId } = req.body;



    try {
        // Insert into User table
        const [userResult] = await db.execute(
            'INSERT INTO User (name, role, password) VALUES (?, ?, ?)',
            [name, role.toLowerCase(), password]
        );

        const userId = userResult.insertId; // ✅ auto-generated user_id
        console.log('New User ID:', userId);

        // Insert into User_Email
        await db.execute(
            'INSERT INTO User_Email (user_id, email) VALUES (?, ?)',
            [userId, email]
        );

        // Role-based insertions
        if (role === 'student') {
            await db.execute(
                'INSERT INTO Student (user_id, student_id) VALUES (?, ?)',
                [userId, userId]  // assuming student_id is same as user_id
                
            );
            if (sectionId && year) {
                await db.execute(
                    'INSERT INTO Takes (student_id, section_id, year) VALUES (?, ?, ?)',
                    [userId, sectionId, year]
                );
            }
        } else if (role === 'faculty') {
            await db.execute(
                'INSERT INTO Faculty (user_id, faculty_id) VALUES (?, ?)',
                [userId, userId]
            );
            if (sectionId && courseId) {
                await db.execute(
                    'INSERT INTO Teaches (faculty_id, section_id, course_id) VALUES (?, ?, ?)',
                    [userId, sectionId, courseId]
                );
            }
        } else if (role === 'admin') {
            await db.execute(
                'INSERT INTO Admin (user_id, admin_id) VALUES (?, ?)',
                [userId, userId]
            );
            if (adminType) {
                await db.execute(
                    'INSERT INTO Admin_Info (admin_id, admin_type) VALUES (?, ?)',
                    [userId, adminType]
                );
            }
        }

        res.json({ success: true, message: 'User added successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add user.' });
    }
});





app.post("/add-course", async (req, res) => {
    const { course_id, name, credits, dept } = req.body;

    // Validate the data
    if (!course_id || !name || !credits || !dept) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Prepare the query
        const query = "INSERT INTO Course (course_id, name, credits, dept) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(query, [course_id, name, credits, dept]);
        
        // Check if the query was successful
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Course added successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Failed to add course" });
        }
    } catch (err) {
        console.error("Error adding course:", err);
        res.status(500).json({ success: false, message: "Error adding course" });
    }
});




app.post('/add-section', async (req, res) => {
    const { section_id, year, location, course_id } = req.body;

    try {
        const query = 'INSERT INTO Section (course_id, section_id, year, location) VALUES (?, ?, ?, ?)';
        await db.execute(query, [course_id, section_id, year, location]);
        res.json({ success: true, message: "Section inserted successfully" });
    } catch (err) {
        console.error("Error inserting section:", err);
        res.status(500).json({ success: false, message: "Error inserting section" });
    }
});


app.post('/upload-resource', upload.single('file'), async (req, res) => {
    const {  uploaded_by } = req.body;
    const file = req.file;

    if ( !uploaded_by || !file) {
        return res.status(400).json({ success: false, message: "All fields and file are required" });
    }

    const { originalname, mimetype, size, buffer } = file;

    try {
        const query = `
            INSERT INTO Resource ( uploaded_by, file_name, file_type, file_size, file_data) 
            VALUES ( ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            
            uploaded_by,
            originalname,
            mimetype,
            size,
            buffer
        ]);

        res.json({ success: true, message: "File uploaded successfully!" });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ success: false, message: "Failed to upload file" });
    }
});


app.post("/discussion", async (req, res) => {
    const { user_id, message } = req.body;
  
    if (!user_id || !message) {
      return res.status(400).json({ success: false, message: "user_id and message are required." });
    }
  
    try {
      const [result] = await db.query(
        `INSERT INTO Discussion (user_id, message) VALUES (?, ?)`,
        [user_id, message]
      );
  
      res.status(201).json({ success: true, discussion_id: result.insertId });
    } catch (err) {
      console.error("Error creating discussion:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
});
  
app.post("/reply", async (req, res) => {
    const { discussion_id, user_id, answer } = req.body;
  
    if (!discussion_id || !user_id || !answer) {
      return res.status(400).json({ success: false, message: "discussion_id, user_id, and answer are required." });
    }
  
    try {
      const [result] = await db.query(
        `INSERT INTO Reply (discussion_id, user_id, answer) VALUES (?, ?, ?)`,
        [discussion_id, user_id, answer]
      );
  
      res.status(201).json({ success: true, reply_id: result.insertId });
    } catch (err) {
      console.error("Error creating reply:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
});
  


// Inside server.js or routes file
app.post("/add-to-schedule", async (req, res) => {
    const { faculty_id, day, period } = req.body;

    try {
        // 1. Find the course + section faculty is teaching
        const [teaches] = await db.query(`
            SELECT t.teaches_id
            FROM Teaches t
            WHERE t.faculty_id = ?
    
        `, [faculty_id]);

        if (teaches.length === 0) {
            return res.status(404).json({ success: false, message: "No course found for faculty." });
        }

        const teaches_id = teaches[0].teaches_id;

        // 2. Convert period to actual time range (or store it directly as string if you prefer)
        const periodMap = {
            "Period 1": "09:30:00",
            "Period 2": "10:20:00",
            "Period 3": "11:10:00",
            "Period 4": "12:40:00",
            "Period 5": "13:30:00",
            "Period 6": "14:20:00",
            "Period 7": "15:10:00"
        };

        const time = periodMap[period];
        if (!time) {
            return res.status(400).json({ success: false, message: "Invalid period." });
        }

        // 3. Insert into schedule
        await db.query(`
            INSERT INTO Teaches_Schedule (teaches_id, day, time)
            VALUES (?, ?, ?)
        `, [teaches_id, day, time]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});






app.listen(5001, () => {
    console.log("🚀 Server is running on http://localhost:5001");
});

