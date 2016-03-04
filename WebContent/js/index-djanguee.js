
var myDjangueeIds = [];
var uid = 0;
var ufname = '';
var usname = '';

var component_id = 0;


function getComponentId() {
	return component_id++;
}

function loadSelectionOption(selectComponentId, table) {
	$('#' + selectComponentId + '-panel-overlay').niftyOverlay().niftyOverlay('show');
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/genericTableQuery?data="+ table,
		  //data: { email: email, password: password, email_check_code: email_check_code, firstName:firstName},
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   var strOption = '';
			   for (var i=0; i< obj.data.length;i++) {
				   strOption += '<option value="' + obj.data[i].id + '">' + obj.data[i].name + '</option>';
			   }
			   $('#' + selectComponentId + '-panel-overlay').niftyOverlay().niftyOverlay('hide');
			   $( "#" +selectComponentId).empty();
			   $( "#" +selectComponentId).append(strOption).val(obj.data[0].id);
			   $('#' + selectComponentId + 'Panel .selectpicker').selectpicker('refresh');
			   //$('#' + selectComponentId + 'Panel .selectpicker').on('changed.bs.select', function (e, index,newVal, oldVal) {
				//	  alert(newVal);
				//});
		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  $('#' + selectComponentId + '-panel-overlay').niftyOverlay().niftyOverlay('hide');
	  });
}

/*
var myApp = angular.module('djanguee-app', ['ngRoute','ngResource']);

myApp.factory('GenericDataQuery', ['$log','dataSetName',
                                   function('$log', dataSetName) {

	  $log.log('dataSetName requested: ', dataSetName);
	  
	  $http.get("http://localhost:8888/services/genericTableQuery?data=rotation_init_type")
	    .then(function(response) {
	    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	    	$scope.d_rotation_type_list = response.data.data;
	    	
	    	$scope.typeSelectedOption = response.data.data[0];
	    	
	    	
	    }, function(response) {
	    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	        $scope.content = "Something went wrong";
	    });
});

myApp.controller('DjangueeCreationController', function($scope, $http) {
	$scope.d_rotation_type_list = [];
	$scope.d_type_list = [];
	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('show');
	$http.get("http://localhost:8888/services/genericTableQuery?data=rotation_init_type")
    .then(function(response) {
    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
    	$scope.d_rotation_type_list = response.data.data;
    	
    	$scope.typeSelectedOption = response.data.data[0];
    	
    	
    }, function(response) {
    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
        $scope.content = "Something went wrong";
    });
	
	
	//$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('show');
	$http.get("http://localhost:8888/services/genericTableQuery?data=djanguee_type")
    .then(function(response) {
    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
    	$scope.d_type_list = response.data.data;
    	
    	$scope.rotationSelectedOption = response.data.data[0];
    }, function(response) {
    	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
        $scope.content = "Something went wrong";
    });
});


*/

function build_message_request(request_tag) {
	if(request_tag=='JOIN_DJANGUEE') return ' would like you to join ';
	else return 'NO REQUEST';
}


function build_desc_info(info_tag){
	
	if(info_tag=='CREATION') return {buttonType:'bg-success',icon:'fa-users', message:' created a new group '};
	if(info_tag=='NEW_MEMBER') return {buttonType:'bg-success',icon:'fa-user-plus', message:' just joined the group '};
	else return {buttonType:'success',icon:'fa-users', message:' created a new group '};;
}

function show_djanguee_dashboard(){
	$('#djanguee-creation-panel').hide();
	$('#djanguee_infos').hide();
	for (var i=0; i<myDjangueeIds.length;i++) {
		$('#item_'  + myDjangueeIds[i].janguee_type + '_' +  myDjangueeIds[i].id).removeClass("active-link");
	}
	$('#djangue-creation-form-menu').removeClass("active-link");
	$('#djanguee-dashboard-menu').addClass("active-link");
	$('#site-dashboard').show();
	$('#member-profile-panel').hide();
	//djanguee-dashboard
}


