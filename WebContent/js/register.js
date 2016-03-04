
// Form-Wizard.js
$(document).ready(function() {

	email_available = {};
		
	function check_email_avail() {
		email = $("#register-wz-form input[name='email']" ).val();
		
		if(email_available[email] == undefined){
			
			$('#panel-register-overlay').niftyOverlay().niftyOverlay('show');
			
			$('#register-wz').find('.next').hide().prop('disabled', true);
			$('#register-wz').find('.previous').hide().prop('disabled', true);
			$.ajax( {
				  method: "GET",
				  url: "http://localhost:8888/services/check_email",
				  data: { email: email},
				  statusCode: {
					    404: function() {
					      alert( "page not found" );
					    }
				   },
				   success:function(data, textStatus,  jqXHR){
					   obj = JSON.parse(data);
					   email_available[obj.email] = obj.available;
					   $('#register-wz').bootstrapWizard('next');
					   //$('#register-wz').bootstrapWizard('show',1);
				   }
				}).always(function() {
					
					$('#register-wz').find('.next').show();
					$('#register-wz').find('.previous').show();
					$('#register-wz').find('.next').prop('disabled', false);
					$('#register-wz').find('.previous').prop('disabled', false);
					$('#panel-register-overlay').niftyOverlay().niftyOverlay('hide');
					
				  });
			
			return false;
				
		}
		else {
			
			isValid = null;
			$('#register-wz-form').bootstrapValidator('validate');
			
			if(email_available[obj.email]  != 0){
				   $.niftyNoty({
						type: 'danger',
						container : '#register-panel',
						html : 'Sorry this email is already taken, please enter another one.',
						focus: false,
						timer :  6000 
					});
				 return false;
			  }
			else if(isValid === false )return false;
			else return true;
		}
	}
	
	function send_form_data_min() {
		
		email = $("#register-wz-form input[name='email']" ).val();
		password = $("#register-wz-form input[name='password']" ).val();
		email_check_code = $("#register-wz-form input[name='email_check_code']" ).val();
		firstName = $("#register-wz-form input[name='firstName']").val();
		gender = $("#memberGender option:selected").val();
		
		//bootbox.alert("Email " + email + ", password=" + password + ", email_check_code=" + email_check_code);
		$('#register-wz').find('.next').prop('disabled', false);
		$('#register-wz').find('.previous').prop('disabled', false);
		$('#register-wz').find('.save').prop('disabled', false);
		$('#panel-register-overlay').niftyOverlay().niftyOverlay('show');
		var jqxhr = $.ajax({
			  method: "GET",
			  url: "http://localhost:8888/services/register",
			  data: { email: email, password: password, email_check_code: email_check_code, firstName:firstName, gender:gender},
			  statusCode: {
				    404: function() {
				      alert( "page not found" );
				    }
			   },
			   success:function(data, textStatus,  jqXHR){
				   obj = JSON.parse(data);
				   if(obj.inserted > 0 ) {
					   window.location = "http://localhost:8888";
				   }
				   else if (obj.already_exist) {
					   $.niftyNoty({
							type: 'danger',
							container : '#register-panel',
							html : 'Sorry this email is already taken, please enter another one.',
							focus: false,
							timer :  6000 
						});
				   }
				   else if (obj.email_code_match) {
					   $.niftyNoty({
							type: 'danger',
							container : '#register-panel',
							html : 'The code enter to verify your email is incorrect.',
							focus: false,
							timer :  6000 
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
			  $('#register-wz').find('.next').prop('disabled', true);
			  $('#register-wz').find('.previous').prop('disabled', true);
			  $('#register-wz').find('.save').prop('disabled', true);
			  $('#panel-register-overlay').niftyOverlay().niftyOverlay('hide');
		  });
		
	}

//function init_form_wizard() {
	// FORM WIZARD
	// =================================================================
	// Require Bootstrap Wizard
	// http://vadimg.com/twitter-bootstrap-wizard-example/
	// =================================================================


	// FORM WIZARD WITH VALIDATION
	// =================================================================
	$('#register-wz').bootstrapWizard({
		tabClass		: 'wz-steps',
		nextSelector	: '.next',
		previousSelector	: '.previous',
		onTabClick: function(tab, navigation, index) {
			return false;
		},
		onInit : function(){
			$('#register-wz').find('.finish').hide().prop('disabled', true);
			$('#register-wz').find('.save').hide().prop('disabled', true);
			$('#register-wz').find('.save').click(function() {
				alert('ok')
				send_form_data_min();
			});
		},
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = (index/$total) * 100;
			var margin = (100/$total)/2;
			$('#register-wz').find('.progress-bar').css({width:$percent+'%', 'margin': 0 + 'px ' + margin + '%'});

			navigation.find('li:eq('+index+') a').trigger('focus');
			
			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#register-wz').find('.next').hide();
				$('#register-wz').find('.finish').show();
				$('#register-wz').find('.finish').prop('disabled', false);
			} else {
				$('#register-wz').find('.next').show();
				$('#register-wz').find('.finish').hide().prop('disabled', true);
			}
			
			if( navigation.find('li:eq('+index+') a').attr('href') == '#register-email-pass-tab'){
				$('#register-wz').find('.save').hide().prop('disabled', true);
			}
			else {
				$('#register-wz').find('.save').show().prop('disabled', false);
			}
			
		},
		onNext: function(){
			return check_email_avail();
		}
	});




	// FORM VALIDATION
	// =================================================================
	// Require Bootstrap Validator
	// http://bootstrapvalidator.com/
	// =================================================================

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
//}

});


