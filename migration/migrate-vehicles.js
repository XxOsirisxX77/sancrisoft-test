import sqlite3 from 'sqlite3'
import { faker } from '@faker-js/faker'

const API_NINJA_API_KEY = 'cHHHBVdIjCrDep9ciWgiNg==UDZY9HNxkh3SLXz4'

const API_NINJA_CAR_API = 'https://api.api-ninjas.com/v1/cars'
const API_NINJA_LOCATION_API = 'https://api.api-ninjas.com/v1/zipcode'

function createDatabase () {
  const db = new sqlite3.Database('vehicles.db')

  db.serialize(async () => {
    console.log('Creating Vehicles table...')
    db.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        location TEXT NOT NULL
      )
    `)
    console.log('Vehicles table created successfully!')
    console.log('Migrating vehicles')
    const yearsToFetch = Array.from({ length: 21 }, (_, i) => i + 2000)
    for (let i = 0; i < yearsToFetch.length; i++) {
      const year = yearsToFetch[i]
      await fetch(`${API_NINJA_CAR_API}?limit=10&year=${year}`, {
        headers: { 'X-Api-Key': API_NINJA_API_KEY }
      })
        .then(response => response.json())
        .then(async cars => {
          for (let i = 0; i < cars.length; i++) {
            const car = cars[i]
            const state = faker.location.state({ abbreviated: true })
            await fetch(`${API_NINJA_LOCATION_API}?state=${state}`, {
              headers: { 'X-Api-Key': API_NINJA_API_KEY }
            })
              .then(response => response.json())
              .then(location => {
                const insertStmt = db.prepare('INSERT INTO vehicles (year, make, model, location) VALUES (?, ?, ?, ?)')
                const carLocation = location[0]
                insertStmt.run(car.year + 2, car.make, car.model, [carLocation.country ?? '', carLocation.state ?? '', carLocation.city ?? ''].join(' '))
              })
          }
          console.log(`Vehicles from year ${year} has been migrated successfully.`)
        })
        .catch(error => {
          console.error('Error fetching data from the API:', error.message)
        })
    }
  })
}

createDatabase()
