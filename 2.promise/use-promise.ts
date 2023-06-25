const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 100);
});
const pp = p.then((value) => {
  console.log('s1:', value);
  throw new Error('error');
});

const ppp = pp.then(
  (value) => {
    console.log('s2 succ:', value);
    return 'succ';
  },
  (reason) => {
    console.log('s2 fail:', reason);
    return 'fail';
  }
);

ppp.then(
  (value) => {
    console.log('s3 succ:', value);
  },
  () => {
    console.log('s3 fail');
  }
);
