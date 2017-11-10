import {BehaviorSubject, Observable} from 'rxjs';
import mainStore from '../stores/main';

// 获取最新state
export let getState = () => {
  let state = mainStore.state;
  let subject = new BehaviorSubject(state);
  mainStore.subscribe(subject);
  return subject;
};

// 提交更改
export let commit = ({mutation, payload}) => {
  mainStore.commit(mutation, payload);
  return Observable.of(payload);
};
