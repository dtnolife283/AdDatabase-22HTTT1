import { db } from "./db.js";

class GetData {
    async getAreas() {
        return db("AREA").select("*");
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
}

export default new GetData();