const os = require("os");  // inbuild packages
console.log("os version:", os.version()); // os version: Windows 10 Home Single Language
console.log("free memory:", os.freemem()); // free memory: 1259642880
console.log("Total memory:", os.totalmem()); // Total memory: 4128677888
console.log("cpu:", os.cpus());

// cpu: [
//     {
//         model: 'Intel(R) Pentium(R) CPU 6405U @ 2.40GHz',
//         speed: 2400,
//         times: {
//           user: 1525125,
//           nice: 0,
//           sys: 675296,
//           idle: 12060640,
//           irq: 140921
//         }
//       },
//       {
//         model: 'Intel(R) Pentium(R) CPU 6405U @ 2.40GHz',
//         speed: 2400,
//         times: { user: 1432828, nice: 0, sys: 403531, idle: 12424484, irq: 7953 }
//       },
//       {
//         model: 'Intel(R) Pentium(R) CPU 6405U @ 2.40GHz',
//         speed: 2400,
//         times: { user: 1656171, nice: 0, sys: 432328, idle: 12172343, irq: 7812 }
//       },
//       {
//         model: 'Intel(R) Pentium(R) CPU 6405U @ 2.40GHz',
//         speed: 2400,
//         times: { user: 1878328, nice: 0, sys: 397296, idle: 11985218, irq: 6671 }
//       }
//     ]