// function Demo(target:Function){
//     console.log(target)
// }
// @Demo
// class Person {
//     constructor(public name:string,public age:number){ }
// }

// function CustomString(target:Function){
//     target.prototype.toString = function(){ //在原型中添加方法
//         return JSON.stringify(this) //作用对象是当前实例，返回JSON格式的数据
//     }
// }
// @CustomString
// class Person{
//     constructor(public name:string,public age:number){ }
//     speak(){
//         console.log(`我叫${this.name}`)
//     }
// }

// const p1 = new Person("张三",18)
// //在 JavaScript 中，几乎所有的对象都有一个 toString() 方法。它通常用于返回对象的字符串表示。
// console.log(p1.toString()) 

// type Constructor = new (...args:any[]) =>{ }
// //现在的需求是，传入的fn得是一个类
// function test( fn:Constructor){ }
// class p1{ }
// const p2 = () => { }
// test(p1)
// test(p2) //报错


// type Constructor = new (...args: any[]) => {} //构造类型
// //接口(自动合并的特性)
// interface Person {
//     printDate():void //让Person知道自己多了一个函数
// }
// function SetTime<T extends Constructor>(target: T) { //装饰的必须是可以new的类
//     return class extends target{ //继承原类，名字不变
//         createTime: Date
//         constructor(...args: any[]) { //目的是提高兼容性
//             super(...args)
//             this.createTime = new Date()
//         }
//         printDate(){
//             console.log(`该对象的创建时间是:${this.createTime}`)
//         }
//     }
// }
// @SetTime
// class Person {
//     constructor(public name: string, public age: number) { }
// }
// const p1 = new Person("李华",18)
// p1.printDate() //输出：该对象的创建时间是:${this.createTime}
// function Demo(target:Function){
//     console.log(target)
// }
// @Demo //这句话相等于 Demo(Person)
// class Person {
//     constructor(public name:string,public age:number){ }
// }
// const p1 = new Person("里斯",10)
// interface User{
//     introduce():void
// }
// function LogName(n:number){
//     return function(target:Function) {
//         target.prototype.introduce = function(){
//             for(let i = 0 ;i<n;i++){
//                 console.log(`我叫${this.name}`)
//             }
//         }
//     }
// }
// @LogName(3)
// class User{
//     constructor(public name:string){ }
// }
// const p1 = new User("李华")
// p1.introduce()
// let value = 100
// Object.defineProperty(Person.prototype,"age",{
//     get(){
//         return value
//     }
//     set(val){
//         value = val
//     }
// })
//属性装饰器
// function State(target: object, propertykey: string) {
//     //私有属性，通过p1.age访问的值实际是p1.__age(这是个私有属性，只允许当前用户修改)
//     let key = `__${propertykey}`
//     Object.defineProperty(target, propertykey, {
//         get() {
//             return this[key]
//         },
//         set(newValue) {
//             console.log(`${propertykey}的最新值是${newValue}`)
//             this[key] = newValue
//         }
//     })
// }
// class Person {
//     @State age: number
//     constructor(name: number) {
//         this.age = name
//     }
// }

// const p1 = new Person(18)
// const p2 = new Person(20)
// p1.age = 20 //输出：age的最新值是20
// p2.age = 30 //输出：age的最新值是30
// console.log(p1.age) //输出：20
// console.log(p2.age) //输出：30

function Logger(target: object, propertykey: string, descriptor: PropertyDescriptor) {
    //存储原始方法
    const origin = descriptor.value
    //替换原始方法
    descriptor.value = function (...args: any[]) {
        console.log("函数开始执行...")
        const result = origin.call(this, ...args) //绑定this指向实例对象，预防this可能发生上下文丢失
        console.log("函数执行结束...")
        return result
    }
}

class info {
    constructor(public name: string) { }
    @Logger speak() { console.log(`我是${this.name}函数`) }
}
const info1 = new info("模幂运算")
info1.speak()
/*输出：
    函数开始执行...
    我是模幂运算函数
    函数执行结束...
*/