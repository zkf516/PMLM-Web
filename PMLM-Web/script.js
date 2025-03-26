//判断指标是否正常，并修改相应的样式
function formatValue(value, min, max) {
    if (value < min) {
      return `<span class='abnormal'>${value}↓</span>`;
    } else if (value > max) {
      return `<span class='abnormal'>${value}↑</span>`;
    }
    return value;
  }
  
  //加载检查报告数据
  async function loadData() {
    try {
      const response = await fetch('/api/data'); // 需后端提供 /api/data 端点
      const data = await response.json();
      const tbody = document.querySelector(".data-table tbody");
      tbody.innerHTML = "";
      data.forEach(item => {
        const row = `<tr>
                        <td>${item.日期}</td>
                        <td>${formatValue(item["白细胞计数"], 4.0, 10.0)}</td>
                        <td>${formatValue(item["红细胞计数"], 3.5, 5.5)}</td>
                        <td>${formatValue(item["血红蛋白"], 120, 160)}</td>
                        <td>${formatValue(item["血小板总数"], 150, 400)}</td>
                      </tr>`;
        tbody.innerHTML += row;
      });
    } catch (error) {
      console.error("数据加载失败:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadData);
  