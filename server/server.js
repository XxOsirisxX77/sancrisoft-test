import Fastify from 'fastify'
import sqlite3 from 'sqlite3'
import cors from 'fastify-cors'

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: '*'
})

fastify.get('/vehicles', async function handler (request, reply) {
  const db = new sqlite3.Database('vehicles.db')

  const { page = 1, limit = 10 } = request.query
  const offset = (page - 1) * limit

  db.all(
    'SELECT * FROM vehicles LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) {
        reply.code(500).send({ error: 'Failed to fetch' })
        return
      }
      db.get('SELECT COUNT(*) as total FROM vehicles', (err, count) => {
        if (err) {
          reply.code(500).send({ error: 'Failed to fetch' })
        } else {
          reply.send({ vehicles: rows, total: count.total })
        }
      })
    }
  )
  db.close()
  return reply
})

fastify.put('/vehicles/:vehicleId', async function handler (request, reply) {
  const { vehicleId } = request.params
  const { year, make, model } = request.body

  if (!year || isNaN(year) || year > new Date().getFullYear() + 2 || year < 1900) {
    reply.code(422).send({ error: 'Invalid value for field \'Year\'' })
    return reply
  } else if (!make || make.length > 100) {
    reply.code(422).send({ error: 'Invalid value for field \'Make\'' })
    return reply
  } else if (!model || model.length > 100) {
    reply.code(422).send({ error: 'Invalid value for field \'Model\'' })
    return reply
  }

  const db = new sqlite3.Database('vehicles.db')

  db.run(
    'UPDATE vehicles SET year = ?, make = ?, model = ? WHERE id = ?',
    [year, make, model, vehicleId],
    function (err) {
      if (err) {
        reply.code(500).send({ error: 'Internal server error.' })
        return
      }

      if (this.changes === 0) {
        reply.code(404).send({ error: 'No vehicle found.' })
      } else {
        reply.send({ message: 'Vehicle was updated.' })
      }
    }
  )
  db.close()
  return reply
})

/*
** Challenged actually asked for this to be /vehicles/:vehicleId
** I decided to use /vehicles because the id will be generated later
*/
fastify.post('/vehicles', async function handler (request, reply) {
  const { year, make, model, location } = request.body

  if (!year || isNaN(year) || year > new Date().getFullYear() + 2 || year < 1900) {
    reply.code(422).send({ error: 'Invalid value for field \'Year\'' })
    return reply
  } else if (!make || make.length > 100) {
    reply.code(422).send({ error: 'Invalid value for field \'Make\'' })
    return reply
  } else if (!model || model.length > 100) {
    reply.code(422).send({ error: 'Invalid value for field \'Model\'' })
    return reply
  } else if (!location || location.length > 100) {
    reply.code(422).send({ error: 'Invalid value for field \'Location\'' })
    return reply
  }

  const db = new sqlite3.Database('vehicles.db')

  db.run(
    'INSERT INTO vehicles (year, make, model, location) VALUES (?, ?, ?, ?)',
    [year, make, model, location],
    function (err) {
      if (err) {
        reply.code(500).send({ error: 'Internal server error.' })
        return
      }

      if (this.changes === 0) {
        reply.code(404).send({ error: 'No vehicle found.' })
      } else {
        reply.send({ message: 'Vehicle was created.' })
      }
    }
  )
  db.close()
  return reply
})

fastify.delete('/vehicles/:vehicleId', async function handler (request, reply) {
  const { vehicleId } = request.params

  const db = new sqlite3.Database('vehicles.db')

  db.run(
    'DELETE FROM vehicles WHERE id = ?',
    [vehicleId],
    function (err) {
      if (err) {
        reply.code(500).send({ error: 'Internal server error.' })
        return
      }
      reply.send({ message: 'Vehicle was deleted.' })
    }
  )
  db.close()
  return reply
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
