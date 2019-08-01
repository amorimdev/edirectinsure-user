'use strict'

function Seneca (done) {
  return new Promise((resolve, reject) => {
    const seneca = require('../srv/start')
    seneca.test(done)
    seneca.ready(err => {
      if (err) return reject(err)
      return resolve(seneca)
    })
  })
}

const LOG_TAG = 'LOG::[AUTH | TEST]'

module.exports = {
  Seneca,
  LOG_TAG
}
