const express = require('express');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

// 允许跨域访问（如果前端和后端不在同一域）
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

let data = [];

// 读取 Excel 文件并返回数据
app.get('/getExcelData', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'disease.xlsx');  // Excel 文件路径
        const workbook = XLSX.readFile(filePath);

        // 打印所有工作表的名称
        console.log('工作表名称:', workbook.SheetNames);

        if (workbook.SheetNames.length < 2) {
            return res.status(400).json({ error: 'Excel 文件中没有足够的工作表' });
        }

        const sheetName = workbook.SheetNames[1];  // 获取第一个工作表
        const sheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(sheet, { header: 1 });  // 转换为 JSON 格式

        res.json(data);  // 返回 Excel 中的所有数据
    } catch (error) {
        res.status(500).json({ error: '读取 Excel 文件失败' });
    }
});

app.get("/getRowByIndex", (req, res) => {
    const index = parseInt(req.query.index);
    if (!Number.isInteger(index) || index < 0 || index >= data.length) {
        return res.status(400).json({ error: "无效的索引" });
    }
    res.json(data[index]);
});

app.listen(PORT, () => {
    console.log(`服务器正在运行： http://localhost:${PORT}`);
    console.log(`请访问 http://localhost:${PORT}/getExcelData 获取 Excel 数据`);
    console.log(`请访问 http://localhost:${PORT}/getRowByIndex?index=0 获取指定行数据`);
});
