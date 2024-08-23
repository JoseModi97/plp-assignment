import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list expenses records
 * @GET /expenses/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Expenses.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'expense_id', 'desc');
		query.attributes = DB.Expenses.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Expenses.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Expenses record
 * @GET /expenses/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['expense_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Expenses.viewFields();
		let record = await DB.Expenses.findOne(query);
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
 * Route to insert Expenses record
 * @POST /expenses/add
 */
router.post('/add/', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('category_id').optional({nullable: true, checkFalsy: true}),
		body('amount').not().isEmpty().isNumeric(),
		body('date').not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('createdat').not().isEmpty(),
		body('updatedat').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Expenses record
		let record = await DB.Expenses.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['expense_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Expenses record for edit
 * @GET /expenses/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['expense_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Expenses.editFields();
		let record = await DB.Expenses.findOne(query);
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
 * Route to update  Expenses record
 * @POST /expenses/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('category_id').optional({nullable: true, checkFalsy: true}),
		body('amount').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('date').optional({nullable: true}).not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('createdat').optional({nullable: true}).not().isEmpty(),
		body('updatedat').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['expense_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Expenses.editFields();
		let record = await DB.Expenses.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Expenses.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Expenses record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /expenses/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['expense_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Expenses.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Expenses.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
