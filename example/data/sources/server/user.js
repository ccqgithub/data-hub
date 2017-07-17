import axios from 'axios'
import Rx from 'rxjs'

export function userInfo({id}) {
  return Rx.Observable.from(
    axios({
      url: 'http://www.baidu.com',
      method: 'get',
      data: {
        id,
      }
    }).then(response => {
      return response.data
    })
  )
}

export function userList({page, count}) {
  return Rx.Observable.from(
    axios({
      url: 'http://www.baidu.com',
      method: 'get',
      data: {page, count}
    }).then(response => {
      return response.data
    })
  )
}
