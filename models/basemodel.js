
import Sequelize from "sequelize";
import config from "../config.js";

const dbConfig = config.database;


const sequelize = new Sequelize({
		dialect: dbConfig.type, 
		storage: dbConfig.name,
		define: {
			timestamps: false,
			freezeTableName: true
		},
		operatorsAliases: 0
	});


class BaseModel extends Sequelize.Model {
	static async findValue(column, where) {
		const row = await this.findOne({
			attributes: [column],
			where
		});

		if (row) {
			return row[column];
		}
		return null;
	}
	
	static async paginate(query, page, limit) {
		query.offset = limit * (page - 1);
		query.limit = limit;
		let result = await this.findAndCountAll(query);
		let totalRecords = result.count;
		let records = result.rows;
		let recordCount = records.length;
		let totalPages = Math.ceil(totalRecords / limit);
		let data = {
			totalRecords,
			recordCount,
			totalPages,
			records
		}
		return data;
	}
}

export { BaseModel, sequelize, Sequelize };
