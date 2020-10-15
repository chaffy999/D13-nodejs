const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require('./schema.js')

const getAll = async (req, res) => {
  const { title } = req.query

  const [articleErr, article] = await to(
    db('vw_article')
      .select()
      .where((builder) =>
        !R.isNil(title)
          ? builder.where('title', 'like', `%${title}%`)
          : builder,
      ),
  )
  if (!R.isNil(articleErr)) {
    logger.error(articleErr)
    return res.status(500).json({ error: `${articleErr}` })
  }

  return res.status(200).json(article)
}

const getById = async (req, res) => {
  const { id } = req.params

  const [articleErr, article] = await to(db('vw_article').select().where({ id }))
  if (!R.isNil(articleErr)) {
    logger.error(`${articleErr}`)
    return res.status(500).json({ error: `${articleErr}` })
  }

  if (R.isEmpty(article)) {
    const error = `No article for id ${id}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [commentsErr, comments] = await to(db('comment').select().where({ article_id: id }))
  if (!R.isNil(commentsErr)) {
    logger.error(`${commentsErr}`)
    return res.status(500).json({ error: `${commentsErr}` })
  }

  return res.status(200).json({ ...article[0], comments })
}

const createArticle = async (req, res) => {
  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [articleErr, article] = await to(db('article').insert(body).returning('*'))
  if (!R.isNil(articleErr)) {
    logger.error(`${articleErr}`)
    return res.status(500).json({ error: `${articleErr}` })
  }

  if (R.isEmpty(article)) {
    const error = 'No row written'
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(article[0])
}

const updateArticle = async (req, res) => {
  const { id } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [articleErr, article] = await to(
    db('article')
      .update({ ...body, updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(articleErr)) {
    logger.error(`${articleErr}`)
    return res.status(500).json({ error: `${articleErr}` })
  }

  if (R.isEmpty(article)) {
    const error = `No article for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(article[0])
}

const deleteArticle = async (req, res) => {
  const { id } = req.params

  const [articleErr, article] = await to(
    db('article').del().where({ id }).returning('*'),
  )
  if (!R.isNil(articleErr)) {
    logger.error(`${articleErr}`)
    return res.status(500).json({ error: `${articleErr}` })
  }

  if (R.isEmpty(article)) {
    const error = `No article for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(article[0])
}

module.exports = { getAll, getById, createArticle, updateArticle, deleteArticle }
