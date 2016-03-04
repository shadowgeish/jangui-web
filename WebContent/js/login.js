
// Form-Wizard.js
$(document).ready(function() {
	
	function login_form() {
		
		email = $("#panel-login  input[name='email']" ).val();
		password = $("#panel-login input[name='password']" ).val();
	
		$('#panel-login-overlay').niftyOverlay().niftyOverlay('show');
		
		$.ajax({
			  method: "GET",
		  url: "http://localhost:8888/services/login",
		  data: { email: email, password:password},
		  statusCode: {
			    404: function() {
			      alert( "page check email not found" );
			    }
		   },
		   success:function(data, textStatus,  jqXHR){
			   obj = JSON.parse(data);
			   if(obj.user_found > 0 ) {
				   window.location = "http://localhost:8888";
			   }
			   else {
				   $('#panel-login-overlay').niftyOverlay().niftyOverlay('hide');
				   $.niftyNoty({
						type: 'danger',
						container : '#panel-login',
						html : 'Sorry, this email or the password is incorrect.',
						focus: false,
						timer :  6000 
					});
			   }
		   }
		}).always(function() {
			$('#panel-login-overlay').niftyOverlay().niftyOverlay('hide');
		});
			
	}
	
	$('#login-signin').click(function() {
		
		login_form() ;
	});
	

});


