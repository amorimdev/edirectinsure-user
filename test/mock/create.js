'use strict'

module.exports = {
  pattern: {
    role: 'user',
    cmd: 'create'
  },

  payload: {
    invalid: {},

    alreadyExists: {
      name: 'Jhonatan Amorim',
      email: 'amorim.dev@gmail.com',
      password: '1234'
    },

    valid: {
      name: 'test',
      email: 'test@test.com',
      password: 'test'
    }
  }
}
