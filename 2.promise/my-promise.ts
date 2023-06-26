type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;

type onResolve = (value?: any) => any;
type onRejected = (reason?: any) => any;

function resolvePromise(x: any, promise2: any, resolve: any, reject: any) {
  if (x === promise2) {
    throw new TypeError('Chaining cycle detected for promise');
  }
  if (x instanceof MyPromise) {
    x.then(
      (y) => {
        resolvePromise(y, promise2, resolve, reject);
      },
      (r) => {
        reject(r);
      }
    );
  } else {
    resolve(x);
  }
}
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

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onResolve?: onResolve, onRejected?: onRejected) {
    // 并不是在调用then时触发，是在调用then时收集，在executor执行完之后,在resolve/reject执行的时候触发

    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onResolve?.(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected?.(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === 'pending') {
        setTimeout(() => {
          try {
            if (onResolve) {
              this.onResolveFunc = () => {
                setTimeout(() => {
                  try {
                    let x = onResolve?.(this.value);
                    resolvePromise(x, promise2, resolve, reject);
                  } catch (error) {
                    reject(error);
                  }
                });
              };
            }
            if (onRejected) {
              this.onRejectFunc = () => {
                setTimeout(() => {
                  try {
                    let x = onRejected?.(this.reason);
                    resolvePromise(x, promise2, resolve, reject);
                  } catch (error) {
                    reject(error);
                  }
                });
              };
            }
          } catch (error) {
            reject(error);
          }
        });
      }
    });

    return promise2;
  }
  static deferred() {
    let defer = {} as any;
    defer.promise = new MyPromise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  }

  static resolve(value: any) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise((resolve, reject) => {
        resolve(value);
      });
    }
  }
  static all(promises: any[]) {}
}
//

const p = new MyPromise((resolve, reject) => {
  console.log('executor');
  setTimeout(() => {
    resolve(1);
  }, 1000);
});
const pp = p.then(
  (value) => {
    console.log('resolve value: ', value);
    return 2;
  },
  (reason) => {
    console.log('rejected reason:', reason);
  }
);
const ppp = pp.then((value) => {
  console.log('ppp', value);
});
