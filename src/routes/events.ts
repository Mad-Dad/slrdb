import express, { Request, Response, NextFunction } from 'express';
import pool from '../db.ts';

const router = express.Router();

router.get('/test-connection', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await pool.query('SELECT 1 + 1 AS test');
    res.json({ message: 'Database connection successful' });
  } catch (err) {
    console.error('Error testing connection:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// GET all events
router.get('/event', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM EVENTS ORDER BY event_date');
    console.log("data backend", result.rows);
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); 

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET a single event by ID
router.get('/event/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM EVENTS WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST (Create) a new event
router.post('/event', async (req: Request, res: Response, next: NextFunction) => {
  console.log("made it here", req)

  try {
    const { event_name, description, location, event_date, visible } = req.body;
    const result = await pool.query(
      'INSERT INTO EVENTS (event_name, description, location, event_date, visible) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_name, description, location, event_date, visible]
    );
    res.status(201).json(result.rows[0]); // 201 Created
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT (Update) an existing event
router.put('/event/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { event_name, description, location, event_date, visible } = req.body;

    const result = await pool.query(
      'UPDATE events SET event_name = $1, description = $2, location = $3, event_date = $4, visible = $5 WHERE id = $6 RETURNING *',
      [event_name, description, location, event_date, visible, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE an event
router.delete('/event/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const result = await pool.query('DELETE FROM EVENTS WHERE id = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(204).send(); // 204 No Content for successful delete
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });
export default router;