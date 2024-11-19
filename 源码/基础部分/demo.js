// export function add(a, b) {
//     return a + b;
// }
module testbench;
    // 定义测试平台的信号
    reg clk;                      // 时钟信号
    reg rst;                      // 复位信号
    reg [127:0] key;              // 128位密钥输入
    reg [127:0] iv;               // 128位初始化向量（IV）输入
    wire [127:0] keystream;       // 128位伪随机密钥流输出

    // 实例化 Grain128 模块 (UUT - Unit Under Test)
    grain128 uut (
        .clk(clk),               // 连接时钟信号
        .rst(rst),               // 连接复位信号
        .key(key),               // 连接密钥信号
        .iv(iv),                 // 连接初始化向量信号
        .keystream(keystream)    // 连接伪随机密钥流输出
    );

    // 时钟信号生成：每5个时间单位反转一次时钟信号
    initial begin
        clk = 0;  // 初始化时钟为0
        forever #5 clk = ~clk;  // 每5个时间单位反转一次时钟（产生周期性时钟信号）
    end

    // 复位和密钥/IV初始化，以及测试不同的密钥流
    initial begin
        rst = 1;  // 初始化复位信号为1（触发复位）
        key = 128'hc1d7c88587451b50013e3df855de9fc5;  // 设置测试用密钥1
        iv = 128'h7fc3fea5a35863627d3f79b63e43cc43;   // 设置测试用IV1

        #10 rst = 0;   // 等待10个时间单位后解除复位
        #50;           // 继续等待50个时间单位，让 Grain128 模块生成密钥流

        // 打印测试用例1生成的密钥流
        $display("Keystream (Test Case 1): %h", keystream);

        // 准备进行下一个测试用例
        #10;           // 等待10个时间单位
        rst = 1;       // 重新复位
        key = 128'h9a8c7e6b5f4d3c2b1a0e9d112b6f5a4b;  // 设置测试用密钥2
        iv = 128'h11fe234c5b6a79808f9aad2c3d4e5f18;   // 设置测试用IV2
        
        #10 rst = 0;   // 解除复位
        #50;           // 等待50个时间单位让 Grain128 生成密钥流
        
        // 打印测试用例2生成的密钥流
        $display("Keystream (Test Case 2): %h", keystream);

        // 准备进行最后一个测试用例
        #10;           // 等待10个时间单位
        rst = 1;       // 重新复位
        key = 128'ha4123ade5f4d3c2b1a0e9d112b6f5a21;  // 设置测试用密钥3
        iv = 128'he3a8c7eaa1f4d3c2b95449d112b6f5a4e;  // 设置测试用IV3
        
        #10 rst = 0;   // 解除复位
        #50;           // 等待50个时间单位让 Grain128 生成密钥流
        
        // 打印测试用例3生成的密钥流
        $display("Keystream (Test Case 3): %h", keystream);

        $finish;   // 测试完成，结束仿真
    end
endmodule

