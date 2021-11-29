console.log(process.argv);

const [,,nums]=process.argv;  // destructuring in terminal (array value)
console.log(nums);
const arr = JSON.parse(nums);  // parse used for convert the value from string to number array
console.log(arr);
console.log(Math.max(...arr));  // max used for find the maximum value

console.log(typeof(process.argv)); // object