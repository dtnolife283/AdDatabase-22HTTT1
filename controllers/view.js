import getData from "../utils/getData.js";

const viewController = {
    getBranchesPage: async (req, res) => {
        const area = req.query.area;
        const parking = req.query.parking;
        const food = req.query.food;
        const areas = await getData.getAreas();
        const foods = await getData.getFoodItems();
        let branches = [];
        if ((area == 'all' || area == undefined) && (parking == 'all' || parking == undefined))
            branches = await getData.getBranches();
        else
            branches = await getData.getBranches(area, parking);
        branches.forEach((branch) => {
            branch.OpeningHour = branch.OpeningHour.toISOString().slice(11, 16);
            branch.CloseHour = branch.CloseHour.toISOString().slice(11, 16);
        });
        let branchesByFood = await getData.getBranchesByFoodItem(food);
        branches.filter(branch => branchesByFood.some(branchByFood => branch.ID_Branch === branchByFood.ID_Branch));
        let selectedArea = area;
        let selectedParking = parking;
        let selectedFood = food;
        res.render('view', {
            branches: branches,
            areas: areas,
            customCSS: ['online_user_home.css', 'view.css'],
            customJS: ['view.js'],
            foods: foods,
            selectedArea,
            selectedParking,
            selectedFood,
        });
    },
};

export default viewController;