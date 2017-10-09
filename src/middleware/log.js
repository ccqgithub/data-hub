import {Observable} from 'rxjs/Observable';

export default function logMiddleware({payload, pipeName, type}) {
  let data = payload;
  let typeMsg = {
    before: 'in',
    after: 'out'
  }[type];

  try {
    let data = JSON.parse(JSON.stringify(payload));
  } catch(e) {
    //
  }

  console.log(`rx-hub log ~ pipe ${typeMsg} <${pipeName}>:`, data);

  return Observable.of(payload);
}
