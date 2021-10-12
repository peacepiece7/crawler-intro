// ECMA 2015

// const 는 = 를 한 번만 사용할 수 있다. 메모리 주소에 대한 상수, 참조에 의한 상수

// 템플릿 문자열 `${}, ${}`

// 객체 리터럴 변화
const object = { a: 1 };

// old varsion, 동적으로 객체에 함수를 할당
var sayNode = function () {
  console.log("Node");
};
var es = "ES";
var oldObject = {
  sayJs: function () {
    console.log("js");
  },
  sayNode: sayNode,
};

oldObject[es + 6] = "Fantastic";
oldObject.sayJs(); // js

const newObject = {
  sayJs() {
    console.log("new js");
  },
  sayNode,
  [es + 6]: "new Fantasitc",
};
newObject.sayJs(); // new js
newObject.sayNode(); // Node
console.log(newObject.ES6); // new Fantastic

// function expression
const add = function (x, y) {
  return x + y;
};

// function delcaration
function add1(x, y) {
  return x + y;
}

// arrow function (+2015)
const add2 = (x, y) => {
  return x + y;
};

// function declaration의 this
var relationship = {
  name: "zero",
  friends: ["nero", "hero", "xero"],
  logFriends: function () {
    this.friends.forEach((friend) => {
      console.log(this.name, friend);
    });
  },
};
relationship.logFriends(); // zroo nero, zero hero, zero xero

// arrow function의 this

var relationship2 = {
  name: "zero",
  friends: ["nero", "hero", "xero"],
  logFriends() {
    this.friends.forEach((friend) => {
      console.log(this.name, friend);
    });
  },
};
//* this.friends, this.name은 reloationship2의 this를 가르킴
// arrow function은 자신을 감싸고 있는 함수의 this를 가르킴
relationship2.logFriends();

// * destructuring (비구조화할당)

const candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getCandy() {
    this.status.count--;
    return this.status.count;
  },
};
// tree shaking이 가능해짐
const { status, getCandy } = candyMachine;

// console.log(getCandy()); 이렇게 작성하면 this가 어디를 말하는지 찾지 못함
// 아래와 같이 써야함
console.log(candyMachine.getCandy());

// 비구조화 할당은 call의 인자로 this가 가르키는 객체를 할당해야 함
console.log(getCandy.call(candyMachine));

// * 배열의 비구조화 할당

var array = ["nodejs", {}, 10, true];
var node = array[0];
var obj = node[1];
var bool = array[array.length - 1];

// 배열을 이렇게 비구조화 핟당 할 수 있음
const [newNode, newObj, , newBool] = array;
console.log(node, obj, bool);
console.log(newNode, newObj, newBool);

"GET" + "/movies/inception";
"GET" + "/movies/inception/actors/reonaldo-dekafrio";
"POST" + "/movies/big-father";
"DELETE" + "/movies/showshangk-escape";
"PUT" + "/movies/showshangk-escape";
"url" + "?page=5";
