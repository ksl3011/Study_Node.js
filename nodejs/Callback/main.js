function a(){
    console.log("A");
}

var b = function(){
    console.log("B");
}

function c(callback){
  callback();
}

console.log("===================");
a();
b();
c(a);
c(b);
console.log("===================");

//콜백함수: 작업이 끝나면 실행