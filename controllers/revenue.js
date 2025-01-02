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

            let revenueData;
            let isBranchView = revenueBy === "branches";
            if (isBranchView) {

            // Query to get revenue for each dish by branch within the date range
                revenueData = await db("ORDER")
                .join("ORDER_FOOD", "ORDER.ID_Order", "ORDER_FOOD.ID_Order")
                .join("BRANCH_FOOD", "ORDER_FOOD.ID_BranchFood", "BRANCH_FOOD.ID_BranchFood")
                .join("FOOD_ITEM", "BRANCH_FOOD.ID_Food", "FOOD_ITEM.ID_Food")
                .select(
                    "BRANCH_FOOD.ID_Branch",
                    "BRANCH.BranchName",
                    "BRANCH_FOOD.ID_Food",
                    "FOOD_ITEM.FoodName",
                    db.raw("SUM(ORDER.ActualPrice) as TotalRevenue")
                )
                .whereLike("BRANCH.BranchName", searchName)
                .whereBetween("ORDER.OrderDate", [startDate, endDate])
                .groupBy("BRANCH_FOOD.ID_Branch", "BRANCH_FOOD.ID_Food")
                .orderBy("TotalRevenue", "desc");
            }
            else {
                // Query to get revenue for each dish by area within the date range
                revenueData = await db("ORDER")
                .join("ORDER_FOOD", "ORDER.ID_Order", "ORDER_FOOD.ID_Order")
                .join("BRANCH_FOOD", "ORDER_FOOD.ID_BranchFood", "BRANCH_FOOD.ID_BranchFood")
                .join("BRANCH", "ORDER.ID_Branch", "BRANCH.ID_Branch")
                .join("FOOD_ITEM", "BRANCH_FOOD.ID_Food", "FOOD_ITEM.ID_Food")
                .join("AREA", "BRANCH.ID_Area", "AREA.ID_Area")
                .select(
                    "BRANCH.ID_Area",
                    "AREA.AreaName",
                    "BRANCH.BranchName",
                    "BRANCH_FOOD.ID_Food",
                    "FOOD_ITEM.FoodName",
                    db.raw("SUM(ORDER.ActualPrice) as TotalRevenue")
                )
                .whereLike("AREA.AreaName", searchName)
                .whereBetween("ORDER.OrderDate", [startDate, endDate])
                .groupBy("BRANCH.ID_Area", "BRANCH_FOOD.ID_Food")
                .orderBy("TotalRevenue", "desc");
            }

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
