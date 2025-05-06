// 登录

async function login() {
    const username = document.getElementById("username").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();

    if (!username || !phoneNumber) {
        alert("请输入姓名和手机号！");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/getExcelData");
        const data = await response.json();  // 二维数组
        console.log("读取的缓存:", data);

        // 查找匹配的行 第2列姓名，第3列住院号
        //const matchedIndex = data.findIndex(row => row[2] === username && row[3] === hospitalId);

        // if (matchedIndex !== -1) {
        //     alert("登录成功！");

        //     // getdata
        //     const matchedRow = data[matchedIndex];
        //     //console.log("保存的用户数据:", matchedRow); // 调试日志
        //     localStorage.setItem("loggedInIndex", JSON.stringify(matchedRow)); // 保存索引到本地
        //     window.location.href = "public/dashboard.html"; // 跳转到主页面
        // } else {
        //     alert("姓名或住院号错误，请重试！");
        // }
        if (data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomRow = data[randomIndex];

            alert("欢迎进入！");

            // 保存输入的姓名和手机号
            localStorage.setItem("inputInfo", JSON.stringify({ username, phoneNumber }));           
            localStorage.setItem("loggedInIndex", randomIndex);  // 仅保存当前 index
            localStorage.setItem("loggedInUser", JSON.stringify(randomRow));

            window.location.href = "public/dashboard.html"; // 跳转页面
        } else {
            alert("数据为空，无法登录！");
        }
    } catch (error) {
        console.error("登录失败：", error);
        alert("登录时发生错误，请检查网络或稍后重试！");
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

async function nextpage() {
    const currentIndex = parseInt(localStorage.getItem("loggedInIndex"));
    try {
        const nextIndex = currentIndex + 1;
        const response = await fetch(`http://localhost:3000/getRowByIndex?index=${nextIndex}`);
        if (!response.ok) throw new Error("无数据或服务器错误");

        const nextRow = await response.json();

        // 保存并跳转
        localStorage.setItem("loggedInIndex", nextIndex);
        localStorage.setItem("loggedInUser", JSON.stringify(nextRow));

        window.location.href = "dashboard.html";
    } catch (error) {
        alert("已经是最后一位病人或发生错误！");
        console.error("获取下一位病人失败：", error);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    // const response = await fetch("http://localhost:3000/getExcelData");
    // const data = await response.json();

    //const index = localStorage.getItem("dataArray");
    //const matchedRow = index !== null ? data[parseInt(index)] : null;

    const cachedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    // 调试日志
    console.log("当前用户数据:", cachedUser);
    console.log(Array.isArray(cachedUser));

    if (!cachedUser) {
        alert("无法获取用户信息，请重新登录！");
        window.location.href = "./index.html";
        return;
    }

    updatePatientInfo(cachedUser);
    try {
        const currentPage = window.location.pathname.split("/").pop();
        switch (currentPage) {
            case "dashboard.html":
                updatedashboard(cachedUser);
                break;
            default:
                console.log("无页面匹配逻辑，不执行任何初始化函数");
                break;
        }
    } catch (error) {
        console.error("更新用户信息失败：", error);
        alert("用户数据异常，请重新登录！");
        window.location.href = "../index.html";
    }
});


// 更新患者基本信息
function updatePatientInfo(firstRow) {
    if (!Array.isArray(firstRow) || firstRow.length < 24) {
        throw new Error("用户数据格式无效！");
    }

    const setText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    // 更新患者基本信息（仅在有这些元素的页面生效）
    setText(".patient-info h2", firstRow[2]);
    setText(".patient-info p:nth-child(2)", `身份证号：${firstRow[4]}`);
    setText(".patient-info p:nth-child(3)", `住院号：${firstRow[3]}`);
    setText(".patient-info p:nth-child(4)", `CARDNO：${firstRow[6]}`);
    setText(".patient-info p:nth-child(5)", `性别：${firstRow[0]}`);
    setText(".patient-info p:nth-child(6)", `年龄：${firstRow[12]}`);
    setText(".patient-info p:nth-child(7)", `身高：${firstRow[13]}`);
    setText(".patient-info p:nth-child(8)", `是否住院：${firstRow[5]}`);
}


// dashboard 信息更新
function updatedashboard(firstRow) {
    document.querySelectorAll(".vital-signs .data-group").forEach(group => {
        const label = group.querySelector(".infomation")?.textContent.trim();
        const value = group.querySelector(".data");
        if (!value) return;
        switch (label) {
            case "血压":
                value.textContent = firstRow[17];
                break;
            case "孕周":
                value.textContent = firstRow[16];
                break;
            case "孕次":
                value.textContent = firstRow[18];
                break;
            case "产次":
                value.textContent = firstRow[19];
                break;

            case "入院诊断":
                value.textContent = firstRow[7];
                break;
            case "出院诊断":
                value.textContent = firstRow[8];
                break;
            case "孕前体重":
                value.textContent = firstRow[14];
                break;
            case "入院体重":
                value.textContent = firstRow[15];
                break;

            case "婴儿性别":
                value.textContent = firstRow[11];
                break;
            case "胎儿体重":
                value.textContent = firstRow[9];
                break;
            case "胎儿身长":
                value.textContent = firstRow[10];
                break;
            case "分娩方式":
                value.textContent = firstRow[21];
                break;
            default:
                break;
        }
    });
    updatedata(firstRow[23]);
}

// 处理患者信息数据
function updatedata(datastring) {
    const rawText = datastring;

    // 在句号和数字序号后面加换行符 \n
    const formattedText = rawText
        .replace(/(?<!^)(\d+[、])/g, '\n$1');   // 在 1. 2. 3. 等前面加换行

    document.querySelector(".data p:nth-child(1)").textContent = formattedText;
}


// 退出登录时清除缓存，未使用
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("dataArray");
    window.location.href = "../login.html";
}