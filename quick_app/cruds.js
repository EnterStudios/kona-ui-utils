/*
CRUD functions for general objects array
to use, backend needs: 
----------------------

get all:
GET <url>
response: json objects array
* if window.window.editID - will open edit box

create:
POST <url>
Body: json object
response: json object with new id
                   
update:
PUT <url>/<id>
Body: json object
response: json object

delete:
DEL <url>/<id>
response: any response

*/

(function(){
  "use strict";

	angular.module("cruds",[])
	.service('crud', ["$http", "$timeout",function($http, $timeout){
		var that= {
			
			getAll: function(scope, url){
				//populate query.dataArray
				
			    $http.get(url).
			      success(function(data) {
			        scope.query.dataArray = scope.query.root(data);
			        scope.query.loading = false;
			        $timeout(function(){
			        	scope.$apply();

			        	if(window.editID){    
					      var obj = scope.query.dataArray.filter(function(cell){
					        return cell.id==window.editID;
					      })[0];
					      scope.edit(obj);
					      window.editID = null;
					    }

					    if(undefined != scope.getAllCB){
					    	scope.getAllCB();
					    }

			        },0);
			    });
			},

			add: function(params){
				//add object to query.dataArray
				params.scope.edited = {};
				params.scope.newObject=true;
				that.addEdit(params);
			},

			edit: function(params){
				//edit object in query.dataArray
				params.scope.newObject=false;
				that.addEdit(params);
			},

			addEdit: function(params){
				//private func: add / edit object in query.dataArray

				params.scope.edited = {};
				for(var i in params.edited){
					params.scope.edited[i] = params.edited[i];
				}
				

				that.dialogID = params.scope.query.title+"_edited";
				
				dialog({
				    title: (params.scope.newObject ? 'Add ' : 'Edit ') + params.scope.query.cells[0].title,
				    id: that.dialogID,
				    buttons: {
				        Save: function() {
				        	var valid = true;

				        	if(typeof params.scope.validate === "function"){
				        		if(!params.scope.validate()){
						        	valid = false;
						        }
				        	}else if(!that.validate(params)){
				        		valid = false;
				        	}

				        	if(!valid){
				        		return;
				        	}
				        	else if(typeof params.scope.addEdit === "function"){
				        		params.scope.addEdit(params); //should call crud.addEditCB(params);
				        	}
				        	else{
				        		that.addEditCB(params);
				        	}       	
				        }
				    }
				});

				$("#"+that.dialogID).find("input").eq(0).focus();
		    },

		    addEditCB: function(params){

		    	//private func. called by addEdit
			    $http({
			        method: params.scope.newObject? 'POST' : 'PUT',
			        url: params.url,
			        dataType: 'Json',
			        data: JSON.stringify(params.scope.edited)
			      }).success(function(response){

			      	//insert into dataArray
			      	if(params.scope.newObject){
			      		params.scope.query.dataArray.push(response);
			      	}else{
			      		var index = params.scope.query.dataArray.map(function(obj, ind) {
			              if(obj.id === params.scope.edited.id) {
			                return ind;
			              }
			          	}).filter(isFinite);
			          	params.scope.query.dataArray[index] = params.scope.edited;
			      	} 

			      	if(typeof params.scope.addEditCB === "function"){
			      		params.scope.addEditCB(response);
			      		$("#"+that.dialogID).dialog("close");
			      	}else{
				      	$("#"+that.dialogID).dialog("close");
				      	setTimeout(function(){
				      		params.scope.newObject=true;
				      		params.scope.edited = {};
				      	},700); //wait till dialog closes (so it wont change)
				    }
			        
			      }).error(function(e) {
			        error(e);
			      });
	        },

		    delete: function(params){
		    	//delete object from query.dataArray
				
				dialog({
					title: 'delete '+params.deleted.name+'?',
					message: params.message ? '<span class="error">'+params.message+'</span>' : '',
					buttons: {
					  Delete : function() {
					  	$http.delete(params.url).
						success(function() {

							//delete from dataArray
							params.scope.query.dataArray.map(function(obj, ind) {
					          if(obj.id === params.deleted.id) {
					            params.scope.query.dataArray.splice(ind,1);
					            return;
					          }
					      	}).filter(isFinite);

					      	params.scope.newObject=true;
			      			params.scope.edited = {};
						
						}).error(function(e) {
							error(e);
						});
						$(this).dialog("close");
					  }
					}
				});
			},

			validate: function(params){

				//simple validation
        		var valid=true, i, fields = $("#"+that.dialogID+" input, #"+that.dialogID+" select");
        		
        		$.each(fields, function(i, field){ // check empty fields

        			if(!$(field).val() && $(field).is(":visible") && !$(field).attr("allow_empty")){
        				error("Please fill all fields.")
	        			valid=false;
	        			$(field).addClass("error");
	        		}
        		});

        		if(params.scope.newObject){
        			var pass = $("#"+that.dialogID+" input[type='password']");
        			if(pass.length ==2 && pass.eq(0).val() != pass.eq(1).val()){
        				error("Password must match confirm.")
	        			valid=false;
	        			$(pass).addClass("error");
        			}
        		}

        		setTimeout(function(){
        			fields.removeClass("error");
        		},2000);

        		return valid;
			}
		};

		return that;

	}]);
})();