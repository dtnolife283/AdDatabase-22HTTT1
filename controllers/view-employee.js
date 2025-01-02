import { get } from "http";
import getData from "../utils/getData.js";

const viewEmployeeController = {
    getViewEmployeePage: async (req, res) => {
        const branch = req.query.branch;
        const branches = await getData.getSimpleBranches();
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
            customCSS: ['online_user_home.css', 'view.css'],
            customJS: ['view.js'],
            branches: branches,
            employees: employees,
            selectedBranch,
            }
        )
    },
};

export default viewEmployeeController;