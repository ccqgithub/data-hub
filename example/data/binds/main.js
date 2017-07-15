import hub from './hubs/main'
import mainStore from '../stores/main'
import * as userActions from './actions/user'

hub.addStore({
  main: mainStore
})

hub.addActions(userActions)

export default hub
