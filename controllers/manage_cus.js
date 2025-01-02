import { db } from "../utils/db.js";

const managerCusController = {
    getAllCus: async (req, res) => {
        try{
            const allCus = await db("CUSTOMER").select("*");
            res.render("manage_cus", {
                customCSS: ['online_user_home.css'],
                customJS: ["manage_cus.js"],
                layout: "employee",
                allCus: allCus,
            });
        }
        catch(err){
            console.log(err);
        }
    },
    
    editCus: async (req, res) => {
        try {
            const customerId = req.params.id;
            const customer = await db("CUSTOMER").where("ID_CUSTOMER", customerId).first();

            res.render("manage_cus/edit_cus", {
                customCSS: ['online_user_home.css', 'view.css'],
                customJS: ["edit_customer.js"],
                layout: "employee",
                customer: customer,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    updateCustomer: async (req, res) => {
        try {
            const customerId = req.params.id;
            const customerData = req.body;
            console.log(customerData);

            res.json({ message: "Customer updated successfully!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "An error occurred while updating the customer." });
        }
    }
    
};

export default managerCusController;