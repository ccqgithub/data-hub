import invariant from './util/invariant';

export let Rx = {
  _needInstall: true
};

export function useRx(_Rx={}) {
  Rx = _Rx;
} 

export function checkRx() {
  invariant(
    !Rx._needInstall && Rx.Observable && Rx.Subject,
    `data-hub error ~ useRx({Observerble, Subject}) is required!`
  );

  invariant(
    Rx.Observable.from,
    `data-hub error ~ 'Rx.Observable.from' is required! Try import 'rxjs/add/observable/from'`
  );

  invariant(
    Rx.Observable.of,
    `data-hub error ~ 'Rx.Observable.of' is required! Try import 'rxjs/add/observable/of'`
  );
}