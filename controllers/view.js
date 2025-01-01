import getData from "../utils/getData.js";

const viewController = {
    getBranchesPage: async (req, res) => {
        const area = req.query.area;
        const parking = req.query.parking;
        const areas = await getData.getAreas();
        let branches = [];
        if ((area == 'all' || area == undefined) && (parking == 'all' || parking == undefined))
        branches = await getData.getBranches();
        else
        branches = await getData.getBranches(area, parking);
        branches.forEach((branch) => {
        branch.OpeningHour = branch.OpeningHour.toISOString().slice(11, 16);
        branch.CloseHour = branch.CloseHour.toISOString().slice(11, 16);
        });
        res.render('view', {
        branches: branches,
        areas: areas,
        customCSS: ['online_user_home.css', 'view.css'],
        customJS: ['view.js'],
        });
    },
};

export default viewController;