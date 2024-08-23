
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Categories extends BaseModel {
	static init() {
		return super.init(
			{
				
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				category_name: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				createdat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				updatedat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				category_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "categories",
				modelName: "categories",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'category_id', 
			'user_id', 
			'category_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat'), 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'category_id', 
			'user_id', 
			'category_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat'), 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'category_id', 
			'user_id', 
			'category_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat')
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("category_id LIKE :search"), 
			Sequelize.literal("category_name LIKE :search"), 
			Sequelize.literal("createdAt LIKE :search"), 
			Sequelize.literal("updatedAt LIKE :search"),
		];
	}

	
	
}
Categories.init();
export default Categories;
