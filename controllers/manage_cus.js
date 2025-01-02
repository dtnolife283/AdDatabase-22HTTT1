import { db } from "../utils/db.js";

const managerCusController = {
    getAllCus: async (req, res) => {
        try{
            const allCus = await db("CUSTOMER").select("*");
            res.render("manage_cus", {
                customCSS: ['online_user_home.css', 'viewEmployee.css', 'view.css'],
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
                customCSS: ['online_user_home.css', 'view.css', 'viewEmployee.css'],
                customJS: ["manage_cus.js"],
                layout: "employee",
                customer: customer,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },
    
    confirmUpdate: async (req, res) => {
        try {
            const { id, name, email, phone, ssid, gender } = req.body;
            await db("CUSTOMER").where("ID_CUSTOMER", id).update({
                CustomerName: name,
                Email: email,
                PhoneNumber: phone,
                SSID: ssid,
                gender: gender,
            });
            res.redirect("/employee/manage_cus");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    confirmDeletion: async (req, res) => {
        try {
            const { id } = req.body;
            console.log(id);
            await db("CUSTOMER").where("ID_CUSTOMER", id).del();
            res.redirect("/employee/manage_cus");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    addCus: async (req, res) => {
        try {
            let id = await db("CUSTOMER").max("ID_CUSTOMER as maxID").first();
            id = (id.maxID || 0) + 1; 
            
            res.render("manage_cus/add_cus", {
                customCSS: ['online_user_home.css', 'view.css'],
                customJS: ["manage_cus.js"],
                layout: "employee",
                id: id,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    confirmAdd: async (req, res) => {
        try {
            const { id, name, email, phone, ssid, gender } = req.body;
            await db("CUSTOMER").insert({
                ID_CUSTOMER: id,
                CustomerName: name,
                Email: email,
                PhoneNumber: phone,
                SSID: ssid, 
                Gender: gender,
            });
            res.redirect("/employee/manage_cus");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
};



export default managerCusController;