import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list categories records
 * @GET /categories/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Categories.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'category_id', 'desc');
		query.attributes = DB.Categories.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Categories.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Categories record
 * @GET /categories/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Categories.viewFields();
		let record = await DB.Categories.findOne(query);
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
 * Route to insert Categories record
 * @POST /categories/add
 */
router.post('/add/', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('category_name').not().isEmpty(),
		body('createdat').not().isEmpty(),
		body('updatedat').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Categories record
		let record = await DB.Categories.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['category_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Categories record for edit
 * @GET /categories/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Categories.editFields();
		let record = await DB.Categories.findOne(query);
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
 * Route to update  Categories record
 * @POST /categories/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('category_name').optional({nullable: true}).not().isEmpty(),
		body('createdat').optional({nullable: true}).not().isEmpty(),
		body('updatedat').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Categories.editFields();
		let record = await DB.Categories.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Categories.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Categories record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /categories/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Categories.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Categories.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
