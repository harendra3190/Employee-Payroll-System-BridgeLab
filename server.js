const express = require("express");
const app = express();
const fileHandler = require("./modules/fileHandler");

// EJS setup (we’ll use later)
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// TEST: Read employees when server starts
async function startServer() {
    const employees = await fileHandler.readEmployees();
    console.log("Employees loaded from JSON:");
    console.log(employees);

    // HOME / DASHBOARD
app.get("/", async (req, res) => {
    const employees = await fileHandler.readEmployees();
    res.render("index", { employees });
});


// Show Add form
app.get("/add", (req, res) => {
    res.render("add");
});

// ADD employee (CREATE)
app.post("/add", async (req, res) => {
    const employees = await fileHandler.readEmployees();

    const newEmployee = {
        id: Date.now(), // unique id
        name: req.body.name,
        department: req.body.department,
        salary: Number(req.body.salary) // IMPORTANT
    };

    employees.push(newEmployee);
    await fileHandler.writeEmployees(employees);

    res.redirect("/");
});


// DELETE employee
app.get("/delete/:id", async (req, res) => {
    let employees = await fileHandler.readEmployees();

    const id = Number(req.params.id);
    employees = employees.filter(emp => emp.id !== id);

    await fileHandler.writeEmployees(employees);
    res.redirect("/");
});


// SHOW edit form
app.get("/edit/:id", async (req, res) => {
    const employees = await fileHandler.readEmployees();
    const id = Number(req.params.id);

    const employee = employees.find(emp => emp.id === id);
    res.render("edit", { employee });
});

// UPDATE employee
app.post("/edit/:id", async (req, res) => {
    const employees = await fileHandler.readEmployees();
    const id = Number(req.params.id);

    const updatedEmployees = employees.map(emp => {
        if (emp.id === id) {
            return {
                id: id,
                name: req.body.name,
                department: req.body.department,
                salary: Number(req.body.salary)
            };
        }
        return emp;
    });

    await fileHandler.writeEmployees(updatedEmployees);
    res.redirect("/");
});


    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

startServer();
