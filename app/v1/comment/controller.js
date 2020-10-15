const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require('./schema.js')

const updateComment = async (req, res) => {
  const { id } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [commentErr, comment] = await to(
    db('comment')
      .update({ ...body, updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(commentErr)) {
    logger.error(commentErr)
    return res.status(500).json({ error: `${commentErr}` })
  }

  if (R.isEmpty(comment)) {
    const error = `No comment for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(comment[0])
}

const checkComment = async (req, res) => {
  const { id } = req.params

  const [commentErr, comment] = await to(db('comment').select(['done']).where({ id }))
  if (!R.isNil(commentErr)) {
    logger.error(commentErr)
    return res.status(500).json({ error: `${commentErr}` })
  }

  if (R.isEmpty(comment)) {
    const error = `No comment for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  const [commentUpdateErr, commentUpdate] = await to(
    db(comment)
      .update({ done: !R.path([0, 'done'])(comment), updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(commentUpdateErr)) {
    logger.error(commentUpdateErr)
    return res.status(500).json({ error: `${commentUpdateErr}` })
  }

  return res.status(200).json(commentUpdate[0])
}

const deleteComment = async (req, res) => {
  const { id } = req.params

  const [commentErr, comment] = await to(
    db('comment').del().where({ id }).returning('*'),
  )
  if (!R.isNil(commentErr)) {
    logger.error(commentErr)
    return res.status(500).json({ error: `${commentErr}` })
  }

  if (R.isEmpty(comment)) {
    const error = `No comment for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(comment[0])
}

module.exports = { updateComment, checkComment, deleteComment }
