const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "..", "employees.json");

// READ employees
async function readEmployees() {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err.message);
        return []; // prevent crash
    }
}

// WRITE employees
async function writeEmployees(data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing file:", err.message);
    }
}

module.exports = {
    readEmployees,
    writeEmployees
};
