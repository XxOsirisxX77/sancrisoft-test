import sqlite3 from 'sqlite3'

function createDatabase () {
  const db = new sqlite3.Database('vehicles.db')

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL
      )
    `)

    fetch('https://api.api-ninjas.com/v1/cars?limit=50&year=2020', {
      headers: { 'X-Api-Key': 'cHHHBVdIjCrDep9ciWgiNg==UDZY9HNxkh3SLXz4' }
    })
      .then(response => response.json())
      .then(cars => {
        const insertStmt = db.prepare('INSERT INTO vehicles (year, make, model) VALUES (?, ?, ?)')
        for (const car of cars) {
          insertStmt.run(car.year, car.make, car.model)
        }
        insertStmt.finalize()
      })
      .catch(error => {
        console.error('Error fetching data from the API:', error.message)
      }).finally(() => db.close(err => {
        if (err) {
          console.error('Error closing the database:', err.message)
        } else {
          console.log('Migration completed successfully.')
        }
      }))
  })
}

createDatabase()
