'use strict'

module.exports = {
  pattern: {
    role: 'user',
    cmd: 'update'
  },

  payload: {
    notFound: {
      _id: '5d41fea7f012517b1edf34e6'
    },

    alreadyExists: _id => ({
      _id,
      name: 'Jhonatan Amorim',
      email: 'amorim.dev@gmail.com'
    }),

    one: _id => ({
      _id,
      name: 'change',
      email: 'change@test.com',
      password: 'change'
    })
  }
}
