module.exports = {
  name: 'Account',
  primaryKey: 'email',
  properties: {
    email: { type: 'string' },
    threads: { type: 'list', objectType: 'Thread' }
  }
}