const Realm   = require('realm')

const USERNAME = "admin-user"  // user with administrator privileges
const PASSWORD = "some pass"
const SERVER = "realmserver"
const NOTIFIER_PATH = '/test-user-realm'

let handleChange = async (changeEvent) => {
  return new Promise((resolve, reject) => {
    const matches = changeEvent.path.match("^/([^/]+)/([^/]+)$")
    const realmUserId = matches[1]

    let updatedRealm = changeEvent.realm
    let oldRealm = changeEvent.oldRealm
    let addedAccount

    for (const model in changeEvent.changes) {
      const changesObj = changeEvent.changes[model]
      const changedCollection = updatedRealm.objects(model)

      if (model === 'Account' && changesObj.insertions.length) {
        let insertionIndex = changesObj.insertions[0]
        let account = changedCollection[insertionIndex]
        addedAccount = account
      }
    }

    if (addedAccount) {
      // do some api call to get the threads
      // then create threads for newly inserted account when the call finishes
      // someString and someNum fields are optional as you can see from the Thread.js model
      console.log("ADDING NEW THREAD TO THE ACCOUNT")
      try {
        updatedRealm.write(() => {
          addedAccount.threads.push({
            id: 'l4l46l5',
            someString: 'first thread',
            someNum: 25
          })
        })
      } catch (error) {
        console.log("ERROR => ", error)
      }

      console.log("INSERT SUCCEDED!")
      resolve()
    } else {
      resolve()
    }
  })
}

async function listenToClientsRealms() {
  let adminUser
  try {
    adminUser = await Realm.Sync.User.login(`https://${SERVER}`, USERNAME, PASSWORD)
  } catch (error) {
    return new Promise((resolve, reject) => { return reject(error, null) })
  }

  global.adminUser = adminUser

  try {
    Realm.Sync.addListener(`realms://${SERVER}`, adminUser, NOTIFIER_PATH, 'change', handleChange)
  } catch (error) {
    return new Promise((resolve, reject) => { return reject(error, null) })
  }
}

listenToClientsRealms()