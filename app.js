const render = require("./lib/htmlRenderer");
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const employees = [];
const outputDir = path.resolve(__dirname, "./output");

let addEngineer = true;
let addIntern = true;

function getManager() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "managerName",
                message: "Please begin by providing data for the team manager. What is the team manager's name?"
            },
            {
                type: "input",
                name: "managerId",
                message: "What is the manager's id number?"
            },
            {
                type: "input",
                name: "managerEmail",
                message: "Please provide the manager's work email."
            },
            {
                type: "input",
                name: "officeNumber",
                message: "What is the manager's office number?"
            }
        ])
        .then(function(response) {
            let manager = new Manager(response.managerName, response.managerId, response.managerEmail, response.officeNumber);
            employees.push(manager);
        });
}

function getEngineers() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "engineerName",
                message: "What is the name of the team's engineer?"
            },
            {
                type: "input",
                name: "engineerId",
                message: "What is the engineer's id number?"
            },
            {
                type: "input",
                name: "engineerEmail",
                message: "Please provide the engineer's work email."
            },
            {
                type: "input",
                name: "GitHub",
                message: "What is the engineer's GitHub username?"
            },
            {
                type: "confirm",
                name: "addEngineer",
                message: "Would you like to add another engineer to your team profile?"
            }
        ])
        .then(function(response) {
            let engineer = new Engineer(response.engineerName, response.engineerId, response.engineerEmail, response.GitHub);
            addEngineer = response.addEngineer;
            employees.push(engineer);
            console.log(response);
        })
}

function getInterns() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "internName",
                message: "What is the name of the team's intern?"
            },
            {
                type: "input",
                name: "internId",
                message: "What is the intern's id number?"
            },
            {
                type: "input",
                name: "internEmail",
                message: "Please provide the intern's work email."
            },
            {
                type: "input",
                name: "school",
                message: "Which school does the intern attend?"
            },
            {
                type: "confirm",
                name: "addIntern",
                message: "Would you like to add another intern to your team profile?"
            }
        ])
        .then(function(response) {
            let intern = new Intern(response.internName, response.internId, response.internEmail, response.school);
            addIntern = response.addIntern;
            employees.push(intern);
            console.log(response);
        })
}

async function init() {
    try {
        await getManager();
        // console.log(employees);

        while (addEngineer) {
            await getEngineers();
            // console.log(employees);
        }
        
        while (addIntern) {
            await getInterns();
            // console.log(employees);
        }

        await render(employees);

        const write = fs.writeFileSync(path.resolve(outputDir, "main.html"), render(employees), "utf8");

        await write;

    } catch(err) {
        console.log(err);
    }
}

init();


module.exports = employees;