'use strict'

module.exports.setId = id => {
  if (!this.id) {
    this.id = id
  }
}

module.exports.getId = () => this.id
