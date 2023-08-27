const express = require("express");
const db = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const fs = require("fs");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

db.connect(); //connect to database

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'logs/main.log' })
  ]
});

// API endpoint to get logs
app.get('/logs', (req, res) => {
  // Read the latest log file created within the last 5 minutes
  const now = new Date();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

  // Construct the filename based on timestamp
  const filename = `logs/main-${fiveMinutesAgo.getTime()}.log`;

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading log file.');
    }

    // Set appropriate response headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the log data
    res.send(data);
    console.log(data);
  });
});



//createUser
app.post("/createuser", (req, res) => {
  if (req.body.role === "user" || req.body.role === "") {
    const createData = `INSERT INTO user(name, role, email, password)
                    VALUES ("${req.body.name}", "user", "${req.body.email}", "${req.body.password}")`;
    db.query(
      createData,
      [req.body.name, "user", req.body.email, req.body.password],
      (result, error) => {
        if (error) {
          console.error("Error Saving data:", error);
          logger.error(`Error Saving data: ${error}`);
          return res.status(500).send("Error Saving data.");
        } else {
          console.log("Data saved successfully:", result);
          logger.info(`User created: ${req.body.name}, Role: user`);
          return res.status(200).send("Data saved successfully.");
        }
      }
    );
  } else {
    const createData = `INSERT INTO user(name, role, candelete, email, password)
    VALUES ("${req.body.name}", "${req.body.role}", "${req.body.candelete}", "${req.body.email}", "${req.body.password}")`;

    db.query(
      createData,
      [
        req.body.name,
        req.body.role,
        req.body.candelete,
        req.body.email,
        req.body.password,
      ],
      (result, error) => {
        if (error) {
          console.error("Error Saving data:", error);
          logger.error(`Error Saving data: ${error}`);
          return res.status(500).send("Error Saving data.");
        } else {
          console.log("Data saved successfully:", result);
          logger.info(`User created: ${req.body.name}, Role: ${req.body.role}, Can Delete: ${req.body.candelete}`);
          return res.status(200).send("Data saved successfully.");
        }
      }
    );
  }
});



// Read Users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM user";

  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users.");
    } else {
      // console.log("Users fetched successfully:", result);
      res.status(200).json(result);
    }
  });
});

// Update User
app.put("/updateuser", (req, res) => {
  const userId = req.params.id;
  const { name, role, candelete, email, password } = req.body;

  if (req.body.role === "user" || req.body.role === "") {
    const updateData = `UPDATE user
                      SET name = ?, role = ?, email = ?, password = ?
                      WHERE id = ?`;

    const userData = [name, "user", email, password, userId];

    db.query(updateData, userData, (result, error) => {
      if (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user.");
      } else {
        console.log("User updated successfully:", result);
        res.status(200).send("User updated successfully.");
      }
    });
  } else {
    const updateData = `UPDATE user
    SET name = ?, role = ?, candelete = ?, email = ?, password = ?
    WHERE id = ?`;

    const userData = [name, role, candelete, email, password, userId];

    db.query(updateData, userData, (result, error) => {
      if (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user.");
      } else {
        console.log("User updated successfully:", result);
        res.status(200).send("User updated successfully.");
      }
    });
  }
});

//getting single user data
app.post("/getUserData", (req, res) => {
  const userId = req.body.id;
  console.log("this is params", req.body.id);
  const query = `SELECT * FROM user WHERE id = ${userId}`;

  db.query(query, [userId], (result, error) => {
    if (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("Error fetching user.");
    } else {
      if (result.length === 0) {
        console.log("User not found");
        res.status(404).send("User not found.");
      } else {
        console.log("User fetched successfully:", result[0]);
        res.status(200).json(result[0]);
      }
    }
  });
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM user WHERE email = ? AND password = ?";

  db.query(query, [email, password], (results, error) => {
    if (error) {
      console.error("Error during login:", error);
      res.status(500).send("Error during login.");
    } else {
      if (results.length === 0) {
        res.status(401).send("Invalid email or password.");
      } else {
        const user = results[0];

        const token = jwt.sign(
          {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          "fbv7694bndb8n4bfu3mbf734n"
        );

        res.status(200).send(token);
      }
    }
  });
});

// Delete User
app.post("/deleteuser", (req, res) => {
  const userId = req.body.id;
  console.log("userid",userId);
  const deleteData = "DELETE FROM user WHERE id = ?";

  db.query(deleteData, [userId], (result, error) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user.");
    } else {
      console.log("User deleted successfully:", result);
      res.status(200).send("User deleted successfully.");
    }
  });
});

//createFeed
app.post("/createfeed", (req, res) => {
  const createData1 = `insert into feed(name,description,url)
                    values ("${req.body.name}", "${req.body.description}", "${
    req.body.url}")`;

  db.query(
    createData1,
    [
      req.body.name,
      req.body.description,
      req.body.url,
    ],
    (result, error) => {
      if (error) {
        console.error("Error Saving data:", error);
        res.status(500).send("Error Saving data.");
      } else {
        console.log("Data saved successfully:", result);
        res.status(200).send("Data saved successfully.");
      }
    }
  );
});

