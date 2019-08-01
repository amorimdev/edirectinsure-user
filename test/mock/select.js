'use strict'

module.exports = {
  pattern: {
    role: 'user',
    cmd: 'select'
  },

  payload: {
    all: {},

    notFound: {
      _id: '5d41fea7f012517b1edf34e6'
    },

    one: _id => ({ _id })
  }
}
