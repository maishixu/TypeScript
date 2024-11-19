
// function sum(a: number, b: number): number {
//     return a + b
// }
// const result = sum(10, 20)
// console.log(result);
// let person: { name: string, age?: number, [key: string]: any }
// let sum: (a: number, b: number) => number
// sum = function (x, y) {
//     return x + y
// }
//数字枚举
// enum Direction{
//     Up,
//     Down,
//     Left,
//     Right
// }
// function walk(data:Direction){
//     if(data === Direction.Up){
//         console.log("向【上】走");
//     }else if(data === Direction.Down){
//         console.log("向【下】走")
//     }else if(data === Direction.Left){
//         console.log("向【左】走")
//     }else if(data === Direction.Right){
//         console.log("向【右】走")
//     }
// }
//类
// class Person {
//     name: string
//     age: number
//     constructor(name: string, age: number) { //构造函数
//         this.name = name
//         this.age = age
//     }
//     speak() {
//         console.log(`我叫${this.name},今年${this.age}岁`)
//     }
// }
// //继承
// class Student extends Person {
//     //新增自己的属性
//     grade: string
//     constructor(name: string, age: number, grade: string) { //新增属性要重写构造函数
//         super(name, age) //父类的构造函数
//         this.grade = grade
//     }
//     override speak() { //覆盖原来方法
//         console.log(`我叫${this.name},今年${this.age}岁,正在读${this.grade}`)
//     }
// }
// const s1 = new Student("张三",18,"高三")
// s1.speak()
//抽象类
// abstract class Package{
//     //构造方法
//     constructor(public weight:number){ }
//     //抽象方法
//     abstract calculate():number //一个方法结构，返回值是数字，要求真实类要有具体实现
//     //具体方法
//     printPackage(){
//         console.log(`包裹的重量是${this.weight}kg,运费为${this.calculate()}元`) 
//         //所有真实类都可调用，不用具体实现了
//     }
// }
// class StandardPackage extends Package{
//     constructor(weight:number,public unitPrice:number){
//         super(weight)
//     }
//     //具体实现
//     calculate(): number {
//         return this.weight*this.unitPrice
//     }
// }
// const p1 =new  StandardPackage(10,12)
// p1.printPackage()
//接口
// interface UserInterface{
//     name:string
//     readonly gender:string
//     age?:number //可有可无
//     run:(n:number) => void //函数结构
// }
// //用接口定义类结构
// class user implements UserInterface{
//     constructor(public name:string,public gender:string){ }
//     run(n:number){
//         console.log(`${this.name}跑了${n}米`)
//     }
// }
// const u1 = new user("Boby","男")
// u1.run(8)
// 对象
// const u2 :UserInterface ={
//     name:"李华",
//     gender:"男",
//     run(n){
//         console.log(`${this.name}跑了${n}米`)
//     }
// }
// u2.run(9)
//接口继承
// interface PersonInterface{
//     name:string
//     age:number
// }
// interface PersonInterface{
//     gender:string
// }
// interface StudentInterface extends PersonInterface{
//     grade:string
// }
//泛型
// function LogData<T>(data:T) :T{
//     return data
// }
// LogData<number>(10)
// LogData<string>("hello")

// import { add } from "./demo"
// console.log(1);

// console.log(add(1,2))

























module grain128 (
    input wire clk,           // 时钟信号
    input wire rst,           // 复位信号
    input wire [127:0] key,   // 128位密钥
    input wire [127:0] iv,    // 128位初始向量
    output wire [127:0] keystream // 输出128位密钥流
);

    reg [127:0] lfsr;        // 线性反馈移位寄存器 (LFSR)
    reg [127:0] nlfsr;       // 非线性反馈移位寄存器 (NLFSR)
    
    // LFSR反馈计算
    // LFSR使用4个高位的异或反馈：lfsr[127] ^ lfsr[126] ^ lfsr[125] ^ lfsr[124]
    wire feedback_lfsr = lfsr[127] ^ lfsr[126] ^ lfsr[125] ^ lfsr[124];
    
    // NLFSR反馈计算
    // NLFSR使用位63和位62的与运算反馈
    wire feedback_nlfsr = nlfsr[127] ^ (nlfsr[63] & nlfsr[62]);

    // 初始化LFSR和NLFSR的值
    initial begin
        lfsr = key;            // LFSR初始化为密钥
        nlfsr = iv;            // NLFSR初始化为初始向量
    end
    
    // 时钟边缘触发的过程，处理LFSR和NLFSR的更新
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            // 如果复位信号有效，则重置LFSR和NLFSR
            lfsr <= key;        // LFSR重置为密钥
            nlfsr <= iv;        // NLFSR重置为初始向量
        end else begin
            // 如果没有复位信号，更新LFSR和NLFSR
            lfsr <= {lfsr[126:0], feedback_lfsr};  // 左移并加入反馈位
            nlfsr <= {nlfsr[126:0], feedback_nlfsr}; // 左移并加入反馈位
        end
    end

    // keystream输出是LFSR和NLFSR的异或结果
    assign keystream = lfsr ^ nlfsr;

endmodule

