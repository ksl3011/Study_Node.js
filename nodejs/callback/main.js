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
