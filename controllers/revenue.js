import { db } from "../utils/db.js";

const revenueController = {
    getRevenueHomePage: async (req, res) => {
        try {
            const { startDate, endDate, revenueBy, searchName } = req.query;
            res.render("revenue", {
                customCSS: ['online_user_home.css'],
                customJS: ["revenue.js"],
                layout: "employee",
                startDate,
                endDate,
                revenueBy,
                searchName
            });
           
        } catch (err) {
            console.error("Error fetching statistics data:", err);
            res.status(500).send("Internal Server Error");
        }
    },
    getRevenuePage: async (req, res) => {
        try {
            const { startDate, endDate, revenueBy, searchName } = req.query;

            // Validate if required fields are provided
            if (!startDate || !endDate || !revenueBy) {
                return res.status(400).send("Start date, end date, and revenue type are required.");
            }

            let revenueData = [];
            let isBranchView = revenueBy === "branches";
            if (isBranchView) {

            // Query to get revenue for each dish by branch within the date range
            revenueData = await db("ORDER as O")
                .join("BRANCH as B", "O.ID_Branch", "B.ID_Branch")
                .join("BRANCH_FOOD as BF", "BF.ID_Branch", "O.ID_Branch")
                .join("FOOD_ITEM as FI", "BF.ID_Food", "FI.ID_Food")
                .join("ORDER_FOOD as ORF", function () {
                    this.on("ORF.ID_Order", "O.ID_Order")
                        .andOn("ORF.ID_BranchFood", "BF.ID_BranchFood");
                })
                .where("B.BranchName", searchName)
                .whereBetween("O.OrderDate", [startDate, endDate])
                .select(
                    "B.ID_Branch",
                    "B.BranchName",
                    "FI.FoodName",
                    db.raw("SUM(FI.Price * ORF.Quantity) as TotalRevenue")
                )
                .groupBy("B.ID_Branch", "B.BranchName", "FI.FoodName", "FI.ID_Food")
                .orderBy("TotalRevenue", "asc");
            }
            else {
                // Query to get revenue for each dish by area within the date range
                revenueData = await db("ORDER as O")
                .join("BRANCH as B", "O.ID_Branch", "B.ID_Branch")
                .join("BRANCH_FOOD as BF", "BF.ID_Branch", "O.ID_Branch")
                .join("AREA as A", "A.ID_Area", "B.ID_Area")
                .join("FOOD_ITEM as FI", "BF.ID_Food", "FI.ID_Food")
                .join("ORDER_FOOD as ORF", function () {
                    this.on("ORF.ID_Order", "O.ID_Order")
                        .andOn("ORF.ID_BranchFood", "BF.ID_BranchFood");
                })
                .where("A.AreaName", searchName)
                .whereBetween("O.OrderDate", [startDate, endDate])
                .select(
                    "B.ID_Branch",
                    "B.BranchName",
                    "FI.FoodName",
                    db.raw("SUM(FI.Price * ORF.Quantity) as TotalRevenue")
                )
                .groupBy("A.ID_Area", "B.ID_Branch", "B.BranchName", "FI.FoodName", "FI.ID_Food")
                .orderBy("TotalRevenue", "asc");
            }

            console.log(req.query);
            revenueData = revenueData.map((row) => {
                return {
                    ...row,
                    totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.TotalRevenue)
                };
            });
            // Render the results to the page
            res.render("revenue", {
                customCSS: ['online_user_home.css'],
                customJS: ["revenue.js"],
                layout: "employee",
                Revenue: revenueData,
                startDate,
                endDate,
                revenueBy,
                searchName
            });
        } catch (err) {
            console.error("Error fetching revenue data:", err);
            res.status(500).send("Internal Server Error");
        }
    }
};

export default revenueController;