function load_djanguee_infos(djanguee_id){
	//alert(djanguee_id);
	$('#site-dashboard').hide();
	var djanguee_name = '';
	var djanguee_icreator_id  = 0;
	$('#member-profile-panel').hide();
	$('#djanguee-creation-panel').hide();
	$('#djanguee_infos').show();
	
	$('#meetings-text-compose').summernote({
		height:300
	});
	
	for (var i=0; i<myDjangueeIds.length;i++) {
		$('#item_'  + myDjangueeIds[i].janguee_type + '_' +  myDjangueeIds[i].id).removeClass("active-link");
		$('#djangue-creation-form-menu').removeClass("active-link");
		$('#djanguee-dashboard-menu').removeClass("active-link");
		if(myDjangueeIds[i].id == djanguee_id ){
			$('#item_'  + myDjangueeIds[i].janguee_type + '_' +  djanguee_id).addClass("active-link");
			$('#djanguee-panel-title').empty();
			$('#djanguee-panel-title').append(myDjangueeIds[i].name);
			
			$('#members-details-text').empty();
			$('#members-details-text').append(myDjangueeIds[i].janguee_type + ', ' + ( myDjangueeIds[i].is_searchable == 0 ? 'Not searchable' : 'Searchable'));
			
			djanguee_icreator_id = myDjangueeIds[i].creator_id;
			load_djanguee_member_list(djanguee_id);
			load_chat_message_list(djanguee_id);
			djanguee_name = myDjangueeIds[i].name;
		}
	}
	
	reload_request_list(djanguee_id);
	reload_time_line(djanguee_id);
	
	$('#chat-messager-sender').off('click');
    $('#chat-messager-sender').on('click', function(){
	   send_chat_message(djanguee_id);
    });
	
	$('#add-member-to-djanguee').off('click');
	$('#add-member-to-djanguee').on('click', function(){
		
		var list_member_emails =  $('#add-member-to-djanguee-value').val();
		$('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('show');
		var args = {emails:list_member_emails, creator_id:djanguee_icreator_id};
		var jqxhr = $.ajax({
			  method: "GET",
			  url: "http://localhost:8888/services/add_djanguees_member?djanguee_id=" + djanguee_id,
			  data: args,
			  statusCode: {
				    404: function() {
				      alert( "page not found" );
				    }
			   },
			   success:function(data, textStatus,  jqXHR){
				   $('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('hide');
				   obj = JSON.parse(data);
				   if(obj.emails_status==0){
					   $.niftyNoty({
							type: 'danger',
							container : '#djanguee-member-list-panel',
							html : 'Sorry, to following emails do not exit: ' + obj.wrong_emails,
							focus: false,
							timer :  6000 
						});
				   }
				   else {
					   $.niftyNoty({
							type: 'success',
							icon : 'fa fa-thumbs-o-up',
							message : "<strong>Requests sent.</strong>",
							container : 'floating',
							timer : 3000
						});
				   }
			    }

			})
		  .done(function() {
		    //alert( "success" );
		  })
		  .fail(function() {
		    //alert( "error" );
		  })
		  .always(function() {
			  $('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('hide');
		  });
		
	});
	
}

function change_djanguee_request_status(request_id, type_status_request){
	
	var args = {request_id:request_id}
	
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/" + type_status_request,
		  data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   if(obj.request_status ==1){
				   $.niftyNoty({
						type: 'success',
						icon : 'fa fa-thumbs-o-up',
						message : "<strong>Your choise has been saved !</strong>",
						container : 'floating',
						timer : 3000
					});
				   reload_djanguees_list();
			   }
		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  //$('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('hide');
	});
}

function send_chat_message(djanguee_id){
	//uid
	var message= $("#chat-text-message").val(); 
	var strChatMessages = '';
	var compid =getComponentId();
   strChatMessages += '<li class="mar-btm">';
	   strChatMessages += '<div class="media-left">';
	   	strChatMessages += '<img src="WebContent/img/av1.png" class="img-circle img-sm" alt="Profile Picture">';
	   strChatMessages += '</div>';
	   strChatMessages += '<div class="media-body pad-hor">';
		   strChatMessages += '<div class="speech">';
			   strChatMessages += '<a href="#" class="media-heading">' + ufname  + ' ' + usname  +'</a>';
			   strChatMessages += '<p>' + message  +'</p>';
			   strChatMessages += '<p class="speech-time">';
			   strChatMessages += '<i class="fa fa-clock-o fa-fw"></i><span id="sending-' + compid + '">Sending...</span>';
			   strChatMessages += '</p>';
		   strChatMessages += '</div>';
	   strChatMessages += '</div>';
   strChatMessages += '</li>';
   $('#djanguee-message-list').append(strChatMessages);
   $("#chat-text-message").val('');
   var args = {djanguee_id:djanguee_id,message:message,member_id:uid};
	
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/send_chat_message",
		  data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   //$('#djanguee-chat-message-panel-overlay').niftyOverlay().niftyOverlay('hide');
			   obj = JSON.parse(data);
			   $("#sending-" + compid ).text('Just now')
		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  //$('#djanguee-chat-message-panel-overlay').niftyOverlay().niftyOverlay('hide');
	});
}


