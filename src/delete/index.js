'use strict'

const role = 'user'
const { user } = require('edirectinsure-mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Delete () {
  const seneca = this

  seneca.add({ role, cmd: 'delete' }, cmdDelete)

  async function cmdDelete (args, done) {
    const params = pick(args, PICK_FIELDS)

    return deleteUser(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function deleteUser (params) {
    return new Promise((resolve, reject) => {
      user.deleteOne(params, (err, result) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!result.deletedCount) {
          return reject(new Error('User not found'))
        }

        seneca.log.info(LOG_TAG, { result })
        return resolve(result.deletedCount)
      })
    })
  }

  return {
    name: role
  }
}
