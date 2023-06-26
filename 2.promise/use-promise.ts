// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 100);
// });
// const pp = p.then((value) => {
//   console.log('s1:', value);
//   throw new Error('error');
// });

// const ppp = pp.then(
//   (value) => {
//     console.log('s2 succ:', value);
//     return 'succ';
//   },
//   (reason) => {
//     console.log('s2 fail:', reason);
//     return 'fail';
//   }
// );

// ppp.then(
//   (value) => {
//     console.log('s3 succ:', value);
//   },
//   () => {
//     console.log('s3 fail');
//   }
// );

const f = () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 1000);
};
Promise.resolve(f).then((v) => {
  v();
  console.log('setTimeout then:', v);
});
let p;
const func = async () => {
  p = await new Promise((resolve, reject) => {
    resolve(1);
  }).finally(() => {
    console.log('finally');
    return 'finally return';
  });

  console.log('p:', p);
};

func();
