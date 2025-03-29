// 模拟的合法用户数据
const validUsers = [
    { username: "张三", hospitalId: "123456" },
    { username: "李四", hospitalId: "654321" },
];


// 登录
function login() {
    const username = document.getElementById("username").value.trim();
    const hospitalId = document.getElementById("hospitalId").value.trim();

    // 查找匹配的用户
    const user = validUsers.find(u => u.username === username && u.hospitalId === hospitalId);

    if (user) {
        alert("登录成功！");
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // 保存到本地存储
        window.location.href = "dashboard.html"; // 跳转到用户主页
    } else {
        alert("用户名或住院号错误，请重试！");
    }
}

// 基本信息
function dashboard() {
    window.location.href = "dashboard.html";
}

// 医疗咨询
function chat() {
    window.location.href = "chat.html";
}

// 血压记录
function records() {
    window.location.href = "records.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/getExcelData");
        const data = await response.json();

        // 打印获取到的完整数据，检查结构
        console.log('获取到的数据:', data);

        // 假设每一行数据包含 24 列，且你想取第 0 行（data[0]）的前几个字段
        if (data && data.length > 0) {
            const firstRow = data[0];  // 获取 Excel 中的第一行数据（第一个数组）

            // 根据列的索引访问对应的数据
            document.querySelector(".patient-info h2").textContent = firstRow[0];  // 假设“姓名”在第 0 列
            document.querySelector(".patient-info p:nth-child(2)").textContent = `身份证号：${firstRow[1]}`;  // 假设“身份证号”在第 1 列
            document.querySelector(".patient-info p:nth-child(3)").textContent = `住院号：${firstRow[2]}`;  // 假设“住院号”在第 2 列
            document.querySelector(".patient-info p:nth-child(4)").textContent = `CARDNO：${firstRow[3]}`;  // 假设“CARDNO”在第 3 列
            document.querySelector(".patient-info p:nth-child(5)").textContent = `性别：${firstRow[4]}`;  // 假设“性别”在第 4 列
            document.querySelector(".patient-info p:nth-child(6)").textContent = `年龄：${firstRow[5]}`;  // 假设“年龄”在第 5 列
            document.querySelector(".patient-info p:nth-child(7)").textContent = `身高：${firstRow[6]}cm`;  // 假设“身高”在第 6 列
            document.querySelector(".patient-info p:nth-child(8)").textContent = `是否住院：${firstRow[7]}`;  // 假设“是否住院”在第 7 列
        } else {
            console.error("数据为空或格式不正确");
        }
    } catch (error) {
        console.error("获取数据失败:", error);
    }
});
