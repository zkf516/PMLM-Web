// 登录
async function login() {
    const username = document.getElementById("username").value.trim();
    const hospitalId = document.getElementById("hospitalId").value.trim();

    try {
        const response = await fetch("http://localhost:3000/getExcelData");
        const data = await response.json();  // 二维数组

        // 查找匹配的行 第2列姓名，第3列住院号
        const matchedIndex = data.findIndex(row => row[2] === username && row[3] === hospitalId);

        if (matchedIndex !== -1) {
            alert("登录成功！");
            localStorage.setItem("loggedInIndex", matchedIndex); // 保存索引到本地
            window.location.href = "public/dashboard.html"; // 跳转到主页面
        } else {
            alert("姓名或住院号错误，请重试！");
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


document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 2025.4.19省去了数据获取的代码，数据已经在本地存储中
        const response = await fetch("http://localhost:3000/getExcelData");
        const data = await response.json();

        const index = localStorage.getItem("loggedInIndex");
        const matchedRow = index !== null ? data[parseInt(index)] : null;

        if (matchedRow) {
            updatePatientInfo(matchedRow);
        } else {
            console.error("本地索引无效或数据获取失败");
            alert("无法获取用户信息，请重新登录！");
            window.location.href = "../index.html"; // 重定向回登录页
        }

    } catch (error) {
        console.error("获取数据失败:", error);
        alert("加载用户信息失败，请检查网络连接！");
    }
});


function updatePatientInfo(firstRow) {
    document.querySelector(".patient-info h2").textContent = firstRow[2];
    document.querySelector(".patient-info p:nth-child(2)").textContent = `身份证号：${firstRow[4]}`;
    document.querySelector(".patient-info p:nth-child(3)").textContent = `住院号：${firstRow[3]}`;
    document.querySelector(".patient-info p:nth-child(4)").textContent = `CARDNO：${firstRow[6]}`;
    document.querySelector(".patient-info p:nth-child(5)").textContent = `性别：${firstRow[0]}`;
    document.querySelector(".patient-info p:nth-child(6)").textContent = `年龄：${firstRow[12]}`;
    document.querySelector(".patient-info p:nth-child(7)").textContent = `身高：${firstRow[13]}`;
    document.querySelector(".patient-info p:nth-child(8)").textContent = `是否住院：${firstRow[5]}`;

    document.querySelectorAll(".vital-signs .data-group").forEach(group => {
        const label = group.querySelector(".infomation")?.textContent.trim();
        const value = group.querySelector(".data");
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

    document.querySelector(".data p:nth-child(1)").textContent = `${firstRow[23]}`;

}
