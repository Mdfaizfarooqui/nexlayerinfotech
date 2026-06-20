const express = require('express');
const cors = require('cors');
const { dbRun, dbAll, dbGet } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root endpoint check
app.get('/', (req, res) => {
  res.json({ message: 'Nexlayer Infotech API is running.' });
});

// POST /api/admin/login - Authenticate admin
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  try {
    const admin = await dbGet('SELECT * FROM admins WHERE email = ?', [email]);
    if (admin && admin.password === password) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/admin/forgot-password - Generate OTP
app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const admin = await dbGet('SELECT * FROM admins WHERE email = ?', [email]);
    if (!admin) {
      // Even if not found, return 200 to prevent email enumeration
      return res.json({ message: 'If the email exists, an OTP has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    await dbRun('INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);
    
    // Simulate sending email by logging to console
    console.log(`\n========================================`);
    console.log(`[SIMULATED EMAIL] To: ${email}`);
    console.log(`Your Nexlayer Infotech Admin OTP is: ${otp}`);
    console.log(`It will expire in 10 minutes.`);
    console.log(`========================================\n`);

    res.json({ message: 'If the email exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/admin/reset-password - Verify OTP and update password
app.post('/api/admin/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Email, OTP, and new password required.' });

  try {
    // Find valid OTP
    const validOtp = await dbGet('SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > ? ORDER BY id DESC LIMIT 1', [email, otp, new Date().toISOString()]);
    
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Update password
    await dbRun('UPDATE admins SET password = ? WHERE email = ?', [newPassword, email]);
    
    // Delete used OTPs for this email
    await dbRun('DELETE FROM otps WHERE email = ?', [email]);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/contacts - Submit a new inquiry
app.post('/api/contacts', async (req, res) => {
  const { name, email, projectType, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  try {
    const query = `
      INSERT INTO contacts (name, email, projectType, message)
      VALUES (?, ?, ?, ?)
    `;
    const result = await dbRun(query, [name, email, projectType || '', message || '']);
    const newContact = await dbGet('SELECT * FROM contacts WHERE id = ?', [result.id]);
    res.status(201).json(newContact);
  } catch (err) {
    console.error('Error inserting contact:', err.message);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// GET /api/contacts - Retrieve all inquiries for Admin
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await dbAll('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// PATCH /api/contacts/:id/status - Update status of inquiry
app.patch('/api/contacts/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  try {
    const query = 'UPDATE contacts SET status = ? WHERE id = ?';
    const result = await dbRun(query, [status, id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    const updated = await dbGet('SELECT * FROM contacts WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating status:', err.message);
    res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
});

// DELETE /api/contacts/:id - Delete an inquiry
app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await dbRun('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ message: 'Inquiry deleted successfully.', id });
  } catch (err) {
    console.error('Error deleting inquiry:', err.message);
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// GET /api/stats - Fetch stats for admin dashboard
app.get('/api/stats', async (req, res) => {
  try {
    // Total count
    const totalResult = await dbGet('SELECT COUNT(*) as count FROM contacts');
    const total = totalResult.count;

    // Status counts
    const statusCounts = await dbAll('SELECT status, COUNT(*) as count FROM contacts GROUP BY status');
    const status = { pending: 0, in_progress: 0, completed: 0 };
    statusCounts.forEach(row => {
      status[row.status] = row.count;
    });

    // Project types breakdown
    const projectTypes = await dbAll('SELECT projectType, COUNT(*) as count FROM contacts GROUP BY projectType');

    // Recent submissions
    const recent = await dbAll('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5');

    res.json({
      total,
      status,
      projectTypes,
      recent
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch analytics statistics.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
