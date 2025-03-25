// 模拟的合法用户数据
const validUsers = [
    { username: "张三", hospitalId: "123456" },
    { username: "李四", hospitalId: "654321" },
];

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

function chat() {
    window.location.href = "chat.html";
}

function records() {
    window.location.href = "records.html";
}