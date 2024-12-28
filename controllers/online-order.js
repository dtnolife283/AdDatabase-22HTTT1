import { db } from "../utils/db.js";

const onlineOrderController = {
  getOrderPage: async (req, res, next) => {
    try {
      const allAreas = await db("AREA").select("*");
      res.render("online-order/select-area", {
        customCSS: ["online_user_home.css"],
        allAreas,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getAreaPage: async (req, res, next) => {
    const areaId = req.params.areaId;
    try {
      const allBranches = await db("BRANCH")
        .select("*")
        .where("ID_Area", areaId);

      res.render("online-order/select-branch", {
        customCSS: ["online_user_home.css"],
        allBranches,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getBranchPage: async (req, res, next) => {
    const branchId = req.params.branchId;
    try {
      const branch = await db("BRANCH")
        .select("*")
        .where("ID_Branch", branchId)
        .first();
      const areaId = branch.ID_Area;
      const allFoods = await db("BRANCH_FOOD")
        .select("*")
        .where("ID_Branch", branchId)
        .where("Available", 1)
        .join("FOOD_ITEM", "BRANCH_FOOD.ID_Food", "FOOD_ITEM.ID_Food");

      res.render("online-order/select-food", {
        customCSS: ["online_user_home.css"],
        branch,
        areaId,
        allFoods,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default onlineOrderController;
