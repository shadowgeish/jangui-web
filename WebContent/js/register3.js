
// Form-Wizard.js
$(document).ready(function() {
	
	
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

	
	




	// FORM VALIDATION
	// =================================================================
	// Require Bootstrap Validator
	// http://bootstrapvalidator.com/
	// =================================================================

	var isValid;
	$('#main-register-form').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
		valid: 'fa fa-check-circle fa-lg text-success',
		invalid: 'fa fa-times-circle fa-lg',
		validating: 'fa fa-refresh'
		},
		fields: {=
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
	
	$('#main-register-form').bootstrapValidator('validate');
	
});



