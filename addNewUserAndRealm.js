const Realm   = require('realm')
const path    = require('path')
const glob    = require('glob')

const USERNAME = "test-user-realm-owner"
const PASSWORD = "testuser-shitme"
const SERVER = "realmserver"

const allSchemas = []
const normalizedPath = path.join(__dirname, "/models/**/*.js")
glob.sync(normalizedPath).forEach(function(file) {
  allSchemas.push(require(path.resolve( file )))
});

async function registerNewClient() {
  let registeredUser
  try {
    registeredUser = await Realm.Sync.User.register(`https://${SERVER}`, USERNAME, PASSWORD)
  } catch (error) {
    console.log("register error => ", error)
  }

  Realm.open({
    sync: {
      url: `realms://${SERVER}/~/test-user-realm`,
      user: registeredUser
    },
    schema: allSchemas
  })
  .then((realmInstance) =>{
    realmInstance.close()
  })
}

// THIS IS RAN ONLY ONCE TO SIMULATE REGISTRATION OF A CLIENT/USER
registerNewClient()

