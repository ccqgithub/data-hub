import axios from 'axios'
import Rx from 'rxjs'

export function userUpdate({id, info}) {
  return Rx.Observable.from(
    axios({
      url: 'http://www.baidu.com',
      method: 'post',
      data: {
        id,
        info
      }
    }).then(response => {
      return response.data
    })
  )
}
