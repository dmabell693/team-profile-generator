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

const validateName = name => {
    if (/[a-z]/gi.test(name)) {
        return true;
    } else {
        return "Please enter a valid name";
    }    
}

const validateId = id => {
    if (/[0-9]/g.test(id)) {
        return true;
    } else {
        return "Please enter a valid id number";
    }
}

// Code snippet used for RegEx taken from "https://www.w3resource.com/javascript/form/email-validation.php"
const validateEmail = email => {
    if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g.test(email)) {
        return true;
    } else {
        return "Please enter a valid email address";
    }
}

const validateOfficeNumber = num => {
    if (/[a-z0-9]/gi.test(num)) {
        return true;
    } else {
        return "Please enter a valid office number";
    }
}

const validateSchool = school => {
    if (/[a-z]/gi.test(school)) {
        return true;
    } else {
        return "Please enter a valid school name";
    }
}

function getManager() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Please begin by providing data for the team manager. What is the team manager's name?",
                validate: validateName
            },
            {
                type: "input",
                name: "id",
                message: "What is the manager's id number?",
                validate: validateId
            },
            {
                type: "input",
                name: "email",
                message: "Please provide the manager's work email.",
                validate: validateEmail
            },
            {
                type: "input",
                name: "officeNumber",
                message: "What is the manager's office number?",
                validate: validateOfficeNumber
            }
        ])
        .then(function(response) {
            let manager = new Manager(response.name, response.id, response.email, response.officeNumber);
            employees.push(manager);
        });
}

function getEngineers() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the team's engineer?",
                validate: validateName
            },
            {
                type: "input",
                name: "id",
                message: "What is the engineer's id number?",
                validate: validateId
            },
            {
                type: "input",
                name: "email",
                message: "Please provide the engineer's work email.",
                validate: validateEmail
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
            let engineer = new Engineer(response.name, response.id, response.email, response.GitHub);
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
                name: "name",
                message: "What is the name of the team's intern?",
                validate: validateName
            },
            {
                type: "input",
                name: "id",
                message: "What is the intern's id number?",
                validate: validateId
            },
            {
                type: "input",
                name: "email",
                message: "Please provide the intern's work email.",
                validate: validateEmail
            },
            {
                type: "input",
                name: "school",
                message: "Which school does the intern attend?",
                validate: validateSchool
            },
            {
                type: "confirm",
                name: "addIntern",
                message: "Would you like to add another intern to your team profile?"
            }
        ])
        .then(function(response) {
            let intern = new Intern(response.name, response.id, response.email, response.school);
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