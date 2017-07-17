import {Hub} from 'data-hub'
import Rx from 'rxjs'
import axios from 'axios'
import mainStore from '../stores/main'
import userObservables from '../observables/server/user'

const hub = new Hub()

// store
hub.addDest('store.main', {
  next({mutation, payload}) {
    mainStore.commit(mutation, payload)
  }
})

hub.addSource('store.main', Rx.Observable.create(observer => {
  next(mainStore.getState())
}))

// server user
hub.addSources('server.user', userObservables)

export default hub
