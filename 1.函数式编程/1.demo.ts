// 函数作为返回值
function main() {
  const add = (a: number, b: number) => {
    return a + b;
  };
  return add;
}

const sum = main()(1, 2);

console.log(sum);

// 函数作为参数

const say = (str: string) => {
  console.log(str);
};

function sayHello(fn: (str: string) => void, word: string) {
  fn(word);
}

sayHello(say, 'hello world');
