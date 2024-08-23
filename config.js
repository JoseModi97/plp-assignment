export default {
	app: {
		name: "ExpenseRest",
		url: "http://localhost:8060",
		frontendUrl: "http://localhost:8050",
		secret: "2a44b18a84b076ca04196bc012dab464",
		language: "english",
		publicDir: "assets",
	},
	auth: {
		userTokenSecret: "9a111c9A-1ax%W@bfd35YY6Q!!0-82d74275a0735d9bc849",
		apiTokenSecret: "cce1b2e8$Xax%W!e3d8d9B#Q-!07aa0de8323a29a3f3bb4a",
		jwtDuration: 30, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"c:/users/jose/documents/radsystems/noderad projects/expenserest/database/expense_manager.db",
		type: "sqlite",
		host: "localhost",
		username: "root",
		password: "",
		port: "",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"",
		password: "",
		senderemail:"",
		sendername:"",
		host: "",
		secure: true,
		port: ""
	},
	upload: {
		tempDir: "uploads/temp/",
		importdata: {
			filenameType: "timestamp",
			extensions: "csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "us-west-2",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}