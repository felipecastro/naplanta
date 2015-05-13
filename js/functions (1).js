$(document).ready(function() {

Parse.initialize("jmr1xTRqiSm5NTH7ZOpy4xDNTulIu531A1WtjRZF", "pwjRbPEKvhQDVcqMG7StjIjrvNbVHyooEchxFxSz");
    
    window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '1599053873672823', // Facebook App ID
      status     : true, // check Facebook Login status
      cookie     : true, // enable cookies to allow Parse to access the session
      xfbml      : true,
        version    : 'v2.2'
    });
 
 	mudaSaudacao();

  };
 
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
});

    
function loga(){
    
    Parse.FacebookUtils.logIn("user_likes,email,user_groups", {
  		success: function(user) {
    			if (!user.existed()) {
     				console.log("User signed up and logged in through Facebook!");
    			} else {
      				console.log("User logged in through Facebook!");
      				
    			}
    			
    			var fbid = user.attributes.authData.facebook.id;
    			
    			//Parse.User.current.set('facebookid', fbid);
    			//Parse.User.current.save;
    			
    			var uquery = new Parse.Query(Parse.User);        
                	uquery.get(Parse.User.current().id, {
			         success: function(object) {
			             // object is an instance of Parse.Object.
                                    object.set("facebookid", fbid);
			            object.save(null, {
  					success: function(object) {
    						// Execute any logic that should take place after the object is saved.
  						},
  					error: function(object, error) {
					    // Execute any logic that should take place if the save fails.
					    // error is a Parse.Error with an error code and message.
					    console.log('erro ao setar facebookid: ' + error.message);
  					}
					});
			         },
			
			         error: function(object, error) {
			             // error is an instance of Parse.Error.
			         }
			     });
    
    			FB.api('/me', function(response) {
     			});
            
                if (!Parse.FacebookUtils.isLinked(user)) {
  		            Parse.FacebookUtils.link(user, null, {
    			         success: function(user) {
      					     console.log("Woohoo, user logged in with Facebook!");
    				        },
    			         error: function(user, error) {
      				          console.log("User cancelled the Facebook login or did not fully authorize.");
    				        }
  		            });
	           }
     			
  		},
  		error: function(user, error) {
    			console.log("User cancelled the Facebook login or did not fully authorize.");
                gotologin();
  			}
	});
	
mudaSaudacao();
 };

function logaFB(){
    
    Parse.FacebookUtils.logIn("user_likes,email,user_groups", {
  		success: function(user) {
    			if (!user.existed()) {
     				console.log("User signed up and logged in through Facebook!");
    			} else {
      				console.log("User logged in through Facebook!");
      				gotoperfil();
                    mudaSaudacao();
    			}
    			
    			var fbid = user.attributes.authData.facebook.id;
    			
    			//Parse.User.current.set('facebookid', fbid);
    			//Parse.User.current.save;
    			
    			var uquery = new Parse.Query(Parse.User);        
                	uquery.get(Parse.User.current().id, {
			         success: function(object) {
			             // object is an instance of Parse.Object.
                        object.set("facebookid", fbid);
			            object.save(null, {
  					success: function(object) {
    						// Execute any logic that should take place after the object is saved.
  						},
  					error: function(object, error) {
					    // Execute any logic that should take place if the save fails.
					    // error is a Parse.Error with an error code and message.
					    console.log('erro ao setar facebookid: ' + error.message);
  					}
					});
			         },
			
			         error: function(object, error) {
			             // error is an instance of Parse.Error.
			         }
			     });
    
    			FB.api('/me', function(response) {
     			});
            
                if (!Parse.FacebookUtils.isLinked(user)) {
  		            Parse.FacebookUtils.link(user, null, {
    			         success: function(user) {
      					     console.log("Woohoo, user logged in with Facebook!");
                                gotoperfil();
    				        },
    			         error: function(user, error) {
      				          console.log("User cancelled the Facebook login or did not fully authorize.");
                              gotologin();
    				        }
  		            });
	           }
     		
            gotoperfil();
            mudaSaudacao();
  		},
  		error: function(user, error) {
    			console.log("User cancelled the Facebook login or did not fully authorize.");
                gotologin();
  			}
	});
	
mudaSaudacao();
 };

function logaParse(email,secret){
    
    escondeAlert();

    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("email", email);
    query.find({
    
        success: function(user) {
                        
            console.log('user retorno');
            console.log(user);
            
            if (user.length > 0){
                Parse.User.logIn(user[0].attributes.username, secret, {
                  success: function(user) {
                    // Do stuff after successful login.
                      //console.log("logou");
                      mudaSaudacao();
                      gotoperfil();

                  },
                  error: function(user, error) {
                    // The login failed. Check error to see why.
                      console.log("Error: " + error.code + " " + error.message);
                      exibeAlert('Login inválido, verifique seus dados e tente novamente');
                  }
                });
            } else {
                console.log('Usuário não encontrado');
                //$('#login-alert').html('Usuário não encotrado');
                exibeAlert('Login inválido, verifique seus dados e tente novamente');
            }
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            exibeAlert('Ocorreu um erro, tente novamente. ' + error.code + " " + error.message);
        }
    });
}

function criaUserParse(userF){

    var user = new Parse.User();
    user = userF;
    
    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            //logaParse(user.get("email"), user.get("password"));
            $('#signupsucess').html('Usuário criado com sucesso! Faça login na sua conta.');
            $('#signupsucess').css( "display", "block" );
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            console.log("Error: " + error.code + " " + error.message);
            
            if (error.code == 203) {
                exibeAlertS('Este cadastro já existe! Tente efetuar login.');
            } else {
                exibeAlertS('Ocorreu um erro. Verifique as informações e tente novamente.');
            }
        }
    });
}
    
function desloga(){
    Parse.User.logOut();
    mudaSaudacao();
    gotologin();
 };

function gotologin() {
    $(location).attr('href','#/login');
}

function gotoperfil() {
    $(location).attr('href','#/perfil');
}
 
function mudaSaudacao(){
    console.log(Parse.User.current());
  
    if (!Parse.User.current()){
        //$('#userprofile').html('<p class="navbar-text navbar-right">Clique <a href="#" onclick="loga();">aqui</a> para logar.</p>');
        $('#userprofile').html('<a href="#/login"><button type="button" class="btn btn-primary navbar-btn">Logar</button></a><a href="#/signup"><button type="button" class="btn btn-default navbar-btn">Criar conta</button></a>');
        
        $('#profile_image').html('');
    } else {
 	  
        var User = Parse.Object.extend("User");
        var query = new Parse.Query(User);
        query.get(Parse.User.current().id, {
                    
            success: function(user) {
                        
                //console.log('user retorno');
                //console.log(user);
                            
                var ret = '';
                
                ret += '<a class="navbar-brand" href="#/perfil">';
                ret += '    <span id="profile_image">';
                ret += '        <img width="30" heigth="30" class="img-circle img-responsive" src="'+user.get("avatar")+'">';
                ret += '    </span>';
                ret += '</a>';
                    
                $('#userprofile').html(ret);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                gotologin();
            }
        });
     	
    };
 };

function exibeAlert(msg){
    $('#login-alert').html(msg);
    $('#login-alert').css( "display", "block" );
}

function exibeAlertS(msg){
    $('#signupalert').html(msg);
    $('#signupalert').css( "display", "block" );
}

function escondeAlert(){
    $('#login-alert').html('');
    $('#login-alert').css( "display", "none" );
}