import { db } from "./db.js";

class GetData {
    async getAreas() {
        return db("AREA").select("*");
    }

    async getSimpleBranches() {
        return db("BRANCH").select("ID_Branch", "BranchName");
    }

    async getBranches(area = undefined, parking = undefined) {
        if (area == undefined && parking == undefined)
            return db("BRANCH").select("*");
        
        if (area === 'all' && parking === 'none')
            return db("BRANCH as b")
                .leftJoin("PARKING as p", "b.ID_Branch", "p.ID_Branch")
                .whereNull("p.ID_Branch")
                .select("b.*");
        
        if (area != 'all' && parking === 'none') 
            return db("BRANCH as b")
                .leftJoin("PARKING as p", "b.ID_Branch", "p.ID_Branch")
                .where("b.ID_Area", area)
                .whereNull("p.ID_Branch")
                .select("b.*");

        if (area === 'all' && parking != 'none') 
            return db("BRANCH as b")
                .join("PARKING as p", "b.ID_Branch", "p.ID_Branch")
                .where("p.ParkingType", parking)
                .distinct("b.*"); 

        if (area != 'all' && parking != 'none' && parking != 'all')
            return db("BRANCH as b")
                .join("PARKING as p", "b.ID_Branch", "p.ID_Branch")
                .where("b.ID_Area", area)
                .where("p.ParkingType", parking)
                .distinct("b.*");

        if (area != 'all' && parking == 'all')
            return db("BRANCH as b")
                .where("b.ID_Area", area)
                .select("b.*");

        return db("BRANCH").select("*");
    }

    async getFoodItems() {
        return db("FOOD_ITEM").select(
            "ID_Food",
            "FoodName",
        );
    }

    async getFoodTypes() {
        return db("FOOD_TYPE").select("*");
    }

    async getFoodItemsDetail(type = 'all') {
        if (type === 'all' || type === undefined)
            return db('FOOD_ITEM as f')
                .join('FOOD_TYPE as ft', 'f.ID_Type', 'ft.ID_Type')
                .select(
                    'f.*',
                    'ft.TypeName'
                ); 
        return db('FOOD_ITEM as f')
            .join('FOOD_TYPE as ft', 'f.ID_Type', 'ft.ID_Type')
            .where('ft.ID_Type', type)
            .select(
                'f.*',
                'ft.TypeName'
            );
    }

    async getBranchesByFoodItem(food = 'all') {
        if (food === 'all' || food === undefined)
            return db("BRANCH").select("*");
        return db("BRANCH_FOOD as bf")
            .join("BRANCH as b", "bf.ID_Branch", "b.ID_Branch")
            .join("FOOD_ITEM as f", "bf.ID_Food", "f.ID_Food")
            .where("f.ID_Food", food)
            .distinct("b.ID_Branch");
    }

    async getEmployees(branch = 'all') {
        if (branch === 'all' || branch === undefined)
            return db("EMPLOYEE as e")
                .join("DEPARTMENT as d", "e.ID_Department", "d.ID_Department")
                .select(
                    "e.*",
                    "d.DepartmentName"
                );
        return db('EMPLOYEE as e')
            .join('DEPARTMENT as d', 'e.ID_Department', 'd.ID_Department')
            .join('EMP_BRANCH_HISTORY as ebh', 'e.ID_Employee', 'ebh.ID_Employee')
            .where('ebh.ID_Branch', branch)
            .whereNull('ebh.EndDate')
            .select(
                'e.*',
                'd.DepartmentName'
            );
    }

    async getEmployeeById(id) {
        return db("EMPLOYEE as e")
            .join("DEPARTMENT as d", "e.ID_Department", "d.ID_Department")
            .join("EMPLOYEE_LEAVE_BALANCE as elb", "e.ID_Employee", "elb.ID_Employee")
            .where("e.ID_Employee", id)
            .select(
                "e.*",
                "d.DepartmentName",
                "d.Salary",
                "elb.RemainingDays as RemainingDaysOff",
                "elb.TotalDays as TotalDaysOff"
            )
            .first();
    }

    async getEmployeeBranchHistory(id) { 
        return db("EMP_BRANCH_HISTORY as ebh")
            .join("BRANCH as b", "ebh.ID_Branch", "b.ID_Branch")
            .join("AREA as a", "b.ID_Area", "a.ID_Area")
            .where("ebh.ID_Employee", id)
            .select(
                "ebh.*",
                "b.BranchName",
                "a.AreaName"
            );
    }

