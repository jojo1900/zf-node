type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;

type onResolve = (value?: any) => any;
type onRejected = (reason?: any) => any;
export class MyPromise {
  status: 'pending' | 'fulfilled' | 'rejected';
  value: any;
  reason: any;
  onResolveFuncs: ((value: any) => any)[];
  onRejectFuncs: ((value: any) => any)[];
  constructor(executor: (resolve: Resolve, reject: Reject) => void) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolveFuncs = [];
    this.onRejectFuncs = [];

    const resolve = (value: any) => {
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
        this.onResolveFuncs.forEach((fn) => {
          fn(value);
        });
      }
    };

    const reject = (reason: any) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        this.onRejectFuncs.forEach((fn) => {
          fn(reason);
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onResolve: onResolve, onRejected?: onRejected) {
    // 并不是在调用then时触发，是在调用then时收集，在executor执行完之后,在resolve/reject执行的时候触发
    this.onResolveFuncs.push(onResolve);
    onRejected && this.onRejectFuncs.push(onRejected);
  }
}
//
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve('success:' + random);
    } else {
      reject('fail' + random);
    }
  }, 1000);
});
p.then(
  (value) => {
    console.log('resolve value: ', value);
  },
  (reason) => {
    console.log('rejected reason:', reason);
  }
);