function load_chat_message_list(djanguee_id){
	$('#djanguee-chat-message-panel-overlay').niftyOverlay().niftyOverlay('show');
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/chat_message?djanguee_id=" + djanguee_id,
		  //data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   $('#djanguee-chat-message-panel-overlay').niftyOverlay().niftyOverlay('hide');
			   obj = JSON.parse(data);
			   var strChatMessages = '';
			   $('#djanguee-message-list').empty();
			   for (var i=0; i<obj.data.length;i++) {
				   
				   strChatMessages += '<li class="mar-btm">';
					   strChatMessages += '<div class="' + ( (obj.data[i].sender_id == uid) ? 'media-left':'media-right' ) + ' " >';
					   	strChatMessages += '<img src="WebContent/img/av1.png" class="img-circle img-sm" alt="Profile Picture">';
					   strChatMessages += '</div>';
					   strChatMessages += '<div class="media-body pad-hor ' + ( (obj.data[i].sender_id == uid) ? '':'speech-right' ) + '">';
						   strChatMessages += '<div class="speech">';
							   strChatMessages += '<a href="#" class="media-heading">' + obj.data[i].sender_name  +'</a>';
							   strChatMessages += '<p>' + obj.data[i].message  +'</p>';
							   strChatMessages += '<p class="speech-time">';
							   strChatMessages += '<i class="fa fa-clock-o fa-fw"></i>' + obj.data[i].create_date  +'';
							   strChatMessages += '</p>';
						   strChatMessages += '</div>';
					   strChatMessages += '</div>';
				   strChatMessages += '</li>';
				   
			   }
			   $('#djanguee-message-list').append(strChatMessages);
			   
			   
		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  $('#djanguee-chat-message-panel-overlay').niftyOverlay().niftyOverlay('hide');
	});
}

function load_djanguee_member_list(djanguee_id){
	$('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('show');
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/djanguees_member_list?djanguee_id=" + djanguee_id,
		  //data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   $('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('hide');
			   obj = JSON.parse(data);
			   var strListmember = '';
			   $('#djanguee-member-list-body').empty();
			   for (var i=0; i<obj.data.length;i++) {
				   type = obj.data[i].janguee_type;
				   strListmember += '<a class="list-group-item" href="#">' + obj.data[i].fname  +'</a>';
			   }
			   $('#djanguee-member-list-body').append(strListmember);
			   
			   $('#members-count-text').empty();
			   $('#members-count-text').append( '<small><span class="text-semibold" >' + obj.data.length + ' members, round</span> Alis turn</small>');
				
		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  $('#djanguee-member-list-panel-overlay').niftyOverlay().niftyOverlay('hide');
	});
	
}


