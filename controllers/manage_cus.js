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
                customJS: ["manage_cus.js"],
                layout: "employee",
                customer: customer,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },
    
    updateCus: async (req, res) => {
        try {
            const { id, name, email, phone, ssid, gender } = req.body;
            await db("CUSTOMER").where("ID_CUSTOMER", id).update({
                CustomerName: name,
                Email: email,
                PhoneNumber: phone,
                SSID: ssid,
            })
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

};

export default managerCusController;