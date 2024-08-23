import { Router } from 'express';
import DB from '../models/db.js';


const router = Router();


 /**
 * Route to get user_id_option_list records
 * @GET /components_data/user_id_option_list
 */
router.get('/user_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT user_id as value, username as label FROM users` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get category_id_option_list records
 * @GET /components_data/category_id_option_list
 */
router.get('/category_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT category_id as value, category_name as label FROM categories` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
