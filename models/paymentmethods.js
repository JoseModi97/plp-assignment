
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Paymentmethods extends BaseModel {
	static init() {
		return super.init(
			{
				
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				payment_method_name: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				createdat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				updatedat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				payment_method_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "paymentmethods",
				modelName: "paymentmethods",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'payment_method_id', 
			'user_id', 
			'payment_method_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat'), 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'payment_method_id', 
			'user_id', 
			'payment_method_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat'), 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'payment_method_id', 
			'user_id', 
			'payment_method_name', 
			Sequelize.literal('createdAt AS createdat'), 
			Sequelize.literal('updatedAt AS updatedat')
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("payment_method_id LIKE :search"), 
			Sequelize.literal("payment_method_name LIKE :search"), 
			Sequelize.literal("createdAt LIKE :search"), 
			Sequelize.literal("updatedAt LIKE :search"),
		];
	}

	
	
}
Paymentmethods.init();
export default Paymentmethods;
