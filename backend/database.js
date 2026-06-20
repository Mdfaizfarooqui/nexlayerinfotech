const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'void_studio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        projectType TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (tableErr) => {
      if (tableErr) {
        console.error('Error creating table:', tableErr.message);
      } else {
        console.log('Contacts table ready.');
        
        // Create Admins table
        db.run(`
          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
          )
        `, (err) => {
          if (err) console.error('Error creating admins table:', err.message);
          else {
            console.log('Admins table ready.');
            // Seed default admin if none exists
            db.get('SELECT count(*) as count FROM admins', [], (err, row) => {
              if (!err && row.count === 0) {
                db.run('INSERT INTO admins (email, password) VALUES (?, ?)', ['nexlayerinfotech@gmail.com', 'voidadmin']);
                console.log('Default admin account created (nexlayerinfotech@gmail.com)');
              } else {
                db.run("UPDATE admins SET email = 'nexlayerinfotech@gmail.com' WHERE email = 'admin@nexlayer.com'", function (updateErr) {
                  if (!updateErr && this.changes > 0) {
                    console.log('Admin email updated from admin@nexlayer.com to nexlayerinfotech@gmail.com');
                  }
                });
              }
            });
          }
        });

        // Create OTPs table
        db.run(`
          CREATE TABLE IF NOT EXISTS otps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            expires_at DATETIME NOT NULL
          )
        `, (err) => {
          if (err) console.error('Error creating otps table:', err.message);
          else console.log('OTPs table ready.');
        });
      }
    });
  }
});

// Helper functions using Promises for async/await usage
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = {
  db,
  dbRun,
  dbAll,
  dbGet
};
