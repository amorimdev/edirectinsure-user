'use strict'

const role = 'user'
const { user } = require('mongo-client/models')
const { pick, omit } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Select () {
  const seneca = this

  seneca.add({ role, cmd: 'select' }, cmdSelect)

  async function cmdSelect (args, done) {
    const params = pick(args, PICK_FIELDS)

    return selectUser(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function selectUser (params) {
    return new Promise((resolve, reject) => {
      const method = (params._id || params.email) &&
        'findOne' || 'find'
      user[method](params, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (Array.isArray(entity)) {
          const entities = entity.map(item => {
            item = {
              ...item.toObject(),
              _id: item._id.toString()
            }
            return omit(item, [ 'password' ])
          })

          seneca.log.info(LOG_TAG, { entities })
          return resolve(entities)
        }

        if (!entity) {
          return reject(new Error('User not found'))
        }

        entity = {
          ...entity.toObject(),
          _id: entity._id.toString()
        }

        seneca.log.info(LOG_TAG, { entity })
        return resolve(params.email && entity ||
          omit(entity, [ 'password' ]))
      })
    })
  }

  return {
    name: role
  }
}
