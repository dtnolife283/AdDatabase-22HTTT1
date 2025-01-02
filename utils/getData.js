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
}

export default new GetData();