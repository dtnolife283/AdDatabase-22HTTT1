import { get } from "http";
import getData from "../utils/getData.js";
import postData from "../utils/postData.js";

const viewEmployeeController = {
    getViewEmployeePage: async (req, res) => {
        const branch = req.query.branch;
        const branches = await getData.getSimpleBranches();
        const departments = await getData.getDepartments();
        let employees = await getData.getEmployees(branch);
        employees = employees.map(employee => {
            const dob = new Date(employee.DoB);
            return {
                ...employee,
                DoB: `${dob.getDate().toString().padStart(2, '0')}/${
                        (dob.getMonth() + 1).toString().padStart(2, '0')
                        }/${dob.getFullYear()}`
            };
        });
        let selectedBranch = branch;
        res.render('viewEmployee', {
            layout: 'employee',
            customCSS: ['online_user_home.css', 'view.css', 'viewEmployee.css'],
            customJS: ['view.js', 'viewEmployee.js'],
            branches: branches,
            departments: departments,
            employees: employees,
            selectedBranch,
            }
        )
    },

    getEditEmployeeInfoPage: async (req, res) => {
        const id = req.params.id;
        const departments = await getData.getDepartments();
        let employee = await getData.getEmployeeById(id);
        const dob = new Date(employee.DoB);
        employee.DoB = `${dob.getFullYear()}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getDate().toString().padStart(2, '0')}`;
        res.render('editEmployeeInfo', {
            layout: 'employee',
            customCSS: ['online_user_home.css'],
            customJS: ['editEmployeeInfo.js'],
            employee: employee,
            departments: departments
        });
    },

    postEditEmployeeInfo: async (req, res) => {
        const id = req.params.id;
        const employee = req.body;
        await postData.postEditEmployeeInfo(employee, id);
        await postData.postEditEmployeeLeaveBalance(employee, id);
        res.redirect('/employee/view-employee');
    },

    postDeleteEmployee: async (req, res) => {
        const id = req.params.id;
        await postData.postDeleteEmployee(id);
        res.redirect('/employee/view-employee');
    },

    postAddEmployee: async (req, res) => {
        const employee = req.body;
        await postData.postAddEmployee(employee);
        res.redirect('/employee/view-employee');
    }
};

export default viewEmployeeController;