// app/routes.js

	module.exports = function(app) {

		// getting menu items list
		app.get('/menu/menulist', function(req, res) {
			
			var db = req.db;
			db.collection('menu').find().toArray(function (err, items) {
				db.collection('submenu').find().toArray(function (err, subitems) {
					this.finalJson = new Array();
				    items.forEach(function(item){
						
				    	item.sub.forEach(function(subitem){
							var subItemName = subitem.name;
							var supersub = new Array();
							supersub = getSuperSub(subItemName);
							subitem["supersub"]=supersub;
						});
						
						this.finalJson.push(item);
					});
					
					res.json(this.finalJson);
					
					// function to get supersub array of each sub elements
					function getSuperSub(subItemName) {
					     var superSubMenu = new Array();
					     subitems.forEach(function(subitem){
					    	 if(subItemName==subitem.name){
					    		 superSubMenu = subitem.supersub; 
					    	 }
					   });
					     
					     return superSubMenu ;              
					}
				});
			});
		});
		
		
		// getting users list
		app.get('/user/getUsers', function(req, res) {
			
			    var db = req.db;
			    db.collection('user').find().toArray(function (err, items) {
			        res.json(items);
			    });
			
		});
		
		
		//Add a new user
		app.post('/user/addUser', function(req, res) {
			var db = req.db;
			
			var userInfo = {
					
					fullName : req.body.fullName,
					emailId : req.body.emailId,
					password : req.body.password,
					mobileNo : req.body.mobileNo,
					alternateNo : req.body.alternateNo,
					address : req.body.address
			 };
			  
			//insert record
			db.collection('user').insert(userInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
				 return res.json({"status":"successfullyAdded","user":records[0]});
			});
			
		});
		
		//Add menu Item at Level-0
		app.post('/menu/addMenuItemLevelZero', function(req, res) {
			var db = req.db;
			
			var insertMenuItemLevelZero = {
					name : req.body.name,
					sub :[]
				};
			//insert record
			db.collection('menu').insert(insertMenuItemLevelZero, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
			});
			
		});
		
		
		//Add menu Item at Level-1
		app.post('/menu/addMenuItemLevelOne', function(req, res) {
			var db = req.db;
			
			var levelZeroName = req.body.levelZeroName;
			var nameVal = req.body.name;
			
			
			db.collection('menu').update({name:levelZeroName},{ $addToSet: {sub:{name : nameVal}}},function(err, records) {
				if (err) throw err;
				console.log("menu Item added successfully at level-1 in @@@ menu table");
				
				db.collection('submenu').insert({"name":nameVal},function(err2,records){
					if (err2) throw err2;
					console.log("menu Item added @@@ submenu table");
				});
			});
			
		});
		
		
		//Add menu Item at Level-2
		app.post('/menu/addMenuItemLevelTwo', function(req, res) {
			
			var db = req.db;
			var levelOneName = req.body.levelOneName;
			var nameVal = req.body.name;
			
			db.collection('submenu').update({name:levelOneName},{ $addToSet: {supersub:{name : nameVal}}},function(err, records) {
				if (err) throw err;
				console.log("menu Item added successfully at level-2");
			});	
			
		});
		
		
		// Search Items
		app.get('/item/searchItems', function(req, res) {
			
			var category = req.param("category");
			var db = req.db;
			
			db.collection('item').find({category: category}).toArray(function (err, items) {
		        res.json(items);
		    });
			
			
		});
		
		
		
		
	
		
		
		//Add Item
		app.post('/item/addItem', function(req, res) {
			
			var db = req.db;
			var mongo = req.mongo;
			var amtPriceObj = req.body.amountprice;
			var ObjectID = mongo.ObjectID;
			amtPriceObj.forEach (function (e){
			   e.productId = new ObjectID();
			});

			
			
			var itemInfo = {
					
					category : req.body.category,
					name : req.body.name,
					brand : req.body.brand,
					othernames : req.body.othernames,
					description : req.body.description,
					availablity : req.body.availablity,
					imageId : req.body.imageId,
					amountprice : amtPriceObj
					
					
			};
			
			
			
			//insert record
			db.collection('item').insert(itemInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
				res.json(records[0]._id);
			});
			
			//console.log('Hello world');
		    //console.log(req.files);
			
			
		});
		
		app.post('/item/addImage', function(req, res) {
			
		   console.log('image name in the server is:-'+req.files.file.name);
		   var a = req.files.file.name;
		   var finalJson = {ImgId:a};
		   res.json(finalJson);
		    
		});
		
		
		//submit order
		app.post('/order/submitOrder', function(req, res) {
			var db = req.db;
			var orderInfo = {
            		fullName : req.body.fullName,
            		emailId : req.body.emailId,
            		mobileNo : req.body.mobileNo,
            		alternateNo : req.body.alternateNo,
            		address : req.body.address,
					date : req.body.date,
					grandTotal:req.body.grandTotal,
					order: req.body.order
			};
			
			db.collection('order').insert(orderInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
				res.json(records[0]._id);
				
			});
			
		});
		
		
		//default html 
		app.get('/', function(req, res) {
			res.sendfile('./public/views/index.html'); // load our public/index.html file
		});
		
		
	   function insertDocument(doc, targetCollection) {
		   while (1) {

		        var cursor = targetCollection.find( {}, { _id: 1 } ).sort( { _id: -1 } ).limit(1);
		        var seq = cursor.hasNext() ? cursor.next()._id + 1 : 1;
		        doc._id = seq;
		        var results = targetCollection.insert(doc);
		        if( results.hasWriteError() ) {
		            if( results.writeError.code == 11000 )
		                continue;
		            else
		                print( "unexpected error inserting data: " + tojson( results ) );
		        }
		        break;
		   		}
			};
			
			
		app.post('/user/login', function(req, res) {
		//console.log("abhinav here");
			var db = req.db;
			var emailId = req.param("emailId");
			var password = req.param("password");
						
						
			db.collection('user').findOne({emailId: emailId,password:password},function(err, user) {
				if (err) { 
					// user not found 
					
					return res.json({"status":"fail","message":"Internal Error Occured!!!"});
				}else if(!user){
					// incorrect username
					
					 return res.json({"status":"fail","message":"Incorrect Email or Password !!!"});
				}else{
					// User has authenticated OK
					
					 return res.json({"status":"pass","user":user});
				}
			});
		});
		
		
		// getting order list
		app.get('/order/orderList', function(req, res) {
			
			    var db = req.db;
			    db.collection('order').find().toArray(function (err, items) {
			        res.json(items);
			    });
		});
	    
};
	    
	    