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
}

export default new PostData();