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
				else res.json(records[0]);
				//console.log("Record added as "+records[0]._id);
			});
			
		});
		
		//Add menu Item at Level-1
		app.post('/menu/addMenuItemLevelOne', function(req, res) {
			var db = req.db;
			var mongo = req.mongo;
			var levelZeroId = req.body.levelZeroId;
			var nameVal = req.body.name;
			var ObjectID = mongo.ObjectID;
			var levelOneObjectId = new ObjectID();
			
			db.collection('menu').update({_id:ObjectID(req.body.levelZeroId)},{ $addToSet: {sub:{_id:levelOneObjectId, name : nameVal}}},function(err, records) {
				if (err) throw err;
				else{
					db.collection('submenu').insert({_id:levelOneObjectId, name:nameVal,supersub:[]},function(err2,records){
						if (err2) throw err2;
						else{
							res.json(records[0]);
						}
					});
				}
			});
			
		});
		
		
		//Add menu Item at Level-2
		app.post('/menu/addMenuItemLevelTwo', function(req, res) {
			
			var db = req.db;
			var mongo = req.mongo;
			var levelOneId = req.body.levelOneId;
			var nameVal = req.body.name;
			var ObjectID = mongo.ObjectID;
			var levelTwoObjectId = new ObjectID();
			var returnObject = {_id:levelTwoObjectId,name:nameVal};
			
			db.collection('submenu').update({_id:ObjectID(req.body.levelOneId)},{ $addToSet: {supersub:{_id:levelTwoObjectId, name : nameVal}}},function(err, records) {
				if (err) throw err;
				else{
					res.json(returnObject);
				}
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
					availability : req.body.availability,
					imageId : req.body.imageId,
					amountprice : amtPriceObj
			};
			
			//insert record
			db.collection('item').insert(itemInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
				res.json(records[0]._id);
			});
		});
		
		//Edit Item
		app.post('/item/editItem', function(req, res) {
			
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
					availability : req.body.availability,
					imageId : req.body.imageId,
					amountprice : amtPriceObj
			};
			
			//edit record
			db.collection('item').update({_id: ObjectID(req.body.itemId)},itemInfo, function(err) {
				if (err) throw err;
				else res.json({"out":"sucess"});
			});
		});
		
		//Remove Item
		app.post('/item/removeItem', function(req, res) {
			
			var db = req.db;
			//console.log(req.body.itemId);
			/*var id ={_id: toObjectID(req.body.itemId)};
			console.log(id);*/
			db.collection('item').removeById(req.body.itemId,function(err,records) {
				if(err) throw err;
		      else res.json({"out":"removed"});
		   });
		});
		
		app.post('/item/addImage', function(req, res) {
		   
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
		
		
		// live item search
		app.post('/item/liveSearch', function(req, res) {
			var db = req.db;
			var query = {$or:[{ name: new RegExp(req.body.keyWord,'i')},{othernames : new RegExp(req.body.keyWord,'i')}]};
			  
			db.collection('item').find(query).toArray(function (err, items) {
		        res.json(items);
		    });
			
		});
		
		//default html 
		app.get('/', function(req, res) {
			res.sendfile('./public/views/index.html'); // load our public/index.html file
		});
};