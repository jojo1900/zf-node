type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;

type onResolve = (value?: any) => any;
type onRejected = (reason?: any) => any;
export class MyPromise {
  status: 'pending' | 'fulfilled' | 'rejected';
  value: any;
  reason: any;
  onResolveFunc?: (value: any) => any;
  onRejectFunc?: (value: any) => any;
  constructor(executor: (resolve: Resolve, reject: Reject) => void) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolveFunc = undefined;
    this.onRejectFunc = undefined;

    const resolve = (value: any) => {
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
        const that = this;
        if (this.onResolveFunc) {
          this.onResolveFunc.bind(that)(value);
        }
      }
    };

    const reject = (reason: any) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        const that = this;
        if (this.onRejectFunc) {
          this.onRejectFunc.bind(that)(reason);
        }
      }
    };

    const promise2 = new MyPromise((resolve, reject) => {});
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onResolve?: onResolve, onRejected?: onRejected) {
    // 并不是在调用then时触发，是在调用then时收集，在executor执行完之后,在resolve/reject执行的时候触发
    if (this.status === 'fulfilled') {
      let x = onResolve?.(this.value);
    }
    if (this.status === 'rejected') {
      let x = onRejected?.(this.reason);
    }
    if (this.status === 'pending') {
      if (onResolve) {
        this.onResolveFunc = onResolve;
      }
      if (onRejected) {
        this.onRejectFunc = onRejected;
      }
    }
    return new MyPromise((resolve, reject) => {
      // resolve(x);
    });
  }
}
//
const p = new MyPromise((resolve, reject) => {
  console.log('executor');
  resolve(1);
});
const pp = p.then(
  (value) => {
    console.log('resolve value: ', value);
  },
  (reason) => {
    console.log('rejected reason:', reason);
  }
);
