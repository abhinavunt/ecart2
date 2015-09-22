// app/routes.js

	module.exports = function(app) {

		// getting menu items list
		app.get('/menu/menulist', function(req, res) {
			
			var db = req.db;
			db.collection('menu').find({}, {"sort" : [['datetime', 1]]} ).toArray(function (err, items) {
				if(err) throw err;
				else{
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
					
				}
			});
		});
		
		
		// getting users list
		app.get('/user/getUsers', function(req, res) {
			var db = req.db;
			var totalRecords;
			var firstDateVal = req.param("firstDate");
			var lastDateVal = req.param("lastDate");
			var limitVal = parseInt(req.param("limit"));
			var keyword = req.param("keyword");
			
			
			
			
			if(keyword.replace(/\s/g,"")==""|| typeof(keyword)=='undefined'){
				
				if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
					
					db.collection('user').count(function (err, count){
						if (err) throw err;
						else{
							 totalRecords = count;
							 db.collection('user').find({},{"sort" : [['createdAt',-1]]} ).limit(limitVal).toArray(function (err, users) {
								 if (err) throw err;
								 else res.json({users:users,totalRecords:totalRecords});
							 });
						 }
					});
				
				}else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
					// for next data
					db.collection('user').find({createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, users) {
						console.log(users);
						res.json({users:users});
					});
				
				}else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
					// for previous data
					db.collection('user').find({createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, users) {
						users.reverse();
						res.json({users:users});
					});
				}
				
			}else{
				
				
				if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
					var query = {$or:[{ fullName: new RegExp(keyword,'i')},{emailId : new RegExp(keyword,'i')},{mobileNo : new RegExp(keyword,'i')}]};
					db.collection('user').count(query,function (err, count){
						if (err) throw err;
						else{
							 totalRecords = count;
							 db.collection('user').find(query,{"sort" : [['createdAt',-1]]} ).limit(limitVal).toArray(function (err, users) {
								 if (err) throw err;
								 else res.json({users:users,totalRecords:totalRecords});
							 });
						 }
					});
				
				}else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
					// for next data
					var query = {$or:[{ fullName: new RegExp(keyword,'i')},{emailId : new RegExp(keyword,'i')},{mobileNo : new RegExp(keyword,'i')}],createdAt:{"$lt":new Date(lastDateVal)}};
				    db.collection('user').find({createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, users) {
						res.json({users:users});
					});
				
				}else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
					// for previous data
					var query = {$or:[{ fullName: new RegExp(keyword,'i')},{emailId : new RegExp(keyword,'i')},{mobileNo : new RegExp(keyword,'i')}],createdAt:{"$gt":new Date(firstDateVal)}};
					db.collection('user').find({createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, users) {
						users.reverse();
						res.json({users:users});
					});
				}
			
			}
		});
		
		// password recovery email validation
		app.post('/user/validateRegisteredEmail', function(req, res) {
			
			var db = req.db;
			var transporter = req.transporter;
			var ownerEmail = req.ownerEmail;
			
			db.collection('user').findOne({emailId: req.body.emailId},function(err, user) {
				if (err) { 
					// user not found 
					return res.json({"status":"fail","message":"Internal Error Occured!!!"});
					
				}else if(!user){
					// incorrect username
					return res.json({"status":"fail","message":"This Email Id is not Registered !!!"});
					
				}else{
					var tempPassword = makeTempPassword();
				    db.collection('user').update({emailId:req.body.emailId},{$set: {password:tempPassword}},function(err, records) {
						if (err) return res.json({"status":"fail","message":"Internal Error Occured!!! Please try after sometime !!!"});
						else{
							transporter.sendMail({
							    from: ownerEmail,
							    to: req.body.emailId,
							    subject: 'M.K. Ahmed - Password Recovery',
							    html:'Dear Customer,<div><br></div><div>Your Password has been Reset.&nbsp;</div><div><br></div><div>Temporary Password is : &nbsp;'+tempPassword+'</div><div><br></div><div>Thanks &amp; Regards,<br></div><div>MK Ahmed Retails</div>'
							}, function(err, response){
						          if(err)  return res.json({"status":"fail","message":"Internal Error Occured while sending email !!! Please try after sometime !!!"});
						          else return res.json({"status":"pass"});
						    });
							
						}
					});
				}
			});
		});
		
		
		// change user password 
		app.post('/user/changeUserPassword', function(req, res) {
			
			var db = req.db;
			db.collection('user').findOne({emailId: req.body.emailId},function(err, user) {
				
				if(user.password==req.body.tempPswd){
					
					 db.collection('user').update({emailId:req.body.emailId},{$set: {password:req.body.newPswd}},function(err, records) {
							if (err) return res.json({"status":"fail","message":"Internal Error Occured!!! Please try after sometime !!!"});
							else{
								return res.json({"status":"pass"});
							}
						});
					
				}else{
					return res.json({"status":"fail","message":"Incorrect Temporary Password !!!"});
				}
			});
		});
		
		
		
		
		// getting users list
		app.get('/admin/getFeedbacks', function(req, res) {
			var db = req.db;
			var totalRecords;
			var firstDateVal = req.param("firstDate");
			var lastDateVal = req.param("lastDate");
			var limitVal = parseInt(req.param("limit"));
			
			if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
				
				db.collection('feedback').count(function (err, count){
					if (err) throw err;
					else{
						 totalRecords = count;
						 console.log(count);
						 db.collection('feedback').find({},{"sort" : [['createdAt',-1]]}).limit(limitVal).toArray(function (err, feedbacks) {
							 if (err) throw err;
							 else res.json({feedbacks:feedbacks, totalRecords:totalRecords});
						 });
					 }
				});
			
			}else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
				// for next data
				var query = {$or:[{ fullName: new RegExp(keyword,'i')},{emailId : new RegExp(keyword,'i')},{mobileNo : new RegExp(keyword,'i')}],createdAt:{"$lt":new Date(lastDateVal)}};
			    db.collection('user').find({createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, users) {
					res.json({users:users});
				});
			
			}else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
				// for previous data
				var query = {$or:[{ fullName: new RegExp(keyword,'i')},{emailId : new RegExp(keyword,'i')},{mobileNo : new RegExp(keyword,'i')}],createdAt:{"$gt":new Date(firstDateVal)}};
				db.collection('user').find({createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, users) {
					users.reverse();
					res.json({users:users});
				});
			}
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
			
			
			db.collection('user').findOne({emailId: req.body.emailId}, function(err, user) {
				  if (err) {
					  return res.json({"status":"failed","message":"Internal Error Occured. Please try after sometime !!!"});
				  }else if(user){
					  return res.json({"status":"failed","message":"This Email Id already exists. Please use some other Email Id !!!"});
				  }else{
					//insert record
						db.collection('user').insert(userInfo, function(err, records) {
							if (err){
								return res.json({"status":"failed","message":"Internal Error Occured. Please try after sometime !!!"});	
							}else{
								return res.json({"status":"success","role":"customer","user":records[0]});
							}
							
						});  
				  }});
		});
		
		//Edit User
		app.post('/user/editUser', function(req, res) {
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			
			var userInfo = {
					
					fullName : req.body.fullName,
					emailId : req.body.emailId,
					password : req.body.password,
					mobileNo : req.body.mobileNo,
					alternateNo : req.body.alternateNo,
					address : req.body.address
			 };
			
			db.collection('user').update({_id: ObjectID(req.body._id)},userInfo, function(err) {
				if (err) res.json({"status":"failed","message":"Internal error occured !!! Please try after sometime "});
				//if (err) throw err;
				else res.json({"status":"sucess","user":userInfo});
			});
			
		});
		
		//login user
		app.post('/user/login', function(req, res) {
			var db = req.db;
			var adminKey = req.adminKey;
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
					if(user.role=="administrator") return res.json({"status":"pass","role":"admin","key":adminKey, "user":user});
					else return res.json({"status":"pass","role":"customer","key":"cust","user":user});
				}
			});
		});
		
		app.post('/user/adminValidation',function(req,res){
			var adminKey = req.adminKey;
			var testKey = req.body.key;
			if(testKey==adminKey) res.json({"authResult":"pass"});
			else res.json({"authResult":"fail"});
		});
		
		
		app.get('/user/orderHistory',function(req,res){
			
			var db = req.db;
			var emailIdVal = req.param("emailId");
			var totalRecords;
			var firstDateVal = req.param("firstDate");
			var lastDateVal = req.param("lastDate");
			var limitVal = parseInt(req.param("limit"));
			
			if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
				
				db.collection('order').count({emailId:emailIdVal},function (err, count){
					if (err) throw err;
					else{
						 totalRecords = count;
						 db.collection('order').find({emailId:emailIdVal},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
							 if (err) throw err;
							 else res.json({items:items,totalRecords:totalRecords});
						 });
					}
				});
			
			}else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
				
				db.collection('order').find({emailId:emailIdVal, date:{"$lt":new Date(lastDateVal)}},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
					res.json({items:items});
			    });

			}else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
				
				db.collection('order').find({emailId:emailIdVal, date:{"$gt":new Date(firstDateVal)}},{"sort" : [['date', 1]]}).limit(limitVal).toArray(function (err, items) {
		    		items.reverse();   
		    		res.json({items:items});
		    	});
			}
			
		});
		
		
		app.post('/user/userFeedback',function(req,res){
			
			var db = req.db;
			var feedbackObject = {
					
					fullName : req.body.fullName,
					emailId : req.body.emailId,
					createdAt: new Date(),
					message : req.body.message
			};
			
			//insert feedback
			db.collection('feedback').insert(feedbackObject, function(err, records) {
				if(err) res.json({status:'fail', message:'Due to server error your feedback could not be submitted !!! please try after sometime..'});
				else res.json({"status":"pass"});
			});
		});
		
		
		//Add menu Item at Level-0
		app.post('/menu/addMenuItemLevelZero', function(req, res) {
			var db = req.db;
			
			var insertMenuItemLevelZero = {
					name : req.body.name,
					datetime : new Date(),
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
		
		//Edit menu Item at All levels
		app.post('/menu/editMenuItem', function(req, res) {
			
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			var menuLevel = req.body.menuLevel;
			
			if(menuLevel=='levelZero'){
				db.collection('menu').update({_id:ObjectID(req.body.levelZeroId)},{$set: {name:req.body.name}},function(err, records) {
					if (err) throw err;
					else{
						res.json({_id:req.body.levelZeroId,name:req.body.name});
					}
				});		
			
			}else if(menuLevel=='levelOne'){
				
				
				db.collection('menu').update({_id:ObjectID(req.body.levelZeroId),'sub._id':ObjectID(req.body.levelOneId)},{$set:{'sub.$.name':req.body.name}},function(err,records){
					if (err) throw err;
					else{
						db.collection('submenu').update({_id:ObjectID(req.body.levelOneId)},{$set: {name:req.body.name}},function(err, records) {
							if (err) throw err;
							else{
								res.json({_id:req.body.levelOneId,name:req.body.name});
							}
						});	
					}
				});
				
				
			}else if(menuLevel=='levelTwo'){
				
				db.collection('submenu').update({_id:ObjectID(req.body.levelOneId),'supersub._id':ObjectID(req.body.levelTwoId)},{$set:{'supersub.$.name':req.body.name}},function(err,records){
					if (err) throw err;
					else{
						res.json({_id:req.body.levelTwoId, name:req.body.name});
					}
				});
				
			}
			
		});
		
		
		
		//Remove menu Item at All levels
		app.post('/menu/removeMenuItem', function(req, res) {
			
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			var menuLevel = req.body.menuLevel;
			
			if(menuLevel=='levelZero'){
				
				var subMenuIdsObject=[];
				for(var i=0;i<req.body.subMenuIds.length;i++){
					subMenuIdsObject.push(ObjectID(req.body.subMenuIds[i]));
				}
				
				db.collection('menu').removeById(req.body.levelZeroId,function(err,records) {
				  if(err) throw err;
			      else{
			    	  db.collection('submenu').remove({_id:{$in:subMenuIdsObject}},function(err,records) {
					  if(err) throw err;
				      else{
				    	  	res.json({_id:req.body.levelZeroId});
				      	  }
			    	  });
			       }
			    });
			
			}else if(menuLevel=='levelOne'){
				
				db.collection('menu').update({_id:ObjectID(req.body.levelZeroId)},{$pull:{'sub' : {_id : ObjectID(req.body.levelOneId)}}},function(err,records){
					if (err) throw err;
					else{
						db.collection('submenu').remove({_id:ObjectID(req.body.levelOneId)},function(err,records) {
						if(err) throw err;
						else{
								res.json({_id:req.body.levelOneId});
							}
						});
					}
				});
				
				
		    }else if(menuLevel=='levelTwo'){
				
		    	db.collection('submenu').update({_id:ObjectID(req.body.levelOneId)},{$pull:{'supersub' : {_id : ObjectID(req.body.levelTwoId)}}},function(err,records){
					if (err) throw err;
					else{
						res.json({_id:req.body.levelTwoId});
					}
				});
			}
		 });
		
		
		// getting order list
		app.get('/item/searchItems', function(req, res) {
			
			    var db = req.db;
			    var mongo = req.mongo;
				var ObjectID = mongo.ObjectID;
			    var limitVal = parseInt(req.param("limit"));
			    var firstDateVal = req.param("firstDate");
			    var lastDateVal = req.param("lastDate");
			    var searchCriteriaVal = req.param("searchCriteriaVal");
				var searchMenuId = req.param("searchMenuId");
				var totalRecords;
				
				//search for All Items
			    if(searchCriteriaVal==1){
			    	
			    	if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
				    	db.collection('item').count({categoryTwoId: ObjectID(searchMenuId)},function (err, count){
					    	if (err) throw err;
					    	else{
					    		 totalRecords = count;
					    		 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId)},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
					    			 res.json({items:items,totalRecords:totalRecords});
								 });
					    	}
					    });
				     }else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
				    	// for getting Next data
				    	
				    	db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
					        res.json({items:items});
				    	});
				    	
				     }else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
				    	// for getting Previous data
				    	 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId), createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, items) {
					    		items.reverse();
					    		res.json({items:items});
					     });
				     }
			    	
				    }else if(searchCriteriaVal==2){
				    	
				    	if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
					    	db.collection('item').count({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"yes"},function (err, count){
						    	if (err) throw err;
						    	else{
						    		 totalRecords = count;
						    		 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"yes"},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
						    			 res.json({items:items,totalRecords:totalRecords});
									 });
						    	}
						    });
					     }else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
					    	// for getting Next data
					    	
					    	db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"yes",createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
						        res.json({items:items});
					    	});
					    	
					     }else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
					    	// for getting Previous data
					    	 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"yes",createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, items) {
						    		items.reverse();
						    		res.json({items:items});
						     });
					     }
				    	
				    }else if(searchCriteriaVal==3){
				    	
				    	if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
					    	db.collection('item').count({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"no"},function (err, count){
						    	if (err) throw err;
						    	else{
						    		 totalRecords = count;
						    		 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"no"},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
						    			 res.json({items:items,totalRecords:totalRecords});
									 });
						    	}
						    });
					     }else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
					    	// for getting Next data
					    	
					    	db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"no",createdAt:{"$lt":new Date(lastDateVal)}},{"sort" : [['createdAt', -1]]}).limit(limitVal).toArray(function (err, items) {
						        res.json({items:items});
					    	});
					    	
					     }else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
					    	// for getting Previous data
					    	 db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),isOfferCheck:"no",createdAt:{"$gt":new Date(firstDateVal)}},{"sort" : [['createdAt', 1]]}).limit(limitVal).toArray(function (err, items) {
						    		items.reverse();
						    		res.json({items:items});
						     });
					     }
				    	
				    }
		});
		
		// search item by keyword
		app.post('/item/searchItemByKeyword', function(req, res) {
			var db = req.db;
			var totalRecords;
			var firstDateVal = req.param("firstDate");
		    var lastDateVal = req.param("lastDate");
		    var limit = parseInt(req.param("limit"));
			
			if(firstDateVal=="notAssigned" && lastDateVal=="notAssigned"){
				console.log("Inside keyword both notAssigned");
				var query = {$or:[{ name: new RegExp(req.param("keyWord"),'i')},{othernames : new RegExp(req.param("keyWord"),'i')},{brand : new RegExp(req.param("keyWord"),'i')}]};
				db.collection('item').count(query,function (err, count){
			    	if (err) throw err;
			    	else{
			    		 totalRecords = count;
			    		 db.collection('item').find(query,{"sort" : [['createdAt', -1]]}).limit(limit).toArray(function (err, items) {
			    			 res.json({items:items,totalRecords:totalRecords});
						 });
			    	}
			    });
				
			}else if(firstDateVal=="notAssigned" && lastDateVal!="notAssigned"){
				console.log("Inside keyword next");
				var query = {$or:[{ name: new RegExp(req.param("keyWord"),'i')},{othernames : new RegExp(req.param("keyWord"),'i')},{brand : new RegExp(req.param("keyWord"),'i')}],createdAt:{"$lt":new Date(lastDateVal)}};
				db.collection('item').find(query,{"sort" : [['createdAt', -1]]}).limit(limit).toArray(function (err, items) {
	    			 res.json({items:items});
				 });
				
			}else if(firstDateVal!="notAssigned" && lastDateVal=="notAssigned"){
				console.log("Inside keyword previous");
				var query = {$or:[{ name: new RegExp(req.param("keyWord"),'i')},{othernames : new RegExp(req.param("keyWord"),'i')},{brand : new RegExp(req.param("keyWord"),'i')}],createdAt:{"$gt":new Date(firstDateVal)}};
				db.collection('item').find(query,{"sort" : [['createdAt', -1]]}).limit(limit).toArray(function (err, items) {
	    			 res.json({items:items,totalRecords:totalRecords});
				 });
				
			}
			
		});
		
	    app.get('/item/searchItemsDisplay', function(req, res) {
			
		    var db = req.db;
		    var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			
			var searchMenuId = req.param("category");
			
			if(req.param("catLevel")==1){
				
				if(req.param("lastItemDate")=="notAssigned"){
					
					db.collection('item').count({categoryOneId: ObjectID(searchMenuId)},function (err, count){
						if (err) throw err;
						else{
							
							db.collection('item').find({categoryOneId: ObjectID(searchMenuId)},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limit"))).toArray(function (err, items) {
								 if (err) throw err;
								 else res.json({items:items,itemCount:count});
							});
						}
					});
					
				}else{
					
					db.collection('item').find({categoryOneId: ObjectID(searchMenuId),createdAt:{"$lt":new Date(req.param("lastItemDate"))}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limit"))).toArray(function (err, items) {
						 if (err) throw err;
						 else res.json({items:items});
					});
				}
				
			}else{
				
				if(req.param("lastItemDate")=="notAssigned"){
					
					db.collection('item').count({categoryTwoId: ObjectID(searchMenuId)},function (err, count){
						if (err) throw err.code;
						else{
							
							db.collection('item').find({categoryTwoId: ObjectID(searchMenuId)},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limit"))).toArray(function (err, items) {
								 if (err) throw err;
								 else res.json({items:items,itemCount:count});
							});
						}
					});
				}else{
					
					db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),createdAt:{"$lt":new Date(req.param("lastItemDate"))}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limit"))).toArray(function (err, items) {
						 if (err) throw err;
						 else res.json({items:items});
					});
				}	
			}
			
			
		});
		
		// Search Latest Items
		app.get('/item/getLatestItems', function(req, res) {
			
			var db = req.db;
			if(req.param("lastLatestItemDate")=="notAssigned"){
				
				db.collection('item').find({isOfferCheck:"no"},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, latestItems) {
					   if(err) throw err;
					   else res.json({"latestItems":latestItems});
				});	
			}else{
				
				db.collection('item').find({createdAt:{"$lt":new Date(req.param("lastLatestItemDate"))},isOfferCheck:"no"},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, latestItems) {
					if(err) throw err;
					else res.json({"latestItems":latestItems});
		    	});
			}
			
		});
		
		// Search Offer Items
		app.get('/item/getOfferItems', function(req, res) {
			
			var db = req.db;
			if(req.param("lastOfferItemDate")=="notAssigned"){
				
				db.collection('item').find({isOfferCheck:"yes"},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, offerItems) {
					   if(err) throw err;
					   else res.json({"offerItems":offerItems});
				});	
			}else{
				
				db.collection('item').find({createdAt:{"$lt":new Date(req.param("lastOfferItemDate"))},isOfferCheck:"yes"},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, offerItems) {
					if(err) throw err;
					else res.json({"offerItems":offerItems});
		    	});
			}
			
		});
		
		
		
		// Search Brands
		app.get('/item/searchBrands', function(req, res) {
			
			var category = req.param("category");
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			
			if(req.param("catLevel")==1){
				db.collection('item').find({categoryOneId: ObjectID(category)}).toArray(function (err, items) {
				       res.json(items);
				});
				
			}else{
				
				db.collection('item').find({categoryTwoId: ObjectID(category)}).toArray(function (err, items) {
				       res.json(items);
				});
			}
			
			
			
			
		});
		
		// Search Items by Brand
		app.post('/item/searchItemsByBrand', function(req, res) {
			
			
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			
			if(req.body.catLevel =="1"){
				if(req.body.lastItemDateByBrand =="notAssigned"){
					
					db.collection('item').count({categoryOneId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}},function (err, count){
						if (err) throw err;
						else{
							
							db.collection('item').find({categoryOneId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.body.limit)).toArray(function (err, items) {
								 if (err) throw err;
								 else res.json({items:items,itemCount:count});
							});
						}
					});
				}else{
					
					db.collection('item').find({categoryOneId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}, createdAt:{"$lt":new Date(req.body.lastItemDateByBrand)}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.body.limit)).toArray(function (err, items) {
						 if (err) throw err;
						 else res.json({items:items});
					});
				}
			
			}else{
			
				if(req.body.lastItemDateByBrand =="notAssigned"){
					
					db.collection('item').count({categoryTwoId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}},function (err, count){
						if (err) throw err;
						else{
							
							db.collection('item').find({categoryTwoId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.body.limit)).toArray(function (err, items) {
								 if (err) throw err;
								 else res.json({items:items,itemCount:count});
							});
						}
					});
				}else{
					
					db.collection('item').find({categoryTwoId: ObjectID(req.body.categoryId),brand:{$in:req.body.category}, createdAt:{"$lt":new Date(req.body.lastItemDateByBrand)}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.body.limit)).toArray(function (err, items) {
						 if (err) throw err;
						 else res.json({items:items});
					});
				}
				
			}
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
					
					categoryZeroId : ObjectID(req.body.categoryZeroId),
  	    			categoryOneId : ObjectID(req.body.categoryOneId),
  	    			categoryTwoId : ObjectID(req.body.categoryTwoId),
  	    			createdAt : new Date(),
					name : req.body.name,
					brand : req.body.brand,
					othernames : req.body.othernames,
					description : req.body.description,
					availability : req.body.availability,
					isOfferCheck : req.body.isOfferCheck,
					imageId : req.body.imageId,
					amountprice : amtPriceObj
			};
			
			//insert record
			db.collection('item').insert(itemInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]);
				res.json({"item":records[0]});
			});
		});
		
		//Edit Item
		app.post('/item/editItem', function(req, res) {
			
			var db = req.db;
			var fs = req.fs;
			var mongo = req.mongo;
			var amtPriceObj = req.body.amountprice;
			var ObjectID = mongo.ObjectID;
			amtPriceObj.forEach (function (e){
			   e.productId = new ObjectID();
			});
			
			var itemInfo = {
					
					categoryZeroId : ObjectID(req.body.categoryZeroId),
  	    			categoryOneId : ObjectID(req.body.categoryOneId),
  	    			categoryTwoId : ObjectID(req.body.categoryTwoId),
  	    			createdAt: new Date(req.body.createdAt),
					name : req.body.name,
					brand : req.body.brand,
					othernames : req.body.othernames,
					description : req.body.description,
					availability : req.body.availability,
					isOfferCheck: req.body.isOfferCheck,
					imageId : req.body.imageId,
					amountprice : amtPriceObj,
			};
			
			//edit record
			db.collection('item').update({_id: ObjectID(req.body.itemId)},itemInfo, function(err) {
				if (err) throw err;
				else {
					if(req.body.oldImageId=="NoOldImage"){
						itemInfo["_id"] = req.body.itemId;
						res.json({"itemObj":itemInfo});
					}else{
						var filePath = 'public/temp_upload/'+req.body.oldImageId;
						fs.unlinkSync(filePath);
						itemInfo["_id"] = req.body.itemId;
						res.json({"itemObj":itemInfo});
					}
					
				}
			});
		});
		
		//Remove Item
		app.post('/item/removeItem', function(req, res) {
			
			var db = req.db;
			var fs = req.fs;
			
			db.collection('item').removeById(req.body.itemId,function(err,records) {
				if(err) throw err;
		      else {
		    	  var filePath = 'public/temp_upload/'+req.body.imageId;
				  fs.unlinkSync(filePath);
		    	  res.json({"out":"removed"});
		      }
		   });
		});
		
		//Item from same Category
		app.get('/item/itemFromSameCategory',function(req,res){
			var db = req.db;
		    var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			var searchMenuId = req.param("category");
			var excludeItemId = req.param("excludeItemId");
			
			if(req.param("lastSameCatItemDate")=="notAssigned"){
				
				db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),_id: {'$ne':ObjectID(excludeItemId) }},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, itemSameCat) {
					   if(err) throw err;
					   else res.json({"itemSameCat":itemSameCat});
				});	
			}else{
				
				db.collection('item').find({categoryTwoId: ObjectID(searchMenuId),_id: {'$ne':ObjectID(excludeItemId)},createdAt:{"$lt":new Date(req.param("lastSameCatItemDate"))}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, itemSameCat) {
					   if(err) throw err;
					   else res.json({"itemSameCat":itemSameCat});
				});	
			}
		});
		
		//Item from same Brand
		app.get('/item/itemFromSameBrand',function(req,res){
			var db = req.db;
		    var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			
			var excludeItemId = req.param("excludeItemId");
			
			if(req.param("lastSameBrdItemDate")=="notAssigned"){
				
				db.collection('item').find({brand: req.param("brand"),_id: {'$ne':ObjectID(excludeItemId) }},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, itemSameBrd) {
					   if(err) throw err;
					   else res.json({"itemSameBrd":itemSameBrd});
				});	
			}else{
				
				db.collection('item').find({brand: req.param("brand"),_id: {'$ne':ObjectID(excludeItemId)},createdAt:{"$lt":new Date(req.param("lastSameBrdItemDate"))}},{"sort" : [['createdAt', -1]]}).limit(parseInt(req.param("limitPerSlide"))).toArray(function (err, itemSameBrd) {
					   if(err) throw err;
					   else res.json({"itemSameBrd":itemSameBrd});
				});	
			}
		});
		
		app.post('/item/addImage', function(req, res) {
		   var cloudinary = req.cloudinary;
		   var fs = req.fs;
		   var filePath = 'public/temp_upload/'+req.files.file.name;
		   
		   cloudinary.uploader.upload(filePath, function(result) { 
			   
			   fs.unlinkSync(filePath);
			   console.log(result);
			   var finalJson = {ImgId:result.public_id+'.jpg'};
			   res.json(finalJson);
		   });
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
					date : new Date(),
					grandTotal:req.body.grandTotal,
					status:1,
					statusClass:"danger",
					order: req.body.order
					
			};
			
			db.collection('order').insert(orderInfo, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
				res.json(records[0]._id);
				
			});
			
		});
		
		//change order status
		app.post('/order/saveOrderStatus', function(req, res) {
			var db = req.db;
			var mongo = req.mongo;
			var ObjectID = mongo.ObjectID;
			var statusClassVal;
			
			if(req.body.status==1) statusClassVal ="danger";
			else if(req.body.status==2) statusClassVal ="warning";
			else if(req.body.status==3) statusClassVal ="success";
			
			db.collection('order').update({_id:ObjectID(req.body.orderId)},{$set: {status:req.body.status, statusClass:statusClassVal}},function(err, records) {
				if (err) throw err;
				else{
					res.json({changedStatus:req.body.status,changedStatusClass:statusClassVal});
				}
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
			
		function makeTempPassword(){
	        var password = "";
	        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	        for( var i=0; i < 7; i++ )
	        	password += possible.charAt(Math.floor(Math.random() * possible.length));
	        
	        return password;
	    };
			
		// getting order list
		app.get('/order/orderList', function(req, res) {
			
			    var db = req.db;
			    var limitVal = parseInt(req.param("limit"));
			    var firstDateVal = req.param("firstDate");
			    var lastDateVal = req.param("lastDate");
			    var searchCriteriaVal = req.param("searchCriteriaVal");
			    var totalRecords;
			    
			    if(req.param("searchCriteriaVal")==4){
			    	
			    	var firstDate = new Date(req.param("criteriaYear"),req.param("criteriaMonth")-1,1);
			    	var lastDate = new Date(req.param("criteriaYear"), req.param("criteriaMonth"), 1);
			    	
			    	if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
				    	db.collection('order').count({date:{$gte:firstDate,$lt:lastDate}},function (err, count){
					    	if (err) throw err;
					    	else{
					    		 totalRecords = count;
					    		 db.collection('order').find({date:{$gte:firstDate,$lt:lastDate}},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
								    
					    			 res.json({items:items,totalRecords:totalRecords});
								 });
					    	}
					    });
				     }else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
				    	// for getting Next data
				    	
				    	db.collection('order').find({date:{"$gte":firstDate, "$lt":new Date(lastDateVal)}},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
					        res.json({items:items});
				    	});
				    	
				     }else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
				    	// for getting Previous data
				    	 db.collection('order').find({date:{"$gt":new Date(firstDateVal),"$lt":lastDate}},{"sort" : [['date', 1]]}).limit(limitVal).toArray(function (err, items) {
					    		items.reverse();   
					    		res.json({items:items});
					     });
				     }
			    	
				    }else if(req.param("searchCriteriaVal")==1){
				    	var query = {$or:[{fullName: new RegExp(req.param("keyword"),'i')},{mobileNo : new RegExp(req.param("keyword"),'i')}]};
				    	if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
				    		db.collection('order').count(query,function (err, count){
						    	if (err) throw err;
						    	else{
						    		 totalRecords = count;
						    		 db.collection('order').find(query,{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
									    res.json({items:items,totalRecords:totalRecords});
									 });
						    	}
						    });
				    	}else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
				    		var queryNext = {$and:[query,{date:{"$lt":new Date(lastDateVal)}}]};
				    		db.collection('order').find(queryNext,{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
						       res.json({items:items});
					    	});
				    		
				    		
				    	}else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
				    		var queryPrev = {$and:[query,{date:{"$gt":new Date(firstDateVal)}}]};
				    		db.collection('order').find(queryPrev,{"sort" : [['date', 1]]}).limit(limitVal).toArray(function (err, items) {
				    			items.reverse();
				    			res.json({items:items});
					    	});
				    	}
				    	
				    	
				    	
				    }else{
				    	var d = new Date();
					    d.setDate(d.getDate()-(searchCriteriaVal-1));
					    
					    if(firstDateVal=='notAssigned'&& lastDateVal=='notAssigned'){
					    	db.collection('order').count({date:{$gte: d}},function (err, count){
						    	if (err) throw err;
						    	else{
						    		 totalRecords = count;
						    		 db.collection('order').find({date:{$gte: d}},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
									        res.json({items:items,totalRecords:totalRecords});
									 });
						    	}
						    });
					    	
					    }else if(firstDateVal=='notAssigned'&& lastDateVal!='notAssigned'){
					    	// for getting Next data
					    	
					    	db.collection('order').find({date:{"$gte":d, "$lt":new Date(lastDateVal)}},{"sort" : [['date', -1]]}).limit(limitVal).toArray(function (err, items) {
						        res.json({items:items});
					    	});
					    	
					    }else if(firstDateVal!='notAssigned'&& lastDateVal=='notAssigned'){
					    	// for getting Previous data
					    	db.collection('order').find({date:{"$gt":new Date(firstDateVal)}},{"sort" : [['date', 1]]}).limit(limitVal).toArray(function (err, items) {
					    		items.reverse();   
					    		res.json({items:items});
					    	});
					     }
				    }
		});
		
		
		// live item search
		app.post('/item/liveSearch', function(req, res) {
			var db = req.db;
			var query = {$or:[{ name: new RegExp(req.body.keyWord,'i')},{othernames : new RegExp(req.body.keyWord,'i')},{brand : new RegExp(req.body.keyWord,'i')}]};
			  
			db.collection('item').find(query).toArray(function (err, items) {
		        res.json(items);
		    });
			
		});
		
		// get admin chart
		app.get('/order/getChart', function(req, res) {
			var db = req.db;
			var year = req.param("year");
			var start = new Date(year,1,1);
			var end = new Date(year,12,31);
			var userType = req.param("userType");
			
			if(userType=="admin"){
				
				db.collection('order').aggregate([{ $match : {'date':{$gte: start, $lt: end}}},{'$group': {_id: {month: {'$month': '$date'}},total : {$sum : '$grandTotal'},count:{$sum:1}}}],function(err, months) {
					if (err) throw err;
					else res.json(months);
				});
				
			}else if(userType=="customer"){
				
				db.collection('order').aggregate([{ $match : {'date':{$gte: start, $lt: end},emailId:req.param("emailId")}},{'$group': {_id: {month: {'$month': '$date'}},total : {$sum : '$grandTotal'},count:{$sum:1}}}],function(err, months) {
					if (err) throw err;
					else res.json(months);
				});
			}
			 
		});
		
		//default html 
		app.get('*', function(req, res) {
			res.sendfile('./public/views/indexNew.html'); // load our public/index.html file
		});
};