function reviewInfoCreation() {
	$( "#djanguee-step-tab4").empty();
	$( "#djanguee-step-tab4").append('<h4>Thank you for using Djanguee for your group, please check the informations below</h4>'+
			'<h5>Name: <b>' + $("#djanguee-step-tab1 input[name='name']").val() + '</b></h5>'+
			'<h5>Number of people: <b>' +  $("#djanguee-step-tab1 input[name='memberCount']").val() + '</b></h5>'+
			'<h5>Type: <b>' + $("#cdjangueeType option:selected").text() + '</b></h5>'+
			'<h5>Rate: <b>' +  $("#djanguee-step-tab2 input[name='rate']").val() + '</b></h5>'+
			'<h5>Monthly payment: <b>' +  $("#djanguee-step-tab2 input[name='payment']").val() + '</b></h5>'+
			'<h5>Limit payment day: <b>' +  $("#djanguee-step-tab2 input[name='paymentday']").val() + '</b></h5>'+
			'<h5>Is searchable: <b>' + $("#cdjangueeIsSearchable option:selected").text() + '</b></h5>'+
			'<h5>Rotation: <b>' + $("#cdjangueeRotType option:selected").text() + '</b></h5>');
}

function show_member_profile() {
	$('#site-dashboard').hide();
	$('#djanguee_infos').hide();
	$('#djanguee-creation-panel').hide();
	$('#member-profile-panel').show();
}

function show_creation_form() {
	$('#site-dashboard').hide();
	//$('#djangue-creation-form').hide();
	$('#djanguee_infos').hide();
	$('#member-profile-panel').hide();
	
	$(".djanguee-modal-radio").niftyCheck();
	loadSelectionOption('cdjangueeType', 'djanguee_type');
	loadSelectionOption('cdjangueeRotType', 'rotation_init_type');

	$("#cdjangueeRotType").selectpicker()
	.change(function(e) {
	    //alert($("#cdjangueeRotType option:selected").text());
		if($("#cdjangueeRotType option:selected").text()!='RANDOM'){
			$("#cdjangueePosForm").show();
		}
		else {
			$("#cdjangueePosForm").hide();
		}
	}).end();
	
	for (var i=0; i<myDjangueeIds.length;i++) {
		$('#item_'  + myDjangueeIds[i].janguee_type + '_' +  myDjangueeIds[i].id).removeClass("active-link");
	}
	
	$('#djanguee-dashboard-menu').removeClass("active-link");
	//$('#site-dashboard').removeClass("active-link");
	$('#djangue-creation-form-menu').addClass("active-link");
	$('#djanguee-creation-panel').show();
}


function reload_time_line(djanguee_id) {
	
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/infos_list",
		  data: {djanguee_id:djanguee_id},
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   var type = '';
			   var strInfostable = '';
			   strInfostable += '<div class="timeline-header">';
			   strInfostable += '<div class="timeline-header-title bg-purple">Now</div>';
			   strInfostable += '</div>';
			   var id =0;
			   var info_desc = {};
			   
			   for (var i=0; i<obj.data.length;i++) {
				   
				   info_desc = build_desc_info(obj.data[i].info_type)
				   strInfostable += '<div class="timeline-entry">';
					   strInfostable += '<div class="timeline-stat">';
						   strInfostable += '<div class="timeline-icon ' + info_desc.buttonType + '"><i class="fa ' + info_desc.icon  + ' fa-lg"></i></div>'; //fa-user-plus fa-users
						   strInfostable += '<div class="timeline-time">' + obj.data[i].create_date + '</div>';
					   strInfostable += '</div>';
					   strInfostable += '<div class="timeline-label">';
					       strInfostable += '<p class="mar-no pad-btm"><a href="#" class="btn-link text-semibold">' + obj.data[i].fname  + '</a> '+ info_desc.message  + ' <a href="#" class="btn-link text-semibold">' + obj.data[i].djanguee_name + '</a></p>';
					       strInfostable += '<blockquote class="bq-sm bq-open">Welcome in djanguee.</blockquote>';
				       strInfostable += '</div>';
				   strInfostable += '</div>';
					   
				} 
			  
			   
			   $( "#timeline-djanguee-panel-body").empty();
			   $( "#timeline-djanguee-panel-body").append(strInfostable);
			   
			   

		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  //$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	  });
}

