const pp = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

pp.then((res) => {
  console.log(res);
});
