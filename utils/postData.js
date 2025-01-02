import { db } from "./db.js";

class PostData {
    async postEditEmployeeInfo(employee, id) {
        return db("EMPLOYEE")
            .where("ID_Employee", id)
            .update(
                {
                    EmployeeName: employee.employeeName,
                    DoB: employee.employeeDoB,
                    PhoneNumber: employee.employeePhone,
                    Gender: employee.employeeGender,
                    ID_Department: employee.employeeDepartment
                }
            );
    }

    async postEditEmployeeLeaveBalance(employee, id) {
        return db("EMPLOYEE_LEAVE_BALANCE")
            .where("ID_Employee", id)
            .update(
                {
                    TotalDays: employee.employeeTotalDaysOff,
                    RemainingDays: employee.employeeRemainingDaysOff
                }
            );
    }

    async postDeleteEmployee(id) {
        return db("EMPLOYEE")
            .where("ID_Employee", id)
            .del();
    }

    async getLastEmployeeId() {
        const lastEmployee = await db("EMPLOYEE").orderBy("ID_Employee", "desc").first();
        return lastEmployee.ID_Employee;
    }

    async postAddEmployee(employee) {
        const lastEmployeeId = await this.getLastEmployeeId();
        try {
            await db("EMPLOYEE").insert({
                ID_Employee: lastEmployeeId + 1,
                EmployeeName: employee.employeeName,
                DoB: employee.dob,
                PhoneNumber: employee.phoneNumber,
                Gender: employee.gender,
                ID_Department: employee.department
            });
            await db("EMPLOYEE_LEAVE_BALANCE").insert({ ID_Employee: lastEmployeeId + 1 });
            await db("EMP_BRANCH_HISTORY").insert({
                ID_Employee: lastEmployeeId + 1,
                ID_Branch: employee.branch,
                StartDate: new Date(),
                EndDate: null
            });
            return { success: true };
    
        } catch (error) {
            console.error("Error inserting employee data: ", error);
            return { success: false, error: error.message };
        }
    }
    
}

export default new PostData();