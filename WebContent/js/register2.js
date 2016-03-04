
// Form-Wizard.js

function send_form_data_min() {
	email = $("#demo-bv-wz-form input[name='email']" ).val();
	password = $("#demo-bv-wz-form input[name='password']" ).val();
	email_check_code = $("#demo-bv-wz-form input[name='email_check_code']" ).val();
	bootbox.alert("Email " + email + ", password=" + password + ", email_check_code=" + email_check_code);
	
	$.ajax({
		  statusCode: {
		    404: function() {
		      alert( "page not found" );
		    }
		  }
		});
	
}

function init_form_wizard() {
	// FORM WIZARD
	// =================================================================
	// Require Bootstrap Wizard
	// http://vadimg.com/twitter-bootstrap-wizard-example/
	// =================================================================


	// FORM WIZARD WITH VALIDATION
	// =================================================================
	$('#demo-bv-wz').bootstrapWizard({
		tabClass		: 'wz-steps',
		nextSelector	: '.next',
		previousSelector	: '.previous',
		onTabClick: function(tab, navigation, index) {
			return false;
		},
		onInit : function(){
			$('#demo-bv-wz').find('.finish').hide().prop('disabled', true);
			$('#demo-bv-wz').find('.save').hide().prop('disabled', true);
			$('#demo-bv-wz').find('.save').click(function() {
				isValid = null;
				$('#demo-bv-wz-form').bootstrapValidator('validate');
				if(isValid!=false){
					send_form_data_min();
				}
			});
		},
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = (index/$total) * 100;
			var margin = (100/$total)/2;
			$('#demo-bv-wz').find('.progress-bar').css({width:$percent+'%', 'margin': 0 + 'px ' + margin + '%'});

			navigation.find('li:eq('+index+') a').trigger('focus');
			
			

			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#demo-bv-wz').find('.next').hide();
				$('#demo-bv-wz').find('.finish').show();
				$('#demo-bv-wz').find('.finish').prop('disabled', false);
			} else {
				$('#demo-bv-wz').find('.next').show();
				$('#demo-bv-wz').find('.finish').hide().prop('disabled', true);
			}

			
			if( navigation.find('li:eq('+index+') a').attr('href') == '#check-email-bv-tab' ){
				$('#demo-bv-wz').find('.save').show();
				$('#demo-bv-wz').find('.save').prop('disabled', false);
			}
			else {
				$('#demo-bv-wz').find('.save').hide().prop('disabled', true);
			}
			
		},
		onNext: function(){
			isValid = null;
			$('#demo-bv-wz-form').bootstrapValidator('validate');
			if(isValid === false)return false;
		}
	});




	// FORM VALIDATION
	// =================================================================
	// Require Bootstrap Validator
	// http://bootstrapvalidator.com/
	// =================================================================

	var isValid;
	$('#demo-bv-wz-form').bootstrapValidator({
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
}


