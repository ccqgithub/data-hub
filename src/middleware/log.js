import {Observable} from 'rxjs';

export default function logMiddleware({payload, pipeName, type}) {
  let data = payload;

  try {
    let data = JSON.parse(JSON.stringify(payload));
  } catch(e) {
    //
  }
  console.log(`rx-hub log ~ ${type} pipe <${pipeName}>:`, data);

  return Observable.of(payload);
}