    async getDepartments() {
        return db("DEPARTMENT").select("*");
    }
    
    async getQuarterlyServiceScoreByEmployee(id) {
        try {
            const query = `
                SELECT 
                    e.ID_Employee AS employee_id, 
                    e.EmployeeName AS employee_name, 
                    AVG(r.ServiceScore) AS avg_service_score, 
                    CONCAT(YEAR(o.OrderDate), '-Q', DATEPART(QUARTER, o.OrderDate)) AS period
                FROM EMPLOYEE e
                JOIN [ORDER] o ON e.ID_Employee = o.ID_Employee
                JOIN REVIEW r ON o.ID_Review = r.ID_Review
                WHERE e.ID_Employee = ?
                GROUP BY 
                    YEAR(o.OrderDate), 
                    DATEPART(QUARTER, o.OrderDate), 
                    e.ID_Employee, 
                    e.EmployeeName
                ORDER BY e.ID_Employee
            `;
    
            const results = await db.raw(query, [id]);
            return results;
        } catch (error) {
            console.error("Error fetching quarterly service scores:", error);
            throw new Error("Could not fetch service scores.");
        }
    }

    async getDailyServiceScoreByEmployee(id) {
        try {
            const query = `
                SELECT 
                    e.ID_Employee AS employee_id, 
                    e.EmployeeName AS employee_name, 
                    AVG(r.ServiceScore) AS avg_service_score, 
                    CONVERT(VARCHAR(10), o.OrderDate, 120) AS period -- Format as YYYY-MM-DD
                FROM EMPLOYEE e
                JOIN [ORDER] o ON e.ID_Employee = o.ID_Employee
                JOIN REVIEW r ON o.ID_Review = r.ID_Review
                WHERE e.ID_Employee = ?
                GROUP BY 
                    CONVERT(VARCHAR(10), o.OrderDate, 120), -- Group by day
                    e.ID_Employee, 
                    e.EmployeeName
                ORDER BY period
            `;
    
            const results = await db.raw(query, [id]);
            return results;
        } catch (error) {
            console.error("Error fetching daily service scores:", error);
            throw new Error("Could not fetch service scores.");
        }
    }
    
    async getMonthlyServiceScoreByEmployee(id) {
        try {
            const query = `
                SELECT 
                    e.ID_Employee AS employee_id, 
                    e.EmployeeName AS employee_name, 
                    AVG(r.ServiceScore) AS avg_service_score, 
                    CONVERT(VARCHAR(7), o.OrderDate, 120) AS period -- Format as YYYY-MM
                FROM EMPLOYEE e
                JOIN [ORDER] o ON e.ID_Employee = o.ID_Employee
                JOIN REVIEW r ON o.ID_Review = r.ID_Review
                WHERE e.ID_Employee = ?
                GROUP BY 
                    CONVERT(VARCHAR(7), o.OrderDate, 120), -- Group by month
                    e.ID_Employee, 
                    e.EmployeeName
                ORDER BY period
            `;
    
            const results = await db.raw(query, [id]);
            return results;
        } catch (error) {
            console.error("Error fetching monthly service scores:", error);
            throw new Error("Could not fetch service scores.");
        }
    }
    
    async getYearlyServiceScoreByEmployee(id) {
        try {
            const query = `
                SELECT 
                    e.ID_Employee AS employee_id, 
                    e.EmployeeName AS employee_name, 
                    AVG(r.ServiceScore) AS avg_service_score, 
                    YEAR(o.OrderDate) AS period -- Year as the period
                FROM EMPLOYEE e
                JOIN [ORDER] o ON e.ID_Employee = o.ID_Employee
                JOIN REVIEW r ON o.ID_Review = r.ID_Review
                WHERE e.ID_Employee = ?
                GROUP BY 
                    YEAR(o.OrderDate), -- Group by year
                    e.ID_Employee, 
                    e.EmployeeName
                ORDER BY period
            `;
    
            const results = await db.raw(query, [id]);
            return results;
        } catch (error) {
            console.error("Error fetching yearly service scores:", error);
            throw new Error("Could not fetch service scores.");
        }
    }
    
    
}    

export default new GetData();