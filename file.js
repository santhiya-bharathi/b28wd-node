const fs = require("fs");  // inbuild package (file system)


//"utf-8" without this we will get only hexadecimal value instead of hello world (utf-unicode transformation format)

// we can read the file
fs.readFile("./welcome.txt", "utf-8", (err,data)=> {
    console.log(data);
});

// writeFile for create the file
// const quotes ="be happy always";
// fs.writeFile("./awesome.txt", quotes,err => {
//     console.log("completed writing!!!");
// });

// create 10 files in backup
const quotes2 = "live more be happy";
for (let i=1; i<=10; i++){
    fs.writeFile(`./backup/text-${i}.txt`, quotes2, (err) =>{
        console.log("completed writing",i);
    });
}

// create 10 files in backup using function example
// function createQuote(nooffiles,quote){
//     for (let i=1; i<=nooffiles; i++){
//         fs.writeFile(`./backup/text-${i}.txt`, quotes2, (err) =>{
//             console.log("completed writing",i);
//         });
//     } 
// }
// const [,,nooffiles]= process.argv;
// createQuote(nooffiles,quotes2);
// we can create no of files = 20 like that

//for deleting file
// fs.unlink("./awesome.txt",(err)=>{
//     console.log("deleted successfully");
// });


// for adding file
// const quotenice = "\nnice world";
// fs.appendFile("./awesome.txt",quotenice,err=>{
//     console.log("completed add writing");
// });

//read directory
fs.readdir("./backup",(err,files)=>{
    if(err){
        console.log(err);
    }
    console.log(files);
}); 
// [
//     'text-1.txt', 'text-10.txt',
//     'text-2.txt', 'text-3.txt',
//     'text-4.txt', 'text-5.txt',
//     'text-6.txt', 'text-7.txt',
//     'text-8.txt', 'text-9.txt'
//   ]