function reload_request_list(djanguee_to_select) {
	
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/request_list",
		  data: {djanguee_id:djanguee_to_select},
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   var strRequesttable = '';
			   var id =0;
			   if(obj.data.length>0) {
				   for (var i=0; i<obj.data.length;i++) {
						  strRequesttable += '<tr>';
							strRequesttable += '<td style="vertical-align:middle"><a href="" class="btn-link">' + obj.data[i].from_fname + '</a>' + build_message_request(obj.data[i].request_type) +'<a href="" class="btn-link">' + obj.data[i].djanguee_name + '</a></td>';
							strRequesttable += '<td class="djanguee-request">';
							strRequesttable += '<button id="reject-request-' + obj.data[i].id +'" class="btn btn-danger btn-icon btn-circle icon-lg fa fa-times add-tooltip" data-toggle="tooltip" data-original-title="Reject the request" ></button><span style="padding-left:10px"/><button id="accept-request-' + obj.data[i].id +'" class="btn btn-success btn-icon btn-circle icon-lg fa fa-thumbs-up add-tooltip" data-toggle="tooltip" data-original-title="Accept the request"  ></button>';
							strRequesttable += '</td>';
						  strRequesttable += '</tr>';
						  
						  
						  
						   
				    } 
			   }
			   else{
				   strRequesttable += '<tr>';
				   strRequesttable += '<td style="vertical-align:middle"><i>No pending request</i></td>';
				   strRequesttable += '</tr>';
			   }
			   
			   if(djanguee_to_select==undefined){
				   $( "#request-panel-body").empty();
				   $( "#request-panel-body").append(strRequesttable);
			   }
			   else {
				   $( "#request-djanguee-panel-body").empty();
				   $( "#request-djanguee-panel-body").append(strRequesttable);
			   }
			   $('[data-toggle="tooltip"]').tooltip();
			   
			   for (var i=0; i<obj.data.length;i++) {
				   var id = obj.data[i].id;
				   $('#reject-request-' + id).off('click');
				   $('#accept-request-' + id).off('click');
				  
				   $('#reject-request-' + id).on('click', function(){
					  change_djanguee_request_status(id, 'reject_request');
				   });
				  
				   if(obj.data[i].request_type = 'JOIN_DJANGUEE'){
					  
					  $('#accept-request-' + id).on('click', function(){
						  
						  change_djanguee_request_status(id, 'accept_join_request');
					  });
				   }
				   else {
					  
					  $('#accept-request-' + id).on('click', function(){
						  
						  change_djanguee_request_status(id, 'accept_request');
					  });
				   }
			   }

		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  //$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	  });
}




function reload_djanguees_list(djanguee_to_select) {
	
	//$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('show');
	
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/djanguees",
		  //data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   var strMenu = {};
			   myDjangueeIds = [];
			   var type = '';
			   var strDashboardtable = '';
			   var id =0;
			   uid = obj.uid;
			   ufname = obj.ufname;
			   usname = obj.usname;
			   $( "#djanguee-user-name").html(ufname);
			   for (var i=0; i<obj.data.length;i++) {
				   

				   
				   type = obj.data[i].janguee_type;
				   id =  obj.data[i].id;
				   if(strMenu[type]==undefined) strMenu[type] = '';
				   strMenu[type] += '<li id="item_'  + type + '_' +  obj.data[i].id +'">   ';
				   strMenu[type] += '<a href="#" onclick="load_djanguee_infos(' + id+ ')" id="djanguee_'  + type + '_' +  obj.data[i].id +'" ><i class="fa fa-home"></i>' + obj.data[i].name + '</a>';
				   strMenu[type] += '</li>';
				   strDashboardtable += '<tr>';
				   strDashboardtable += '<td><a href="#" onclick="load_djanguee_infos(' + id+ ')" class="btn-link">' + obj.data[i].name	 + '</a></td>';
				   strDashboardtable += '<td>' + type + '</td>';
				   strDashboardtable += '<td>Next</td>';
				   strDashboardtable += '<td>' + obj.data[i].amount  + '</td>';
				   strDashboardtable += '<td><span class="label label-success">Active</span></td>';
				   strDashboardtable += '</tr>';
				   myDjangueeIds.push(obj.data[i]);
			   }
			  
			   $( "#private_djanguee_list").empty();
			   $( "#private_djanguee_list").append(strMenu['Private']);
			   $( "#public_djanguee_list").empty();
			   $( "#public_djanguee_list").append(strMenu['Public']);
			   
			   $( "#djanguee-dahsboard-body").empty();
			   $( "#djanguee-dahsboard-body").append(strDashboardtable);

		    }

		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  //$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	  });
}

