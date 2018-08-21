module.exports = {
  name: 'Thread',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    someString: { type: 'string', optional: true },
    someNum: 'int?'
  }
}