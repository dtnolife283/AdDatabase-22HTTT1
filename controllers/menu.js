import getData from "../utils/getData.js";

const menuController = {
    getMenuPage: async (req, res) => {
        const type = req.query.type;
        const foodTypes = await getData.getFoodTypes();
        const foods = await getData.getFoodItemsDetail(type);
        foods.forEach(food => {
            food.Price = food.Price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        });
        let selectedType = type;
        res.render('menu', {
            customCSS: ['menu.css', 'online_user_home.css', 'view.css'],
            customJS: ['view.js'],
            foods: foods,
            foodTypes: foodTypes,
            selectedType,
        });
    },
};

export default menuController;