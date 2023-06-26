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
          fn.bind(this)(value);
        });
      }
    };

    const reject = (reason: any) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        this.onRejectFuncs.forEach((fn) => {
          fn.bind(this)(reason);
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
    return this;
  }
  static all(list: any[]) {
    const p = new MyPromise((resolve, reject) => {
      const results: any[] = [];
      for (let index = 0; index < list.length; index++) {
        const promise = list[index];
        if (promise instanceof MyPromise) {
          promise.then(
            (value: any) => {
              results.push(value);
              if (results.length === list.length) {
                resolve(results);
              }
            },
            () => {
              reject();
            }
          );
        } else {
          results.push(promise);
          if (results.length === list.length) {
            resolve(results);
          }
        }
      }
    });
    return p;
  }
  static race() {}
  static resolve(value: any[]) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new Promise((resolve) => {
        resolve(value);
      });
    }
  }
}
//
// const p = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     const random = Math.random();
//     if (random > 0) {
//       resolve('success:' + random);
//     } else {
//       reject('fail' + random);
//     }
//   }, 1000);
// });
// const pp = p.then(
//   (value) => {
//     console.log('resolve value: ', value);
//   },
//   (reason) => {
//     console.log('rejected reason:', reason);
//   }
// );

// pp.then((value) => {
//   console.log('pp then2:', value);
// });

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('111');
    resolve(1);
  }, 100);
});

const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('222');
    resolve(2);
  }, 200);
});

const p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('333');
    resolve(3);
  }, 300);
});

MyPromise.all([p1, p2, p3]).then((value) => {
  console.log('all value:', value);
});
