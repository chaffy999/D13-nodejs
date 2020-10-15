const { to } = require('await-to-js')
const R = require('ramda')

const jwt = require('jsonwebtoken')
const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { v1: uuidv1 } = require('uuid');

const login = async (req, res) => {
    const { email } = req.body
    const { password } = req.body

    const [userErr, user] = await to(db('users').select().where({ email: email, password: password }))
    if (!R.isNil(userErr) || Object.entries(user).length === 0) {
        logger.error(`${userErr}`)
        return res.status(500).json({ error: `${userErr}` })
    }

     jwt.sign({user: user}, 'secretkey', (err, token) => {
        res.status(200).json({ token })
     })
}

const register = async (req, res) => {
    const { email } = req.body
    const { password } = req.body
    const { role } = req.body

    const [userErr, user] = await to(db('users')
    .insert({
        id: uuidv1(),
        email: email,
        password: password,
        role: role,
      })
    .returning('*'))
    if (!R.isNil(userErr)) {
        logger.error(`${userErr}`)
        return res.status(500).json({ error: `${userErr}` })
    }

    if (R.isEmpty(user)) {
        const error = 'No row written'
        logger.error(error)
        return res.status(500).json({ error })
    }

    return res.status(200).json(user[0])
}

module.exports = { login, register }