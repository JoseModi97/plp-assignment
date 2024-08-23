import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list paymentmethods records
 * @GET /paymentmethods/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.Paymentmethods.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'payment_method_id', 'desc');
		query.attributes = DB.Paymentmethods.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Paymentmethods.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Paymentmethods record
 * @GET /paymentmethods/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['payment_method_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Paymentmethods.viewFields();
		let record = await DB.Paymentmethods.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Paymentmethods record
 * @POST /paymentmethods/add
 */
router.post('/add/', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('payment_method_name').not().isEmpty(),
		body('createdat').not().isEmpty(),
		body('updatedat').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Paymentmethods record
		let record = await DB.Paymentmethods.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['payment_method_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Paymentmethods record for edit
 * @GET /paymentmethods/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['payment_method_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Paymentmethods.editFields();
		let record = await DB.Paymentmethods.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  Paymentmethods record
 * @POST /paymentmethods/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('payment_method_name').optional({nullable: true}).not().isEmpty(),
		body('createdat').optional({nullable: true}).not().isEmpty(),
		body('updatedat').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['payment_method_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Paymentmethods.editFields();
		let record = await DB.Paymentmethods.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Paymentmethods.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Paymentmethods record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /paymentmethods/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['payment_method_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Paymentmethods.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Paymentmethods.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
