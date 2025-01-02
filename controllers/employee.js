import { db } from "../utils/db.js";

const moveEmployee = {

    renderTransferPage: async (req, res) => {
        try {
            const employees = await db("EMPLOYEE as emp")
                .select("emp.ID_Employee", "emp.EmployeeName", "b.BranchName")
                .join("EMP_BRANCH_HISTORY as ebh", "emp.ID_Employee", "ebh.ID_Employee")
                .join("BRANCH as b", "ebh.ID_Branch", "b.ID_Branch")
                .whereNull("ebh.EndDate")
                .orderBy("emp.EmployeeName", "asc");
            

            const branches = await db("BRANCH").select("ID_Branch as BranchID", "BranchName").orderBy("BranchName");

            return res.render("transfer", {
                layout: "employee",
                customCSS: ["online_user_home.css", "employeeFeatures.css", "employeeTransfer.css"],
                employees,
                branches,
                success: req.query.success === "true",
                error: req.query.success === "false",
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send("Error rendering transfer page");
        }
    },

    moveEmployee: async (req, res) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const empdata =  req.body;
            const { employeeID, newBranchID } = empdata;

            // check if emp already in branch
            const existingRecord = await db("EMP_BRANCH_HISTORY")
            .where({ ID_Employee: employeeID, ID_Branch: newBranchID, EndDate: null })
            .first();

            if (existingRecord) {
                return res.redirect("/employee/transfer?success=false&message=already-in-branch");
            }
        
            // update the EndDate
            await db("EMP_BRANCH_HISTORY")
                .where("ID_Employee", employeeID)
                .whereNull("EndDate")
                .update("EndDate", currentDate);
        
            // insert
            await db("EMP_BRANCH_HISTORY").insert({
                ID_Employee: employeeID,
                ID_Branch: newBranchID,
                StartDate: currentDate,
                EndDate: null});

            return res.redirect("/employee/transfer?success=true");

        } catch(err) {
            console.log(err);
            return res.redirect("/employee/transfer?success=false&message=server-error");
        }
    }
}

export default moveEmployee;