// Read Feeds
app.get("/feeds", (req, res) => {
  console.log("feeds called");
  const query = "SELECT * FROM feed";

  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching feed:", error);
      res.status(500).send("Error fetching feeds.");
    } else {
      // console.log("Users fetched successfully:", result);
      res.status(200).json(result);
    }
  });
});

// Update Feed
app.put("/updatefeed", (req, res) => {
  const { id, name, url, description } = req.body;
  const updateData = `UPDATE feed
                    SET name = ?, url = ?, description = ? 
                    WHERE id = ?`;

  const userData = [name, url, description, id];

  db.query(updateData, userData, (result, error) => {
    if (error) {
      console.error("Error updating feed:", error);
      res.status(500).send("Error updating feed.");
    } else {
      console.log("Feed updated successfully:", result);
      res.status(200).send("Feed updated successfully.");
    }
  });
});

//getting single feed data
app.post("/getFeedData", (req, res) => {
  const userId = req.body.id;
  console.log("this is params", req.body.id);
  const query = `SELECT * FROM feed WHERE id = ${userId}`;

  db.query(query, [userId], (result, error) => {
    if (error) {
      console.error("Error fetching feed:", error);
      res.status(500).send("Error fetching fee.");
    } else {
      if (result.length === 0) {
        console.log("User not found");
        res.status(404).send("Feed not found.");
      } else {
        console.log("Feed fetched successfully:", result[0]);
        res.status(200).json(result[0]);
      }
    }
  });
});

//Delete feed
app.post("/deletefeed", (req, res) => {
  const userId = req.body.id;
  console.log("userid",userId);
  const deleteData = "DELETE FROM feed WHERE id = ?";

  db.query(deleteData, [userId], (result, error) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user.");
    } else {
      console.log("User deleted successfully:", result);
      res.status(200).send("User deleted successfully.");
    }
  });
});

app.post("/addaccess", (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const feedId = req.body.feedId;
  const query = `SELECT * FROM feed WHERE id = ${feedId}`;
  
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching feed:", error);
      res.status(500).send("Error fetching feeds.");
    } else {
      // console.log("Feed fetched successfully:", result);
      const existingAccessData = JSON.parse(result[0].accessto);
      const accessData = existingAccessData.accessto || []; // Initialize as an array

       accessData.push(userId);
     // console.log("-------", JSON.parse(accessData));
      
      // Prepare the updated JSON data for the query
      const updatedAccessData = JSON.stringify({ accessto: accessData });

      // Update query
      const updateQuery = `UPDATE feed SET accessto = ? WHERE id = ?`;

      db.query(updateQuery, [updatedAccessData, feedId], (updateResult, updateError) => {
        if (updateError) {
          console.error('Error updating JSON column:', updateError);
          res.status(500).send("Error updating JSON column.");
        } else {
          console.log('JSON column updated successfully:', updateResult);
          res.status(200).send("JSON column updated successfully.");
        }
      });
    }
  });
});


app.post("/removeaccess", (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const feedId = req.body.feedId;
  const query = `SELECT * FROM feed WHERE id = ${feedId}`;
  
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching feed:", error);
      res.status(500).send("Error fetching feeds.");
    } else {
      console.log("Feed fetched successfully:", result);
      const existingAccessData = JSON.parse(result[0].accessto);
      const accessData = existingAccessData.accessto || []; // Initialize as an array

      const newArray = accessData.filter(item => item !== String(userId));
      console.log(newArray);
      
      // Prepare the updated JSON data for the query
      const updatedAccessData = JSON.stringify({ accessto: newArray });

      // Update query
      const updateQuery = `UPDATE feed SET accessto = ? WHERE id = ?`;

      db.query(updateQuery, [updatedAccessData, feedId], (updateResult, updateError) => {
        if (updateError) {
          console.error('Error updating JSON column:', updateError);
          res.status(500).send("Error updating JSON column.");
        } else {
          console.log('JSON column updated successfully:', updateResult);
          res.status(200).send("JSON column updated successfully.");
        }
      });
    }
  });
});





//join operation
// app.get("/feeds", (req, res) => {
//   const query = `
//   SELECT feed.*, user.id AS user_id, user.name AS user_name, user.email AS user_email
//   FROM feed
//   INNER JOIN user ON feed.createdBy = user.id;
//   `;

//   db.query(query, (error, result) => {
//     if (error) {
//       console.error("Error fetching feed:", error);
//       res.status(500).send("Error fetching feed.");
//     } else {
//       if (result.length === 0) {
//         console.log("Feed not found");
//         res.status(404).send("Feed not found.");
//       } else {
//         console.log("Feed fetched successfully:", result);
//         res.status(200).json(result);
//       }
//     }
//   });
// });

//starting server
app.listen(8001, () => {
  console.log("server listen to port 8001");
});
