const express = require('express')
const cors = require('./middleware/cors')
const errorHandler = require('./middleware/errorHandler')
const rateLimiter = require('./middleware/rateLimiter')

const blogRoutes = require('./routes/blog.routes')
const donationRoutes = require('./routes/donation.routes')
const volunteerRoutes = require('./routes/volunteer.routes')
const partnerRoutes = require('./routes/partner.routes')
const programsRoutes = require('./routes/programs.routes')
const teamRoutes = require('./routes/team.routes')

const app = express()

app.use(cors)
app.use(express.json())
app.use(rateLimiter)

app.use('/api/blog', blogRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/programs', programsRoutes)
app.use('/api/team', teamRoutes)

app.use(errorHandler)

module.exports = app
