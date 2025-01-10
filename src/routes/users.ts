import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import generateJWT from '../jwtUtils.ts'; // Import the generateJWT function
import pool from '../db.ts';

const router = express.Router();


// Register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  console.log("made it here", req.body)
  try {
    const { firstname, lastname, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    console.log("inserting")
    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, username, hashedPassword]
    );
    console.log("inserted")

    res.status(201).json(result.rows[0]); 
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login a user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' }); 
    }

    const user = result.rows[0];
    console.log("match")
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("oops")
      res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateJWT(user); 

    res.json({ user, token }); 
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;