function createDjanguee() {
	var args = {
			name:$("#djanguee-step-tab1 input[name='name']").val(),
			number:$("#djanguee-step-tab1 input[name='memberCount']").val(),
			type:$("#cdjangueeType option:selected").val(),
			rate:$("#djanguee-step-tab2 input[name='rate']").val(),
			payment:$("#djanguee-step-tab2 input[name='payment']").val(),
			day:$("#djanguee-step-tab2 input[name='paymentday']").val(),
			rotation:$("#cdjangueeRotType option:selected").val(),
			is_searchable:$("#cdjangueeIsSearchable option:selected").val()
	}
	
	$('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('show');
	var jqxhr = $.ajax({
		  method: "GET",
		  url: "http://localhost:8888/services/createDjanguee",
		  data: args,
		  statusCode: {
			    404: function() {
			      alert( "page not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   
			   obj = JSON.parse(data);
			   
			   if(obj.inserted > 0){
				   $.niftyNoty({
						type: 'success',
						icon : 'fa fa-thumbs-o-up',
						message : "<strong>Djanguee created !</strong>",
						container : 'floating',
						timer : 3000
					});
				   reload_djanguees_list(obj.inserted);
				   $("#djanguee-step-tab1 input[name='name']").val('');
			   }
			   //email_available[obj.email] = obj.available;
		    }
		})
	  .done(function() {
	    //alert( "success" );
	  })
	  .fail(function() {
	    //alert( "error" );
	  })
	  .always(function() {
		  $('#djanguee-creation-panel-overlay').niftyOverlay().niftyOverlay('hide');
	  });
}


$(document).ready(function() {

	// Initialize the calendar
	// -----------------------------------------------------------------
	
	
	
	
	$('#djanguee-calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		editable: true,
		droppable: true, // this allows things to be dropped onto the calendar
		drop: function() {
			// is the "remove after drop" checkbox checked?
			//if ($('#drop-remove').is(':checked')) {
				// if so, remove the element from the "Draggable Events" list
				//$(this).remove();
			//}
		},
		defaultDate: '2015-01-12',
		eventLimit: true, // allow "more" link when too many events
		events: [
			{
				title: 'Happy Hour',
				start: '2015-01-05',
				end: '2015-01-07',
				className: 'purple'
			},
			{
				title: 'Birthday Party',
				start: '2015-01-15',
				end: '2015-01-17',
				className: 'mint'
			},
			{
				title: 'All Day Event',
				start: '2015-01-15',
				className: 'warning'
			},
			{
				title: 'Meeting',
				start: '2015-01-20T10:30:00',
				end: '2015-01-20T12:30:00',
				className: 'danger'
			},
			{
				title: 'All Day Event',
				start: '2015-02-01',
				className: 'warning'
			},
			{
				title: 'Long Event',
				start: '2015-02-07',
				end: '2015-02-10',
				className: 'purple'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2015-02-09T16:00:00'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2015-02-16T16:00:00',
				className: 'success'
			},
			{
				title: 'Conference',
				start: '2015-02-11',
				end: '2015-02-13',
				className: 'dark'
			},
			{
				title: 'Meeting',
				start: '2015-02-12T10:30:00',
				end: '2015-02-12T12:30:00'
			},
			{
				title: 'Lunch',
				start: '2015-02-12T12:00:00',
				className: 'pink'
			},
			{
				title: 'Meeting',
				start: '2015-02-12T14:30:00'
			},
			{
				title: 'Happy Hour',
				start: '2015-02-12T17:30:00'
			},
			{
				title: 'Dinner',
				start: '2015-02-12T20:00:00'
			},
			{
				title: 'Birthday Party',
				start: '2015-02-13T07:00:00'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2015-02-28'
			}
		]
	});


	// Expand / Collapse All Rows
	// -----------------------------------------------------------------
	var fooColExp = $('#djanguee-foo-col-exp');
	fooColExp.footable().trigger('footable_expand_first_row');


	$('#djanguee-foo-collapse').on('click', function(){
		fooColExp.trigger('footable_collapse_all');
	});
	$('#djanguee-foo-expand').on('click', function(){
		fooColExp.trigger('footable_expand_all');
	});
	
	$('#djanguee-creation-panel').hide();
	$('#djanguee_infos').hide();
	
	//Djanguee Creation page
	$('#djangue-creation-form').on('click', function(){
		show_creation_form();
	});
	
	//Dashboard
	$('#djanguee-dashboard').on('click', function(){
		show_djanguee_dashboard();
	});
	
	//Dashboard
	$('#member-profile').on('click', function(){
		show_member_profile();
	});
	
	
	$('#djanguee-creation-step-wz').bootstrapWizard({
		tabClass		: 'wz-steps',
		nextSelector	: '.next',
		previousSelector	: '.previous',
		onTabClick: function(tab, navigation, index) {
			return false;
		},
		onInit : function(){
			$('#djanguee-creation-step-wz').find('.finish').hide().prop('disabled', true);
			$('#djanguee-creation-step-wz').find('.finish').on('click', function(){
				createDjanguee();
			});
		},
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = (index/$total) * 100;
			var wdt = 100/$total;
			var lft = wdt*index;
			var margin = (100/$total)/2;
			$('#djanguee-creation-step-wz').find('.progress-bar').css({width:$percent+'%', 'margin': 0 + 'px ' + margin + '%'});


			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#djanguee-creation-step-wz').find('.next').hide();
				$('#djanguee-creation-step-wz').find('.finish').show();
				$('#djanguee-creation-step-wz').find('.finish').prop('disabled', false);
				reviewInfoCreation();
			} else {
				$('#djanguee-creation-step-wz').find('.next').show();
				$('#djanguee-creation-step-wz').find('.finish').hide().prop('disabled', true);
			}
		}
	});
	
	
	var isValid;
	$('#register-wz-form').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
		valid: 'fa fa-check-circle fa-lg text-success',
		invalid: 'fa fa-times-circle fa-lg',
		validating: 'fa fa-refresh'
		},
		fields: {
			username: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: 'The username is required.'
					}
				}
			},
			password: {
				validators: {
					notEmpty: {
						message: 'The password is required and can\'t be empty'
					},
					identical: {
						field: 'confirmPassword',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			confirmPassword: {
				validators: {
					notEmpty: {
						message: 'The confirm password is required and can\'t be empty'
					},
					identical: {
						field: 'password',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			email: {
				validators: {
					notEmpty: {
						message: 'The email address is required and can\'t be empty'
					},
					emailAddress: {
						message: 'The input is not a valid email address'
					}
				}
			},
			firstName: {
				validators: {
					notEmpty: {
						message: 'The first name is required and cannot be empty'
					},
					regexp: {
						regexp: /^[A-Z\s]+$/i,
						message: 'The first name can only consist of alphabetical characters and spaces'
					}
				}
			},
			lastName: {
				validators: {
					notEmpty: {
						message: 'The last name is required and cannot be empty'
					},
					regexp: {
						regexp: /^[A-Z\s]+$/i,
						message: 'The last name can only consist of alphabetical characters and spaces'
					}
				}
			},
			email_check_code: {
				validators: {
					notEmpty: {
						message: 'The code is required and cannot be empty'
					}
				}
			},
			phoneNumber: {
				validators: {
					notEmpty: {
						message: 'The phone number is required and cannot be empty'
					},
					digits: {
						message: 'The value can contain only digits'
					}
				}
			},
			address: {
				validators: {
					notEmpty: {
						message: 'The address is required'
					}
				}
			}
		}
	}).on('success.field.bv', function(e, data) {
		// $(e.target)  --> The field element
		// data.bv      --> The BootstrapValidator instance
		// data.field   --> The field name
		// data.element --> The field element

		var $parent = data.element.parents('.form-group');

		// Remove the has-success class
		$parent.removeClass('has-success');


		// Hide the success icon
		//$parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
	}).on('error.form.bv', function(e) {
		isValid = false;
	});
	
	reload_djanguees_list();
	reload_request_list();
	

});