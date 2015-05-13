    // app.js
    var routerApp = angular.module('naplanta', ['ui.router', 'ui.bootstrap', 'angularFileUpload', 'ajoslin.promise-tracker']);

    routerApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider

            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                controller: function($scope, $stateParams, $state) {

            /**if (!Parse.User.current()) {
                        $state.go('login');
                    }**/
              }
            })

            .state('empreendimentos', {
                url: '/empreendimentos/:page',
                templateUrl: 'emps.html',
                controller: function($scope, $stateParams, $state) {

                    //***********
                    $scope.page = $stateParams.page;
                    var page = $stateParams.page;
                    var displayLimit = 50;
                    var qtdetotal = 0;
                    var qtdpaginas = 1;
                    
                    if (page <= 0 || page == '') {page = 1};

                    page--;

                    var Emp= Parse.Object.extend("empreendimento");
                    var query = new Parse.Query(Emp);
                    query.descending('updatedAt');
                    query.equalTo("ativo", true);

                    query.count({
                                success: function(count) {
                                    qtdetotal = count;
                                    qtdpaginas = Math.round(qtdetotal/displayLimit);
                                    //alert('entrou');
                                    //alert(qtdpaginas);
                                    
                                    var dadosp = '';
                                    var pagatual;

                                    if (qtdpaginas > 1){
                                        dadosp += '</br>';
                                        dadosp += '<div class="well">';
                                        dadosp += '<nav>';
                                        dadosp += '  <ul class="pagination">';
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/empreendimentos/'+page+'" aria-label="Previous">';
                                        dadosp += '              <span aria-hidden="true">&laquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        for (var t = 0; t < qtdpaginas; t++) {
                                            pagatual = t+1;
                                            (page+1) == pagatual ? dadosp += '<li class="active"><a href="#/empreendimentos/'+pagatual+'">'+pagatual+'</a></li>' : dadosp += '<li><a href="#/empreendimentos/'+pagatual+'">'+pagatual+'</a></li>';
                                        }
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/empreendimentos/'+(page+2)+'" aria-label="Next">';
                                        dadosp += '              <span aria-hidden="true">&raquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        dadosp += '  </ul>';
                                        dadosp += '</nav>';
                                        dadosp += '</div>';

                                        $('#pagenavigation').html(dadosp);
                                    }

                                },
                                error: function(error) {
                                    // The request failed
                                    qtdetotal = 0;
                                    //alert(error);
                                    $('#listprest').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados. Tente novamente por favor.</div>');
                                }
                            });

                    query.limit(displayLimit);
                    query.skip(page * displayLimit);

                    query.find({
                        success: function(results) {
                            
                            var linkimage = 'http://naplanta.imagefly.io/w_300,h_155,f_png/http://naplanta.felipecastro.com.br';
                            var linklogo = 'http://naplanta.imagefly.io/w_30,h_30,f_png/http://naplanta.felipecastro.com.br';

                            var dados = '';

                            /*dados += '<div class="page-header"><h1 style="padding-left: 20px;">Empreendimentos ';
                            dados += '<small>';
                            dados += '<span class="dropdown open">';
                            dados += '<span class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">';
                            dados += 'Todos';
                            dados += '<span class="caret"></span>';
                            dados += '</span>';
                            dados += '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">';
                            dados += '<li role="presentation"><input type="text" ng-model="filtro" value="ffff"></li>';
                            dados += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Todos</a></li>';
                            dados += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Meus imóvies</a></li>';
                            dados += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Mais recentes</a></li>';
                            dados += '</ul>';
                            dados += '</span>';
                            dados += '</small>';
                            dados += '</h1></div>';*/

                            for (var i = 0; i < results.length; i++) { 
                                
                                var object = results[i];
                                  
                                dados += '<div class="col-sm-6 col-md-3">';
                                dados += '  <div class="thumbnail">';
                                dados += '      <a href="#/emp/'+object.id+'"><img src="'+linkimage+object.get('capa')+'" alt="'+object.get('nome')+'"></a>';
                                dados += '      <div class="overlay">';
                                dados += '      <a href="#" class="expand">+</a>';
                                dados += '      <a class="close-overlay hidden">x</a>';
                                dados += '      </div>';
                                dados += '      <div class="caption">';
                                dados += '          <h3><img src="'+linklogo+object.get('logo')+'" alt="'+object.get('nome')+'" class="img-circle img-responsive" style="display: inline;"> '+object.get('nome')+'</h3>';
                                dados += '          <p>'+object.get('construtora')+'</p>';
                                dados += '          <p><a href="#/emp/'+object.id+'" class="btn btn-primary btn-block" role="button">Detalhes</a> <a href="#/emp/'+object.id+'/servicos/realizados" class="btn btn-default btn-block" role="button">Serviços</a></p>';
                                dados += '      </div>';
                                dados += '  </div>';
                                dados += '</div>';
                            }

                            $('#listemp').html(dados);

                        },
                        error: function(error) {
                                //alert("Error: " + error.code + " " + error.message);
                                Parse.User.logOut();
                             $('#listemp').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados. Tente novamente por favor.</div>');
                        }
                    });

                    // $state.go('grupo.detail', { grupoId: $scope.id });
                }
            })

            .state('emp', {
                url: '/emp/:empID',
                templateUrl: 'emp.html',
                controller: function($scope, $stateParams, $state) {

                    /*if (!Parse.User.current()) {
                        $state.go('login');
                    }*/

                    //$scope.id = $stateParams.grupoID;
                    $scope.empid = $stateParams.empID;

                    var empid = $stateParams.empID; 

                    //***********
                    var ret;

                    var qtdservreal;
                    var qtdservsug;
                    var cliente;

                    var Emp= Parse.Object.extend("empreendimento");
                    var query = new Parse.Query(Emp);
                    query.equalTo("objectId", empid);
                    query.equalTo("ativo", true);
                    query.include("cadastradopor");

                    query.find({
                        success: function(results) {

                            cliente = results[0].attributes.cadastradopor;

                            var linkimage = 'http://naplanta.imagefly.io/w_800,h_300,f_png/http://naplanta.felipecastro.com.br'+results[0].attributes.capa;
                            var linkavatar = 'http://naplanta.imagefly.io/w_180,h_180,f_png/http://naplanta.felipecastro.com.br'+results[0].attributes.logo;

                            /*ret = '<h2>'+results[0].attributes.nome+'</h2>';
                            ret += '<p><i class="glyphicons glyphicons-riflescope"></i> <a href="#">'+results[0].attributes.construtora+'</p><br>';
                            ret += '<p>'+results[0].attributes.endereco+'</p><br>';

                            $('#dadosemp').html(ret);
                            $('#imgcapa').html('<div class="fullWidth"><img src="http://naplanta.imagefly.io/w_800,h_300,f_png/'+results[0].attributes.capa+'" alt="header-picture"></div>');
                            $('#logo').html('<img src="'+results[0].attributes.logo+'" class="img-thumbnail">');*/

                            ret = '<div class="row container-fluid profile-header" style="background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(59%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1))), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += '-moz-background-size: cover;';
                            ret += '-o-background-size: cover;';
                            ret += 'background-size: cover;';
                            ret += 'padding-top:150px;';
                            ret += 'padding-bottom:20px;';
                            ret += 'vertical-align: bottom;">';
                            ret += '<div class="container">';
                            ret += '	<div class="row profile-header-content">';
                            ret += '		<div class="col-md-3 col-sm-3 col-xs-4 profile-pic"><img src="'+linkavatar+'" class="img-thumbnail"></div>';
                            ret += '		<div class="col-md-9 col-sm-9 col-xs-8 profile-about">';
                            ret += '            <h2>'+results[0].attributes.nome+'</h2>';
                            ret += '            <p><i class="glyphicons glyphicons-riflescope"></i> <a href="#">'+results[0].attributes.construtora+'</a></p>';
                            /*ret += '            <p>'+results[0].attributes.endereco+'</p><br>';*/
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '</div>';
                            ret += '</div>';
                            ret += '<div class="row"  style="padding-top: 40px;">';

                            ret += '    <div class="col-sm-10" style="">';
                            ret += '        <div class="panel panel-default">';
                            ret += '            <div class="panel-heading" contenteditable="false">Endereço</div>';
                            ret += '            <div class="panel-body" contenteditable="false"><h2>'+results[0].attributes.endereco+'</h2></div>';
                            ret += '        </div>';
                            ret += '        <div id="listsugserv">';
                            ret += '            <div class="spinner">';
                            ret += '                <div class="double-bounce1"></div>';
                            ret += '                <div class="double-bounce2"></div>';
                            ret += '            </div>';
                            ret += '        </div>';
                            ret += '        <div id="listrealserv">';
                            ret += '            <div class="spinner">';
                            ret += '                <div class="double-bounce1"></div>';
                            ret += '                <div class="double-bounce2"></div>';
                            ret += '            </div>';
                            ret += '        </div>';
                            //** FB coments
                            ret += '        <div id="fb-root">';
                            ret += '            <div class="fb-comments" data-href="http://naplanta.felipecastro.com.br/#/emp/'+empid+'" data-numposts="5" data-colorscheme="light"></div>';
                            ret += '        </div>';
                            //**
                            ret += '    </div>';
                            ret += '   <div class="col-sm-2">';
                            ret += '      <ul class="list-group">';
                            ret += '        <li class="list-group-item text-muted">Dados</li>';
                            ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Tipo</strong></span>'+results[0].attributes.tipo+'</li>';
                            ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Unidades</strong></span>'+results[0].attributes.unidades+'</li>';
                            ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Status</strong></span>';
                            if (results[0].attributes.pronto == true) {
                                ret += '<span class="label label-success">Pronto</span></li>'; 
                            } else {
                                ret += '<span class="label label-info">Em obras</span></li>'; 
                            };
                            ret += '      </ul>';

                            ret += '      <ul class="list-group">';
                            ret += '        <li class="list-group-item text-muted">Serviços</li>';
                            ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Realizados</strong></span> <span id="qtdservreal">0</span></li>';
                            ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Sugeridos</strong></span> <span id="qtdservsuge">0</span></li>';
                            ret += '      </ul>';

                            ret += '      <div class="panel panel-default">';
                            ret += '            <div class="panel-heading">Ações</div>';
                            ret += '            <div class="panel-body">';
                            ret += '                <a href="#" class="btn btn-info btn-sm btn-block" role="button">Incluir em meus imóveis</a>';
                            
                            if (Parse.User.current()) {
                                if (Parse.User.current().id == cliente.id){
                                    ret += '            <a href="#" class="btn btn-info btn-sm btn-block" role="button">Editar</a>';
                                }
                            }
                            
                            ret += '                <a href="#" class="btn btn-danger btn-sm btn-block" role="button">Denunciar</a>';
                            
                            ret += '            </div>';
                            ret += '       </div>';

                            ret += '      <div class="panel panel-default">';
                            ret += '            <div class="panel-heading">Cadastrado por</div>';
                            ret += '            <div class="panel-body"><span id="profile_image" class="pull-left"><img width="30" heigth="30" class="img-circle img-responsive" src="'+cliente.get("avatar")+'"></span></span><span class="pull-left" style="padding-left: 10px;padding-top: 5px;">'+cliente.get("nomecompleto")+'</span></div>';
                            ret += '       </div>';

                            ret += '       <div class="panel panel-default">';
                            ret += '            <div class="panel-heading">Website <i class="fa fa-link fa-1x"></i></div>';
                            ret += '       <div class="panel-body"><a href="'+results[0].attributes.url+'" class="">Acessar o site</a></div></div>';

                            ret += '       <div class="panel panel-default">';
                            ret += '            <div class="panel-heading">Social</div>';
                            ret += '            <div class="panel-body">	<i class="fa fa-facebook fa-2x"></i>  <i class="fa fa-github fa-2x"></i> ';
                            ret += '                <i class="fa fa-twitter fa-2x"></i> <i class="fa fa-pinterest fa-2x"></i>  <i class="fa fa-google-plus fa-2x"></i>';
                            ret += '            </div>';
                            ret += '       </div>';
                            ret += '    </div>';


                            ret += '</div>';

                            $('#profile').html(ret);
                            
                            //**** get serviços sugeridos
                            var ServicoEmp= Parse.Object.extend("servico_emp");
                            var Servicos = Parse.Object.extend("servico");
                            var Fornec = Parse.Object.extend("fornecedor");
                            var innerQuery = new Parse.Query(ServicoEmp);
                            var fornQuery = new Parse.Query(Fornec);
                            innerQuery.equalTo("emp", empid);

                            var query = new Parse.Query(Servicos);
                            query.matchesKeyInQuery('objectId', 'servico', innerQuery);

                            query.count({
                                success: function(count) {
                                    qtdservsug = count;
                                },
                                error: function(error) {
                                    // The request failed
                                    qtdservsug = 0;
                                }
                            });
                            query.limit(4);

                            query.find({
                                success: function(results) {
                                    
                                    var dados = '';

                                    dados += '<div class="panel panel-default target">';
                                    dados += '   <div class="panel-heading">Serviços Sugeridos   <a href="#/emp/'+empid+'/servicos/sugeridos" class="btn btn-default btn-xs" style="float: right;" role="button">Veja todos</a></div>';
                                    dados += '  <div class="panel-body">';
                                    
                                    if (results.length > 0){  
                                        
                                        dados += '      <div class="row">';

                                        for (var i = 0; i < results.length; i++) { 
                                            
                                            var object = results[i];
                                            /*dados += '<div><div><span>'+object.get('desc')+'</span><br><span>'+object.get('preco')+'</span><br><span id="fornec'+object.get('fornec')+'"></span></div>';*/

                                            dados += '<div class="col-sm-6 col-md-3">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<a href="#/servico/'+object.id+'" ><img src="'+object.get('capa')+'" alt=""></a>';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+object.get('desc')+'</h3>';
                                            dados += '<div class="preco"><p  class="label label-success">A partir de R$ '+object.get('preco')+'</p></div>';
                                            dados += '<p id="fornec'+object.get('fornec')+'"></p>';
                                            dados += '<p><a href="#/servico/'+object.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';

                                        }

                                        dados += '         </div>';
                                        
                                    } else {
                                        dados += '<div class="alert alert-warning" role="alert">Não temos nenhum serviço cadastrado para este imóvel ainda. <a href="#">Cadastrar um serviço</a></div>';
                                    }
                                    
                                    dados += '      </div>';
                                    dados += '  </div>';

                                    $('#listsugserv').html(dados);
                                },
                                error: function(error) {
                                    //alert("Error: " + error.code + " " + error.message);
                                }
                            })

                            fornQuery.find({
                                success: function(results) {

                                    for (var i = 0; i < results.length; i++) { 

                                        var fornec = results[i];
                                        $('#fornec'+results[i].id).html(results[i].attributes.nome);

                                    }
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            })
                            //**** fim serviços sugeridos
                            //**** get serviços realizados

                            var Negocio= Parse.Object.extend("negocio");
                            var Servicos = Parse.Object.extend("servico");
                            var innerQuery = new Parse.Query(Negocio);
                            innerQuery.equalTo("emp", empid);
                            innerQuery.include("servicop");
                            innerQuery.find({
                                success: function(results) {
                                    
                                    var dados = '';
                                    
                                    dados += '<div class="panel panel-default target">';
                                    dados += '   <div class="panel-heading">Serviços Realizados   <a href="#/emp/'+empid+'/servicos/realizados" class="btn btn-default btn-xs" style="float: right;" role="button">Veja todos</a></div>';
                                    dados += '  <div class="panel-body">';
                                    
                                    if (results.length > 0){

                                        qtdservreal = results.length;

                                        
                                        dados += '<div class="row">';

                                        var limit;
                                        limit = qtdservreal>4?4:qtdservreal;
                                        for (var i = 0; i < limit; i++) { 
                                            var object = results[i];

                                            //console.log('negocio / servico');
                                            //console.log(object);
                                            //console.log(results[i].get("negocio"));   
                                            var servico = results[i].get("servicop");

                                            dados += '<div class="col-sm-6 col-md-3">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<a href="#/negocio/'+object.id+'" ><img src="'+servico.get("capa")+'" alt=""></a>';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+servico.get("desc")+'</h3>';
                                            dados += '<div class="preco"><p  class="label label-success">A partir de R$ '+servico.get("preco")+'</p></div>';
                                            dados += '<p id="fornec'+servico.get("fornec")+'"></p>';
                                            dados += '<p><a href="#/negocio/'+object.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';

                                        }

                                        dados += '         </div>';

                                    } else {
                                         dados += '<div class="alert alert-warning" role="alert">Não temos nenhum serviço cadastrado para este imóvel ainda. <a href="#">Cadastrar um serviço</a></div>';
                                    }
                                    
                                    
                                    dados += '      </div>';
                                    dados += '  </div>';
                                    
                                    $('#listrealserv').html(dados);

                                    $('#qtdservreal').html(qtdservreal);
                                    $('#qtdservsuge').html(qtdservsug);
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            })

                            //**** fim serviços realizados
                        },
                        error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
                    //***********

                   // $state.go('grupo.detail', { grupoId: $scope.id });

                }
            })

            .state('empservicosrealizados', {
                url: '/emp/:empID/servicos/realizados',
                templateUrl: 'servicosemp.html',
                controller: function($scope, $stateParams, $state) {

                    $scope.empid = $stateParams.empID;
                    var empid = $stateParams.empID; 

                    var Emp= Parse.Object.extend("empreendimento");
                    var query = new Parse.Query(Emp);
                    query.equalTo("objectId", empid);

                    query.find({
                        success: function(results) {

                            var empreendimento = results[0];
                            var linkimage = 'http://naplanta.imagefly.io/w_600,h_100,f_png/'+results[0].attributes.capa;

                            /*ret = '<h2>'+results[0].attributes.nome+'</h2>';
                            ret += '<p><i class="glyphicons glyphicons-riflescope"></i> <a href="#">'+results[0].attributes.construtora+'</p><br>';
                            ret += '<p>'+results[0].attributes.endereco+'</p><br>';

                            $('#dadosemp').html(ret);
                            $('#imgcapa').html('<div class="fullWidth"><img src="http://naplanta.imagefly.io/w_800,h_300,f_png/'+results[0].attributes.capa+'" alt="header-picture"></div>');
                            $('#logo').html('<img src="'+results[0].attributes.logo+'" class="img-thumbnail">');*/

                            ret = '<div class="container-fluid profile-header" style="background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(59%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1))), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += '-moz-background-size: cover;';
                            ret += '-o-background-size: cover;';
                            ret += 'background-size: cover;';
                            ret += 'padding-top:10px;';
                            ret += 'padding-bottom:10px;';
                            ret += 'vertical-align: bottom;">';
                            ret += '<div class="container">';
                            ret += '	<div class="row profile-header-content">';
                            ret += '		<div class="col-md-3 col-sm-3 col-xs-4 profile-pic"><img src="'+results[0].attributes.logo+'" class="img-thumbnail"></div>';
                            ret += '		<div class="col-md-9 col-sm-9 col-xs-8 profile-about">';
                            ret += '            <h2>'+results[0].attributes.nome+'</h2>';
                            ret += '            <p><i class="glyphicons glyphicons-riflescope"></i> <a href="#">'+results[0].attributes.construtora+'</a></p>';
                            /*ret += '            <p>'+results[0].attributes.endereco+'</p><br>';*/
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '</div>';
                            ret += '</div>';

                            //**** get serviços realizados
                            var Negocio= Parse.Object.extend("negocio");
                            //var Servicos = Parse.Object.extend("servico");
                            var innerQuery = new Parse.Query(Negocio);
                            innerQuery.equalTo("emp", empid);
                            innerQuery.include("servicop");
                            innerQuery.find({
                                success: function(results) {

                                    //console.log(results);
                                    //$('#listrealserv').html(dados);
                                    //var servico;
                                    var dados = '';

                                    dados += '<div class="panel panel-default">';
                                    dados += '  <div class="panel-heading">';
                                    dados += '      <h3 class="panel-title">Serviços Realizados</h3>';
                                    dados += '  </div>';
                                    dados += '  <div class="panel-body">';
                                    dados += '      <div class="row">';

                                    for (var i = 0; i < results.length; i++) { 
                                        var object = results[i];
                                        console.log('negocio');
                                        console.log(object);
                                        servico = results[i].attributes.servicop;
                                        console.log('servico');
                                        console.log(servico);
                                        /*dados += '<div><div><span>'+object.get('desc')+'</span><br><span>'+object.get('preco')+'</span><br><span id="fornec'+object.get('fornec')+'"></span></div>';*/

                                        dados += '<div class="col-sm-6 col-md-3">';
                                        dados += '<div class="thumbnail">';
                                        dados += '<a href="#/negocio/'+object.id+'"><img src="'+servico.get('capa')+'" alt=""></a>';
                                        dados += '<div class="caption">';
                                        dados += '<h3>'+servico.get('desc')+'</h3>';
                                        dados += '<div class="preco"><p  class="label label-success">A partir de R$ '+servico.get('preco')+'</p></div>'
                                        dados += '<p id="fornec'+object.get('fornec')+'"></p>';
                                        dados += '<p><a href="#/negocio/'+object.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                        dados += '</div>';
                                        dados += '</div>';
                                        dados += '</div>';

                                    }

                                    dados += '         </div>';
                                    dados += '      </div>';
                                    dados += '  </div>';
                                    $('#listservicosemp').html(ret + dados);
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            })

                            //**** fim serviços realizados
                        },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                    })

                }
            })

            .state('empservicossugeridos', {
                url: '/emp/:empID/servicos/sugeridos',
                templateUrl: 'servicosemp.html',
                controller: function($scope, $stateParams, $state) {

                    $scope.empid = $stateParams.empID;
                    var empid = $stateParams.empID; 

                    var Emp= Parse.Object.extend("empreendimento");
                    var query = new Parse.Query(Emp);
                    query.equalTo("objectId", empid);

                    query.find({
                        success: function(results) {

                        var empreendimento = results[0];
                        var linkimage = 'http://naplanta.imagefly.io/w_600,h_100,f_png/'+results[0].attributes.capa;

                        ret = '<div class="container-fluid profile-header" style="background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(59%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1))), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += 'background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += 'background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += 'background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += 'background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                        ret += '-moz-background-size: cover;';
                        ret += '-o-background-size: cover;';
                        ret += 'background-size: cover;';
                        ret += 'padding-top:10px;';
                        ret += 'padding-bottom:10px;';
                        ret += 'vertical-align: bottom;">';
                        ret += '<div class="container">';
                        ret += '	<div class="row profile-header-content">';
                        ret += '		<div class="col-md-3 col-sm-3 col-xs-4 profile-pic"><img src="'+results[0].attributes.logo+'" class="img-thumbnail"></div>';
                        ret += '		<div class="col-md-9 col-sm-9 col-xs-8 profile-about">';
                        ret += '            <h2>'+results[0].attributes.nome+'</h2>';
                        ret += '            <p><i class="glyphicons glyphicons-riflescope"></i> <a href="#">'+results[0].attributes.construtora+'</a></p>';
                        /*ret += '            <p>'+results[0].attributes.endereco+'</p><br>';*/
                        ret += '        </div>';
                        ret += '    </div>';
                        ret += '</div>';
                        ret += '</div>';

                        //**** get serviços sugeridos
                        var Negocio= Parse.Object.extend("servico_emp");
                        var Servicos = Parse.Object.extend("servico");
                        var innerQuery = new Parse.Query(Negocio);
                        innerQuery.equalTo("emp", empid);

                        innerQuery.find({
                                success: function(results) {

                                    var query = new Parse.Query(Servicos);
                                    query.matchesKeyInQuery('objectId', 'servico', innerQuery);  

                                    query.find({
                                        success: function(results) {

                                            var dados = '';

                                            dados += '<div class="panel panel-default">';
                                            dados += '  <div class="panel-heading">';
                                            dados += '      <h3 class="panel-title">Serviços Sugeridos</h3>';
                                            dados += '  </div>';
                                            dados += '  <div class="panel-body">';
                                            dados += '      <div class="row">';

                                            for (var i = 0; i < results.length; i++) { 

                                                var object = results[i];

                                                dados += '<div class="col-sm-6 col-md-3">';
                                                dados += '  <div class="thumbnail">';
                                                dados += '      <a href="#/servico/'+object.id+'"><img src="'+object.get('capa')+'" alt=""></a>';
                                                dados += '      <div class="caption">';
                                                dados += '          <h3>'+object.get('desc')+'</h3>';
                                                dados += '          <p  class="label label-success">A partir de R$ '+object.get('preco')+'</p>'
                                                dados += '          <p id="fornec'+object.get('fornec')+'"></p>';
                                                dados += '          <p><a href="#/servico/'+object.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                                dados += '      </div>';
                                                dados += '  </div>';
                                                dados += '</div>';

                                            }

                                            dados += '         </div>';
                                            dados += '      </div>';
                                            dados += '  </div>';

                                            $('#listservicosemp').html(ret + dados);
                                        },
                                        error: function(error) {
                                            alert("Error: " + error.code + " " + error.message);
                                        }
                                    })
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            })

                            //**** fim serviços realizados
                        },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                    })

                }
            })

            .state('emp.comodos', {
                url: '/emp/:empID/comodo/:comodoID',
                templateUrl: 'emp.comodo.html',
                controller: function($scope, $stateParams, $state) {

                    var Emp= Parse.Object.extend("empreendimento");
                    var query = new Parse.Query(Emp);
                    //query.equalTo("publico", true);
                    query.find({
                        success: function(results) {

                            var dados = '';
                            for (var i = 0; i < results.length; i++) { 
                                  var object = results[i];
                                  dados = dados + '<li><a href="#/emp/'+object.id+'">'+object.get('nome')+'</a></li>';
                                }

                             $('#listcomodos').html(dados);


                        },
                        error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                        }
                    });

                }
            })

            .state('prestadores', {
                url: '/prestadores/:page',
                templateUrl: 'prests.html',
                controller: function($scope, $stateParams, $state) {

                    //***********
                    $scope.page = $stateParams.page;
                    var page = $stateParams.page;
                    var displayLimit = 50;
                    var qtdetotal = 0;
                    var qtdpaginas = 1;

                    if (page <= 0 || page == '') {page = 1};

                    page--;

                    var Prest= Parse.Object.extend("fornecedor");
                    var query = new Parse.Query(Prest);

                    query.equalTo("ativo", true);

                    query.count({
                                success: function(count) {
                                    qtdetotal = count;
                                    qtdpaginas = Math.round(qtdetotal/displayLimit);
                                    //alert('entrou');
                                    //alert(qtdpaginas);

                                    var dadosp = '';
                                    var pagatual;

                                    if (qtdpaginas > 1){
                                        dadosp += '</br>';
                                        dadosp += '<div class="well">';
                                        dadosp += '<nav>';
                                        dadosp += '  <ul class="pagination">';
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/prestadores/'+page+'" aria-label="Previous">';
                                        dadosp += '              <span aria-hidden="true">&laquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        for (var t = 0; t < qtdpaginas; t++) {
                                            pagatual = t+1;
                                            (page+1) == pagatual ? dadosp += '<li class="active"><a href="#/prestadores/'+pagatual+'">'+pagatual+'</a></li>' : dadosp += '<li><a href="#/prestadores/'+pagatual+'">'+pagatual+'</a></li>';
                                        }
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/prestadores/'+(page+2)+'" aria-label="Next">';
                                        dadosp += '              <span aria-hidden="true">&raquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        dadosp += '  </ul>';
                                        dadosp += '</nav>';
                                        dadosp += '</div>';

                                        $('#pagenavigation').html(dadosp);
                                    }

                                },
                                error: function(error) {
                                    // The request failed
                                    qtdetotal = 0;
                                    //alert(error);
                                    $('#listprest').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>');
                                }
                            });

                    query.limit(displayLimit);
                    query.skip(page * displayLimit);
                    query.find({
                        success: function(results) {

                            var dados = '';
                            
                            var linkimage = 'http://naplanta.imagefly.io/w_300,h_155,f_png/http://naplanta.felipecastro.com.br';
                            var linklogo = 'http://naplanta.imagefly.io/w_30,h_30,f_png/http://naplanta.felipecastro.com.br';

                            if (results.length<1){dados = '<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>'};

                            for (var i = 0; i < results.length; i++) { 
                                  var object = results[i];
                                  /*dados = dados + '<li><a href="#/prest/'+object.id+'">'+object.get('nome')+'</a></li>';*/
                                    dados += '<div class="col-sm-6 col-md-3">';
                                    dados += '  <div class="thumbnail">';
                                    dados += '      <a href="#/prest/'+object.id+'"><img src="'+linkimage+object.get('capa')+'" alt="'+object.get('nome')+'"></a>';
                                    dados += '      <div class="caption">';
                                    dados += '          <h3><img src="'+linklogo+object.get('logo')+'" alt="'+object.get('nome')+'" class="img-circle img-responsive" style="display: inline;"> '+object.get('nome')+'</h3>';
                                    dados += '          <p>'+object.get('servicos')+'</p>';
                                    dados += '          <p><a href="#/prest/'+object.id+'" class="btn btn-primary btn-block" role="button">Detalhes</a> <a href="#/'+object.id+'/servicos" class="btn btn-default btn-block" role="button">Serviços</a></p>';
                                    dados += '      </div>';
                                    dados += '  </div>';
                                    dados += '</div>';
                                }

                                //dados += '<p id="pagenavigation"></p>';

                                $('#listprest').html(dados);

                        },
                        error: function(error) {
                                //alert("Error: " + error.code + " " + error.message);
                                $('#listprest').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>');
                        }
                    });

                    // $state.go('grupo.detail', { grupoId: $scope.id });
                }
            })
        
            .state('buscaprestadores', {
                url: '/prestadores/busca/:termo/:page',
                templateUrl: 'prests.html',
                controller: function($scope, $stateParams, $state) {

                    //***********
                    $scope.page = $stateParams.page;
                    var page = $stateParams.page;
                    $scope.termo = $stateParams.termo;
                    var termo = $stateParams.termo;
                    var displayLimit = 50;
                    var qtdetotal = 0;
                    var qtdpaginas = 1;

                    if (page <= 0 || page == '') {page = 1};

                    page--;

                    var Prest= Parse.Object.extend("fornecedor");
                    var query = new Parse.Query(Prest);
                    query.equalTo("nome", termo);

                    query.equalTo("ativo", true);

                    query.count({
                                success: function(count) {
                                    qtdetotal = count;
                                    qtdpaginas = Math.round(qtdetotal/displayLimit);
                                    //alert('entrou');
                                    //alert(qtdpaginas);

                                    var dadosp = '';
                                    var pagatual;

                                    if (qtdpaginas > 1){
                                        dadosp += '</br>';
                                        dadosp += '<div class="well">';
                                        dadosp += '<nav>';
                                        dadosp += '  <ul class="pagination">';
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/prestadores/'+page+'" aria-label="Previous">';
                                        dadosp += '              <span aria-hidden="true">&laquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        for (var t = 0; t < qtdpaginas; t++) {
                                            pagatual = t+1;
                                            (page+1) == pagatual ? dadosp += '<li class="active"><a href="#/prestadores/'+pagatual+'">'+pagatual+'</a></li>' : dadosp += '<li><a href="#/prestadores/'+pagatual+'">'+pagatual+'</a></li>';
                                        }
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/prestadores/'+(page+2)+'" aria-label="Next">';
                                        dadosp += '              <span aria-hidden="true">&raquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        dadosp += '  </ul>';
                                        dadosp += '</nav>';
                                        dadosp += '</div>';

                                        $('#pagenavigation').html(dadosp);
                                    }

                                },
                                error: function(error) {
                                    // The request failed
                                    qtdetotal = 0;
                                    //alert(error);
                                    $('#listprest').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>');
                                }
                            });

                    query.limit(displayLimit);
                    query.skip(page * displayLimit);
                    query.find({
                        success: function(results) {

                            var dados = '';

                            if (results.length<1){dados = '<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>'};

                            for (var i = 0; i < results.length; i++) { 
                                  var object = results[i];
                                  /*dados = dados + '<li><a href="#/prest/'+object.id+'">'+object.get('nome')+'</a></li>';*/
                                    dados += '<div class="col-sm-6 col-md-3">';
                                    dados += '  <div class="thumbnail">';
                                    dados += '      <a href="#/prest/'+object.id+'"><img src="'+object.get('capa')+'" alt="'+object.get('nome')+'"></a>';
                                    dados += '      <div class="caption">';
                                    dados += '          <h3>'+object.get('nome')+'</h3>';
                                    dados += '          <p>'+object.get('servicos')+'</p>';
                                    dados += '          <p><a href="#/prest/'+object.id+'" class="btn btn-primary btn-block" role="button">Detalhes</a> <a href="#/'+object.id+'/servicos" class="btn btn-default btn-block" role="button">Serviços</a></p>';
                                    dados += '      </div>';
                                    dados += '  </div>';
                                    dados += '</div>';
                                }

                                //dados += '<p id="pagenavigation"></p>';

                                $('#listprest').html(dados);

                        },
                        error: function(error) {
                                //alert("Error: " + error.code + " " + error.message);
                                $('#listprest').html('<div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>');
                        }
                    });

                    // $state.go('grupo.detail', { grupoId: $scope.id });
                }
            })

            .state('prestador', {
                url: '/prest/:prestID',
                templateUrl: 'prest.html',
                controller: function($scope, $stateParams, $state) {

                    /*if (!Parse.User.current()) {
                        $state.go('login');
                    }*/

                    //$scope.id = $stateParams.grupoID;
                    $scope.prestid = $stateParams.prestID;

                    var prestid = $stateParams.prestID;

                    //console.log('feira  '+$scope.feiraid);

                    //***********
                    
                    var Prest= Parse.Object.extend("fornecedor");
                    var query = new Parse.Query(Prest);
                    query.include("cadastropor");
                    //query.equalTo("objectId", prestid);
                    
                    query.get(prestid, {
                        success: function(fornecedor) {
                            //console.log('prestador');
                            //console.log(fornecedor);
                            var cliente = fornecedor.attributes.cadastropor;
                            
                            var cor;
                            if (fornecedor.get("reputacao") < 4) {
                                cor = "danger";
                            } else if (fornecedor.get("reputacao") > 7) {
                                cor = "success";
                            } else {
                                cor = "warning";
                            } 
                            
                            var ret = '';
                            
                            ret += '<div class="container">';
                            ret += '    <div class="row">';
                            ret += '        <div class="col-sm-10">';
                            ret += '            <div class="page-header">';
                            ret += '                <h1>'+fornecedor.get("nome")+'    <small><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> '+fornecedor.get("tel")+'</small></h1>';
                            ret += '             </div>';
                            ret += '            <div class="col-sm-10">';
                            ret += '                <h3><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> '+fornecedor.get("site")+'</h3>';
                            ret += '            </div>';
                            ret += '            <div class="col-sm-2">';
                            ret += '                <button type="button" class="btn-sm btn-primary">Editar</button>  ';
                            ret += '            </div>';
                            ret += '        </div>';
                            ret += '        <div class="col-sm-2">';
                            ret += '            <img title="profile image" class="img-circle img-responsive" src="'+fornecedor.get("logo")+'">';
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '    <br>';
                            ret += '    <div class="row">';
                            ret += '        <div class="col-sm-3">';
                            ret += '            <ul class="list-group">';
                            ret += '                <li class="list-group-item text-muted" contenteditable="false">Perfil</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Criado em</strong></span> '+fornecedor.createdAt.getDate()+'/'+fornecedor.createdAt.getMonth()+'/'+fornecedor.createdAt.getFullYear()+'</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Responsável</strong></span> '+fornecedor.get("responsavel")+'</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Email </strong></span> '+fornecedor.get("email")+'</li>';
                            ret += '            </ul>';
                            
                            ret += '            <ul class="list-group">';
                            ret += '                <li class="list-group-item text-muted" contenteditable="false">Social</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">facebook</strong></span> sss</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">whatsapp</strong></span> sss</li>';
                            ret += '            </ul>';
                            
                            ret += '            <ul class="list-group">';
                            ret += '                <li class="list-group-item text-muted">Atividade <i class="fa fa-dashboard fa-1x"></i></li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Imóveis</strong></span> <span id="qtdemp">0</span></li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Negócios</strong></span> <span id="qtdneg">0</span</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Avaliações</strong></span> 37</li>';
                            ret += '            </ul>';
                            ret += '      <div class="panel panel-default">';
                            ret += '            <div class="panel-heading">Cadastrado por</div>';
                            ret += '            <div class="panel-body"><span id="profile_image" class="pull-left"><img width="30" heigth="30" class="img-circle img-responsive" src="'+cliente.get("avatar")+'"></span></span><span class="pull-left" style="padding-left: 10px;padding-top: 5px;">'+cliente.get("nomecompleto")+'</span></div>';
                            ret += '       </div>';
                            ret += '        </div>';
                            ret += '        <div class="col-sm-9" contenteditable="false" style="">';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false">Reputação '+fornecedor.get("reputacao")+' /10</div>';
                            ret += '                <div class="panel-body" id="">';
                            ret += '                    <br><div class="progress">';
                            ret += '                        <div class="progress-bar progress-bar-'+cor+'" role="progressbar" aria-valuenow="'+fornecedor.get("reputacao")+'" aria-valuemin="0" aria-valuemax="10" style="width: '+fornecedor.get("reputacao")+'0%">';
                            ret += '                            <span class="sr-only"></span>';
                            ret += '                        </div>';
                            ret += '                    </div>';
                            
                            ret += '                </div>';
                            ret += '            </div>';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> Endereço</div>';
                            ret += '                <div class="panel-body" contenteditable="false"><span>'+fornecedor.get("endereco")+'</span></div>';
                            ret += '            </div>';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false">Descrição</div>';
                            ret += '                <div class="panel-body" contenteditable="false"><span>'+fornecedor.get("coment")+'</span></div>';
                            ret += '            </div>';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false">Serviços ofertados   <a href="#/'+prestid+'/servicos" class="btn btn-default btn-xs" style="float: right;" role="button">Veja todos</a></div>';
                            ret += '                <div class="panel-body" contenteditable="false" id="servicosofertados">';
                            ret += '                	<div class="spinner">';
  		                    ret += '                        <div class="double-bounce1"></div>';
                            ret += '                  		<div class="double-bounce2"></div>';
                            ret += '                    </div>';
                            ret += '                </div>';
                            ret += '            </div>';
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '</div>';

                            //ret = '<h3>'+results[0].attributes.nome+'</h3>';
                            //ret += '<p>'+results[0].attributes.responsavel+'</p><br>';
                            //ret += '<p>'+results[0].attributes.endereco+'</p><br>';

                            $('#dadosprest').html(ret);
                            
                            var Servico= Parse.Object.extend("servico");
                            var queryS = new Parse.Query(Servico);
                            queryS.equalTo("fornec", prestid);

                            queryS.find({
                                success: function(results) {

                                    var dados = '';
                                    for (var i = 0; i < results.length; i++) { 
                                          var object = results[i];
                                          dados += '<div class="col-sm-6 col-md-4">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<img src="'+object.get('capa')+'" alt="'+object.get('nome')+'">';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+object.get('desc')+'</h3>';
                                            dados += '<p>'+object.get('resumo').substring(0, 300) +'...</p>';
                                            dados += '<p  class="label label-success">A partir de R$ '+object.get('preco')+'</p>';
                                            dados += '<p><a href="#/prest/'+object.get('fornec')+'" class="btn btn-primary" role="button">Prestador</a> <a href="#/servico/'+object.id+'" class="btn btn-default" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';
                                        }

                                     $('#servicosofertados').html(dados);


                                },
                                error: function(error) {
                                        alert("Error: " + error.code + " " + error.message);
                                }
                            });
                        },
                        error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
                    //***********

                   // $state.go('grupo.detail', { grupoId: $scope.id });

                }
            })

            .state('servicos', {
                url: '/servicos/:page',
                templateUrl: 'servicos.html',
                controller: function($scope, $stateParams, $state) {
                    var ret;
                    
                    //$('#servicoheader').html('<div class="page-header"><h1>Serviços ofertados <small>todos</small></h1></div>');
                    
                    var linklogo = 'http://naplanta.imagefly.io/w_30,h_30,f_png/http://naplanta.felipecastro.com.br';

                    $scope.page = $stateParams.page;
                    var page = $stateParams.page;
                    var displayLimit = 50;
                    var qtdetotal = 0;
                    var qtdpaginas = 1;

                    if (page <= 0 || page == '') {page = 1};

                    page--;

                    var Servico= Parse.Object.extend("servico");
                    var query = new Parse.Query(Servico);

                    query.equalTo("ativo", true);
                    query.include("fornecp");

                    query.count({
                                success: function(count) {
                                    qtdetotal = count;
                                    qtdpaginas = Math.round(qtdetotal/displayLimit);

                                    var dadosp = '';
                                    var pagatual;

                                    if (qtdpaginas > 1){
                                        dadosp += '</br>';
                                        dadosp += '<div class="well">';
                                        dadosp += '<nav>';
                                        dadosp += '  <ul class="pagination">';
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/servicos/'+page+'" aria-label="Previous">';
                                        dadosp += '              <span aria-hidden="true">&laquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        for (var t = 0; t < qtdpaginas; t++) {
                                            pagatual = t+1;
                                            (page+1) == pagatual ? dadosp += '<li class="active"><a href="#/servicos/'+pagatual+'">'+pagatual+'</a></li>' : dadosp += '<li><a href="#/servicos/'+pagatual+'">'+pagatual+'</a></li>';
                                        }
                                        dadosp += '      <li>';
                                        dadosp += '          <a href="#/servicos/'+(page+2)+'" aria-label="Next">';
                                        dadosp += '              <span aria-hidden="true">&raquo;</span>';
                                        dadosp += '          </a>';
                                        dadosp += '      </li>';
                                        dadosp += '  </ul>';
                                        dadosp += '</nav>';
                                        dadosp += '</div>';

                                        $('#pagenavigation').html(dadosp);
                                    }

                                },
                                error: function(error) {
                                    // The request failed
                                    qtdetotal = 0;
                                    //alert(error);
                                    $('#listservicos').html(error+' <div class="alert alert-danger" role="alert">Não foi possível retornar dados</div>');
                                }
                            });

                    query.limit(displayLimit);
                    query.skip(page * displayLimit);

                    query.find({
                        success: function(results) {

                            var dados = '';
                            
                            for (var i = 0; i < results.length; i++) { 
                                  var object = results[i];
                                
                                  var fornec = results[i].attributes.fornecp;
                                
                                  dados += '<div class="col-sm-6 col-md-3">';
                                    dados += '<div class="thumbnail">';
                                    dados += '<a href="#/servico/'+object.id+'"><img src="'+object.get('capa')+'" alt="'+object.get('nome')+'"></a>';
                                    dados += '<div class="caption">';
                                    dados += '<h3>'+object.get('desc')+'</h3>';
                                    //dados += '<p>'+object.get('resumo').substring(0, 300) +'...</p>';
                                    dados += '<p><img src="'+linklogo+fornec.get('logo')+'" alt="'+fornec.get('nome')+'" class="img-circle img-responsive" style="display: inline;"> '+fornec.get('nome')+'</p>';
                                    dados += '<div class="preco"><p  class="label label-success">A partir de R$ '+object.get('preco')+'</p></div>';
                                    dados += '<p><a href="#/prest/'+object.get('fornec')+'" class="btn btn-primary" role="button">Prestador</a> <a href="#/servico/'+object.id+'" class="btn btn-default" role="button">Detalhes</a></p>';
                                    dados += '</div>';
                                    dados += '</div>';
                                    dados += '</div>';
                                }

                             $('#listservicos').html(dados);


                        },
                        error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                        }
                    });
                    //***********

                   // $state.go('grupo.detail', { grupoId: $scope.id });

                }
            })

            .state('servicosporfornec', {
                url: '/:fornecID/servicos',
                templateUrl: 'servicos.html',
                controller: function($scope, $stateParams, $state) {

                    $scope.fornecid = $stateParams.fornecID;
                    var fornecid = $stateParams.fornecID;
                    var ret;
                    
                    var Prest= Parse.Object.extend("fornecedor");
                    var queryF = new Parse.Query(Prest);
                    
                    queryF.get(fornecid, {
                        success: function(fornecedor) {
                            
                            
                            $('#servicoheader').html('<div class="page-header"><h1>'+fornecedor.get("nome")+' <small>Serviços ofertados</small></h1></div>');
                            
                            var Servico= Parse.Object.extend("servico");
                            var query = new Parse.Query(Servico);
                            query.equalTo("fornec", fornecid);

                            query.find({
                                success: function(results) {

                                    var dados = '';
                                    for (var i = 0; i < results.length; i++) { 
                                          var object = results[i];
                                          dados += '<div class="col-sm-6 col-md-4">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<img src="'+object.get('capa')+'" alt="'+object.get('nome')+'">';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+object.get('desc')+'</h3>';
                                            dados += '<p>'+object.get('resumo').substring(0, 300) +'...</p>';
                                            dados += '<div class="preco"><p  class="label label-success">A partir de R$ '+object.get('preco')+'</p></div>';
                                            dados += '<p><a href="#/prest/'+object.get('fornec')+'" class="btn btn-primary" role="button">Prestador</a> <a href="#/servico/'+object.id+'" class="btn btn-default" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';
                                        }

                                     $('#listservicos').html(dados);


                                },
                                error: function(error) {
                                        alert("Error: " + error.code + " " + error.message);
                                }
                            });
                            
                        },
                        error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                        }
                    });

                    
                    //***********
                    
                   // $state.go('grupo.detail', { grupoId: $scope.id });

                }
            })

            .state('servico', {
                url: '/servico/:servicoID',
                templateUrl: 'servico.html',
                controller: function($scope, $stateParams, $state) {

                    $scope.servicoid = $stateParams.servicoID;
                    var servicoid = $stateParams.servicoID;
                    var ret;

                    var Servico= Parse.Object.extend("servico");
                    var query = new Parse.Query(Servico);
                    query.equalTo("objectId", servicoid);
                    query.include("fornecp");

                    query.find({
                        success: function(results) {

                            var ret = '';
                            
                            var fornec = results[0].get("fornecp");
                            
                            var linkimage = 'http://naplanta.imagefly.io/w_800,h_300,f_png/http://naplanta.felipecastro.com.br'+results[0].attributes.capa;
                            
                            ret = '<div class="row container-fluid profile-header" style="background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(59%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1))), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += 'background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                            ret += '-moz-background-size: cover;';
                            ret += '-o-background-size: cover;';
                            ret += 'background-size: cover;';
                            ret += 'padding-top:90px;';
                            ret += 'padding-bottom:20px;';
                            ret += 'vertical-align: bottom;">';
                            ret += '<div class="container">';
                            ret += '	<div class="row profile-header-content">';
                            ret += '		<div class="col-md-12 col-sm-12 col-xs-12 profile-about">';
                            ret += '            <h2>'+results[0].attributes.desc+'</h2>';
                            ret += '            <p><i class="glyphicons glyphicons-riflescope"></i> <a href="#/fornec/'+results[0].attributes.fornec+'">'+fornec.get("nome")+'</a></p>';
                            /*ret += '            <p>'+results[0].attributes.endereco+'</p><br>';*/
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '</div>';
                            ret += '</div>';
                            
                            ret += '<div class="row"  style="padding-top: 40px;">';
                            ret += '    <div class="col-sm-10">';
                            ret += '        <div class="panel panel-default">';
                            ret += '            <div class="panel-heading" contenteditable="false">';
                            ret += '                Resumo';
                            ret += '            </div>';
                            ret += '            <div class="panel-body" contenteditable="false">';
                            ret += '                <p>'+results[0].attributes.resumo+'</p>';
                            ret += '            </div>';
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '    <div class="col-sm-2">';
                            ret += '    </div>';
                            ret += '</div>';
                            ret += '<h3>'+results[0].attributes.desc+'</h3>';
                            ret += '<p>'+results[0].attributes.resumo+'</p><br>';
                            ret += '<p>'+results[0].attributes.preco+'</p><br>';

                            $('#dadosservico').html(ret);

                        },
                        error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                        }
                    });
                    //***********

                   // $state.go('grupo.detail', { grupoId: $scope.id });

                }
            })

            .state('feiraimages', {
                url: '/feira/:feiraID/images',
                templateUrl: 'feira-images.html',
                controller: function($scope, $stateParams, $state, $upload) {

                    $scope.ofertaid = $stateParams.ofertaID;

                    $scope.$watch('files', function() {


                      var dados = ''; 

                      for (var i = 0; i < $scope.files.length; i++) {
                            var file = $scope.files[i];

                            console.log(file);



                            var parseFile = new Parse.File(file.name, file);

                            var Image = Parse.Object.extend("ofertaimages");
                            var image = new Image();

                            image.set("oferta", $scope.ofertaid);
                            image.set("image", parseFile);

                            image.save(null, {
                             success: function(oferta) {

                                dados = dados + '<li><img src="'+image.attributes.image._url+'" class="img-thumbnail" alt="Responsive image"></li>';
                                            $('#images').html(dados);
                                 //$state.go('ofertaDet', { ofertaID: oferta.id });
                             },
                             error: function(grupo, error) {
                               // Execute any logic that should take place if the save fails.
                               // error is a Parse.Error with an error code and message.
                               alert('Failed to create new object, with error code: ' + error.message);
                             }
                        });
                        }

                    });
                }
            })

            .state('negocio', {
                url: '/negocio/:negid',
                templateUrl: 'negocio.html',
                controller: function($scope, $stateParams, $state) {

                    $scope.negocioid = $stateParams.negid;
                    var negocioid = $stateParams.negid;
                    var ret;
                    var emp;
                    var fornec;
                    var negocio;
                    var recomenda;
                    var novamente;
                    var cliente;

                    var Negocio = Parse.Object.extend("negocio");
                    var query = new Parse.Query(Negocio);
                    query.equalTo("objectId", negocioid);
                    query.equalTo("ativo", true);
                    query.include("clientep");

                    query.find({
                        success: function(results) {
                            
                            if (results.length > 0){

                                var ret = '';
                                /*ret = '<h3>'+results[0].attributes.emp+'</h3>';
                                ret += '<p>'+results[0].attributes.servico+'</p><br>';
                                ret += '<p>'+results[0].attributes.comentario+'</p><br>';*/

                                emp = results[0].attributes.emp;
                                cliente = results[0].attributes.clientep;
                                negocio = results[0];

                                recomenda = negocio.get("recomenda")?'<span class="label label-primary">Sim</span>':'<span class="label label-danger">Não</span>';
                                novamente = negocio.get("farianovamente")?'<span class="label label-primary">Sim</span>':'<span class="label label-danger">Não</span>';

                                var Servico = Parse.Object.extend("servico");
                                var queryS = new Parse.Query(Servico);
                                queryS.equalTo("objectId", results[0].attributes.servico);

                                queryS.find({
                                    success: function(results) {

                                        fornec = results[0].attributes.fornec;
                                        
                                        var linkimage = 'http://naplanta.imagefly.io/w_800,h_300,f_png/http://naplanta.felipecastro.com.br'+results[0].attributes.capa;
                                        var linkavatar = 'http://naplanta.imagefly.io/w_180,h_180,f_png/http://naplanta.felipecastro.com.br'+results[0].attributes.logo;

                                        ret = '<div class="row container-fluid profile-header" style="background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(59%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1))), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += 'background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += 'background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += 'background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += 'background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,1) 100%), url('+linkimage+') no-repeat center center;-webkit-background-size: cover;';
                                        ret += '-moz-background-size: cover;';
                                        ret += '-o-background-size: cover;';
                                        ret += 'background-size: cover;';
                                        ret += 'padding-top:110px;';
                                        ret += 'padding-bottom:20px;';
                                        ret += 'vertical-align: bottom;">';
                                        ret += '<div class="container">';
                                        ret += '	<div class="row profile-header-content">';
                                        ret += '		<div class="col-md-12 col-sm-9 col-xs-8 profile-about">';
                                        ret += '            <h2>'+results[0].attributes.desc+' <small>Serviço Realizado</small></h2>';
                                        /*ret += '            <p>'+results[0].attributes.endereco+'</p><br>';*/
                                        ret += '        </div>';
                                        ret += '    </div>';
                                        ret += '</div>';
                                        ret += '</div>';
                            

                                        /*ret += '<div class="page-header">';
                                        ret += '<h1>Serviço Realizado <small>'+results[0].attributes.desc+'</small></h1>';
                                        ret += '</div>';*/

                                        ret += '<div style="padding-top: 30px;">';

                                        ret += '    <div class="col-sm-9" style="">';
                                        ret += '     <div class="panel">';
                                        ret += '       <div class="row">';
                                        ret += '        <div class="col-sm-5">';
                                        ret += '            <div class="panel panel-default">';
                                        ret += '                <div class="panel-heading">';
                                        ret += '                    <span><span class="panel-title">Serviço feito por</span>';
                                        ret += '                    <a href="#/prest/'+fornec+'"><span class="glyphicon glyphicon-menu-hamburger pull-right" style="font-size: 150%;"></span></a></span>';
                                        ret += '                </div>';
                                        ret += '                <div class="panel-body" id="dadosfornec">';
                                        ret += '                </div>';
                                        ret += '                <div class="panel-footer" id="footerfornec"></div>';
                                        ret += '            </div>';
                                        ret += '        </div>';
                                        ret += '        <div class="col-sm-1">';
                                        ret += '            <span class="glyphicon glyphicon-arrow-right" aria-hidden="true" style="font-size: 40px;color: lightgrey;top: 100px;left: 10px;"></span>';
                                        ret += '        </div>';
                                        ret += '        <div class="col-sm-6">';
                                        ret += '            <div class="panel panel-default">';
                                        ret += '                <div class="panel-heading">';
                                        ret += '                    <span><span class="panel-title">No empreendimento</span>';
                                        ret += '                    <a href="#/emp/'+emp+'"><span class="glyphicon glyphicon-menu-hamburger pull-right" style="font-size: 150%;"></span></a></span>';
                                        ret += '                </div>';
                                        ret += '                <div class="panel-body" id="dadosemp">';
                                        ret += '                </div>';
                                        ret += '                <div class="panel-footer" id="footeremp"></div>';
                                        ret += '            </div>';
                                        ret += '        </div>';
                                        ret += '        <div class="col-sm-12" style="">';
                                        ret += '            <div class="panel panel-default">';
                                        ret += '                <div class="panel-heading" contenteditable="false">Descrição do serviço</div>';
                                        ret += '                <div class="panel-body" contenteditable="false"><span>'+negocio.get("comentario")+'</span></div>';
                                        ret += '            </div>';
                                        ret += '        </div>';
                                        ret += '        <div class="col-sm-12" style="">';
                                        ret += '            <div class="panel panel-default">';
                                        ret += '                <div class="panel-heading" contenteditable="false">Imagens do servço</div>';
                                        ret += '                <div class="panel-body" contenteditable="false" id="images"></div>';
                                        ret += '            </div>';
                                        ret += '        </div>';
                                        ret += '      </div>';
                                        ret += '     </div>';
                                        ret += '    </div>';

                                        ret += '   <div class="col-sm-3">';
                                        ret += '      <ul class="list-group">';
                                        ret += '        <li class="list-group-item text-muted">Dados</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Custo total</strong></span><span class="label label-success">R$ '+negocio.get("custo")+'</span></li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Data prevista</strong></span>'+negocio.get("dtprevista").getDate()+'/'+negocio.get("dtprevista").getMonth()+'/'+negocio.get("dtprevista").getFullYear()+'</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Data entrega</strong></span>'+negocio.get("dtrealizada").getDate()+'/'+negocio.get("dtrealizada").getMonth()+'/'+negocio.get("dtrealizada").getFullYear()+'</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Unidade</strong></span>'+negocio.get("unidade")+'</li>';

                                        ret += '      </ul>';
                                        ret += '      <ul class="list-group">';
                                        ret += '        <li class="list-group-item text-muted">Notas</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Qualidade</strong></span>'+negocio.get("notaqualidade")+' <small>/10</small></li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Prazo</strong></span>'+negocio.get("notaprazo")+' <small>/10</small></li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Preço</strong></span>'+negocio.get("notapreco")+' <small>/10</small></li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Pós-venda</strong></span>'+negocio.get("notaposvenda")+' <small>/10</small></li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Geral</strong></span>';
                                        var notafinal;

                                        if (negocio.get("nota") < 3){
                                            notafinal = '<span class="label label-danger">'+negocio.get("nota")+'<small>/10</small></span>';
                                        } else if (negocio.get("nota") > 6) {
                                            notafinal = '<span class="label label-success">'+negocio.get("nota")+'<small>/10</small></span>';
                                        } else {
                                            notafinal = '<span class="label label-warning">'+negocio.get("nota")+'<small>/10</small></span>';
                                        }

                                        ret += notafinal+' </li>';

                                        ret += '      </ul>';
                                        ret += '      <ul class="list-group">';
                                        ret += '        <li class="list-group-item text-muted">Recomendações</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Recomenda o serviço?</strong></span>'+recomenda+'</li>';
                                        ret += '        <li class="list-group-item text-right"><span class="pull-left"><strong class="">Faria negócio novamente?</strong></span>'+novamente+'</li>';
                                        ret += '      </ul>';

                                        ret += '      <div class="panel panel-default">';
                                        ret += '            <div class="panel-heading">Cadastrado por</div>';
                                        ret += '            <div class="panel-body"><span id="profile_image" class="pull-left"><img width="30" heigth="30" class="img-circle img-responsive" src="'+cliente.get("avatar")+'"></span></span><span class="pull-left" style="padding-left: 10px;padding-top: 5px;">'+cliente.get("nomecompleto")+'</span></div>';
                                        ret += '       </div>';

                                        ret += '    </div>';


                                        ret += '</div>';

                                        $('#dadosnegocio').html(ret);

                                        //console.log('emp '+emp);
                                        //console.log('fornec '+fornec);

                                        var Fornecedor = Parse.Object.extend("fornecedor");
                                        var query = new Parse.Query(Fornecedor);
                                        query.get(fornec, {
                                          success: function(fornecedor) {
                                            // The object was retrieved successfully.
                                              var dados = '';
                                              var dados2 = '';

                                              dados += '<div class="col-sm-3">';
                                              dados += '    <div id="logofornec">';
                                              dados += '        <img src="'+fornecedor.get("logo")+'" class="img-thumbnail">';
                                              dados += '    </div>';
                                              dados += '</div>';
                                              dados += '<div class="col-sm-9" id="infofornec">';
                                              dados += '        <div class="caption"><h4>'+fornecedor.get("nome")+'</h4>';
                                              dados += '        <span><span class="glyphicon glyphicon-user" aria-hidden="true"></span> '+fornecedor.get("responsavel")+'</span><br>';
                                              dados += '        <span><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> '+fornecedor.get("tel")+'</span><br>';
                                              dados += '        <span><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> '+fornecedor.get("site")+'</span></div>';
                                              dados += '</div>';

                                              dados2 += '<div>';
                                              dados2 += '    <ul class="nav nav-pills" role="tablist">';
                                              dados2 += '        <li role="presentation"><a href="#">Nota <span class="badge">'+fornecedor.get("reputacao")+'</span></a></li>';
                                              dados2 += '        <li role="presentation"><a href="#">Serviços <span class="badge">'+fornecedor.get("servicosofertados")+'</span></a></li>';
                                              dados2 += '        <li role="presentation"><a href="#">Negócios <span class="badge">'+fornecedor.get("negocio_fechado")+'</span></a></li>';
                                              dados2 += '    </ul>';
                                              dados2 += '</div>';

                                              $('#dadosfornec').html(dados);
                                              $('#footerfornec').html(dados2);

                                          },
                                          error: function(object, error) {
                                            // The object was not retrieved successfully.
                                            // error is a Parse.Error with an error code and message.
                                          }
                                        });

                                        var Empreendimento = Parse.Object.extend("empreendimento");
                                        var query = new Parse.Query(Empreendimento);
                                        query.get(emp, {
                                          success: function(empreendimento) {
                                            // The object was retrieved successfully.
                                              var dados = '';
                                              var dados2 = '';

                                              dados += '<div class="col-sm-3">';
                                              dados += '    <div id="logoemp">';
                                              dados += '        <img src="'+empreendimento.get("logo")+'" class="img-thumbnail">';
                                              dados += '    </div>';
                                              dados += '</div>';
                                              dados += '<div class="col-sm-9">';
                                              dados += '    <div id="infoemp">';
                                              dados += '        <h4>'+empreendimento.get("nome")+'</h4>';
                                              dados += '        <span><span class="glyphicon glyphicon-home" aria-hidden="true"></span> '+empreendimento.get("construtora")+'</span><br>';
                                              dados += '        <span><span class="glyphicon glyphicon-tag" aria-hidden="true"></span> '+empreendimento.get("tipo")+'</span><br>';
                                              dados += '        <span><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> '+empreendimento.get("endereco")+'</span></div>';
                                              dados += '</div>';

                                              dados2 += '<div>';
                                              dados2 += '    <ul class="nav nav-pills" role="tablist">';
                                              dados2 += '        <li role="presentation"><a href="#">Unidades <span class="badge">'+empreendimento.get("unidades")+'</span></a></li>';
                                              dados2 += '        <li role="presentation"><a href="#">Serviços <span class="badge"><div id="qtdservicos"></div></span></a></li>';
                                              dados2 += '        <li role="presentation"><a href="#">Negócios <span class="badge"><div id="qtdnegocios"></div></span></a></li>';
                                              dados2 += '    </ul>';
                                              dados2 += '</div>';

                                              $('#dadosemp').html(dados);
                                              $('#footeremp').html(dados2);
                                              
                                              var ServicoEmp = Parse.Object.extend("servico_emp");
                                              var querycs = new Parse.Query(ServicoEmp);
                                              querycs.equalTo("emp", emp);

                                                querycs.count({
                                                    success: function(count) {
                                                        $('#qtdservicos').html(count);
                                                    },
                                                    error: function(error) {
                                                        // The request failed
                                                        $('#qtdservicos').html('0');
                                                    }
                                                });
                                              
                                              var NegocioEmp = Parse.Object.extend("negocio");
                                              var querycn = new Parse.Query(NegocioEmp);
                                              querycn.equalTo("emp", emp);

                                                querycn.count({
                                                    success: function(count) {
                                                        $('#qtdnegocios').html(count);
                                                    },
                                                    error: function(error) {
                                                        // The request failed
                                                        $('#qtdnegocios').html('0');
                                                    }
                                                });
                                          },
                                          error: function(object, error) {
                                            // The object was not retrieved successfully.
                                            // error is a Parse.Error with an error code and message.
                                          }
                                        });

                                        //***** imagens
                                        var Images = Parse.Object.extend("fotos_negocio");
                                        var query = new Parse.Query(Images);
                                        query.equalTo("negocio", negocioid);
                                        query.equalTo("ativa", true);
                                        query.descending('updatedAt');

                                        query.find({
                                          success: function(imagens) {
                                            // The object was retrieved successfully.
                                              var dados = '';

                                              dados += '<div id="links">';

                                              for (var i = 0; i < imagens.length; i++) {

                                                  dados += '<a href="'+imagens[i].get("image")+'" title="'+imagens[i].get("label")+'" data-gallery>';
                                                  dados += '  <img src="http://naplanta.imagefly.io/w_75,h_75,f_png/'+imagens[i].get("image")+'" alt="'+imagens[i].get("label")+'">';
                                                  dados += '</a>';
                                              }

                                              dados += '</div>';

                                              $('#images').html(dados);
                                          },
                                          error: function(object, error) {
                                            // The object was not retrieved successfully.
                                            // error is a Parse.Error with an error code and message.
                                          }
                                        });

                                    },
                                    error: function(error) {
                                            alert("Error: " + error.code + " " + error.message);
                                    }
                                });

                                $('#dadosnegocio').html(ret);
                            
                            } else {
                                $('#dadosnegocio').html('<div class="alert alert-danger" role="alert">Negócio não encontrado!</div>');
                            }

                        },
                        error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                        }
                    });
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller: function($scope, $stateParams, $state) {

                    /*if (Parse.User.current()) {
                        $state.go('home');
                    }*/ 
                }
            })
        
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup.html',
                controller: function($scope, $stateParams, $state) {

                    /*if (Parse.User.current()) {
                        $state.go('home');
                    }*/ 
                }
            })
        
            .state('perfil', {
                url: '/perfil',
                templateUrl: 'perfil.html',
                controller: function($scope, $stateParams, $state) {

                    if (!Parse.User.current()) {
                        $state.go('login');
                    }
                    
                    //console.log('user');
                    //console.log(Parse.User.current());
                    
                    var User = Parse.Object.extend("User");
                    var query = new Parse.Query(User);
                    query.get(Parse.User.current().id, {
                    
                        success: function(user) {
                        
                            //console.log('user retorno');
                            //console.log(user);
                            
                            var ret = '';
                            
                            ret += '<div class="container">';
                            ret += '    <div class="row">';
                            ret += '        <div class="col-sm-10">';
                            ret += '            <div class="page-header">';
                            ret += '                <h1>'+user.get("nomecompleto")+' <small>'+user.get("email")+'</small></h1>';
                            ret += '             </div>';
                            ret += '             <button type="button" class="btn btn-primary">Editar</button>  <a href="#login" onclick="desloga();"><button type="button" class="btn btn-danger">Sair</button></a>';
                            ret += '             <br>';
                            ret += '        </div>';
                            ret += '        <div class="col-sm-2">';
                            ret += '            <img title="profile image" class="img-circle img-responsive" src="'+user.get("avatar")+'">';
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '    <br>';
                            ret += '    <div class="row">';
                            ret += '        <div class="col-sm-3">';
                            ret += '            <ul class="list-group">';
                            ret += '                <li class="list-group-item text-muted" contenteditable="false">Perfil</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Criado em</strong></span> '+user.createdAt.getDate()+'/'+user.createdAt.getMonth()+'/'+user.createdAt.getFullYear()+'</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Nome</strong></span> '+user.get("nomecompleto")+'</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Email </strong></span> '+user.get("email")+'</li>';
                            ret += '            </ul>';
                            ret += '            <ul class="list-group">';
                            ret += '                <li class="list-group-item text-muted">Atividade <i class="fa fa-dashboard fa-1x"></i></li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Imóveis</strong></span> <span id="qtdemp">0</span></li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Negócios</strong></span> <span id="qtdneg">0</span</li>';
                            ret += '                <li class="list-group-item text-right"><span class="pull-left"><strong class="">Avaliações</strong></span> 37</li>';
                            ret += '            </ul>';
                            ret += '        </div>';
                            ret += '        <div class="col-sm-9" contenteditable="false" style="">';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false">Meus imóveis</div>';
                            ret += '                <div class="panel-body" id="listmyemps">';
                            ret += '                </div>';
                            ret += '            </div>';
                            ret += '            <div class="panel panel-default">';
                            ret += '                <div class="panel-heading" contenteditable="false">Meus negócios</div>';
                            ret += '                <div class="panel-body" id="listmynegocios">';
                            ret += '                </div>';
                            ret += '            </div>';
                            ret += '        </div>';
                            ret += '    </div>';
                            ret += '</div>';


                            $('#conteudoperfil').html(ret);
                            
                            var Imoveis = Parse.Object.extend("useremp");
                            var query = new Parse.Query(Imoveis);
                            query.equalTo("user", Parse.User.current().id);
                            query.include("empp");

                            query.count({
                                success: function(count) {
                                    $('#qtdemp').html(count);
                                },
                                error: function(error) {
                                    // The request failed
                                    $('#qtdemp').html('0');
                                }
                            });
                            
                            query.find({
                                success: function(results) {
                                    
                                    //console.log(results);
                                    
                                    var dados = '';
                                    
                                    if (results.length > 0){  
                                        
                                        dados += '      <div class="row">';

                                        for (var i = 0; i < results.length; i++) { 
                                            
                                            var object = results[i].get("empp");
                                            /*dados += '<div><div><span>'+object.get('desc')+'</span><br><span>'+object.get('preco')+'</span><br><span id="fornec'+object.get('fornec')+'"></span></div>';*/

                                            dados += '<div class="col-sm-6 col-md-3">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<a href="#/emp/'+object.id+'" ><img src="'+object.get('logo')+'" alt=""></a>';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+object.get('nome')+'</h3>';
                                            dados += '<p  class="label label-success">'+object.get('tipo')+'</p>';
                                            dados += '<p>'+object.get('endereco')+'</p>';
                                            dados += '<p><a href="#/emp/'+object.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';

                                        }

                                        dados += '         </div>';
                                        
                                    } else {
                                        dados += '<div class="alert alert-warning" role="alert">Nenhum imóvel cadastrado ainda.</div>';
                                    }
                                    
                                    $('#listmyemps').html(dados); 
                                },
                                error: function(error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                }
                            });
                            
                            var Negocios = Parse.Object.extend("negocio");
                            var query = new Parse.Query(Negocios);
                            query.equalTo("cliente", Parse.User.current().id);
                            //query.include("clientep");
                            query.include("servicop");
                            query.include("empp");

                            query.count({
                                success: function(count) {
                                    $('#qtdneg').html(count);
                                },
                                error: function(error) {
                                    // The request failed
                                    $('#qtdneg').html('0');
                                }
                            });
                            
                            query.find({
                                success: function(results) {
                                    
                                    console.log(results);
                                    
                                    var dados = '';
                                    
                                    if (results.length > 0){  
                                        
                                        dados += '      <div class="row">';

                                        for (var i = 0; i < results.length; i++) { 
                                            
                                            var negocio = results[i];
                                            var servico = results[i].get("servicop");
                                            var emp = results[i].get("empp");
                                          
                                            dados += '<div class="col-sm-6 col-md-3">';
                                            dados += '<div class="thumbnail">';
                                            dados += '<a href="#/negocio/'+negocio.id+'" ><img src="'+servico.get('capa')+'" alt=""></a>';
                                            dados += '<div class="caption">';
                                            dados += '<h3>'+servico.get('desc')+'</h3>';
                                            dados += '<p  class="label label-success">Nota '+negocio.get('nota')+'</p>';
                                            dados += '<p>'+emp.get('nome')+'</p>';
                                            dados += '<p><a href="#/negocio/'+negocio.id+'" class="btn btn-default btn-block" role="button">Detalhes</a></p>';
                                            dados += '</div>';
                                            dados += '</div>';
                                            dados += '</div>';

                                        }

                                        dados += '         </div>';
                                        
                                    } else {
                                        dados += '<div class="alert alert-warning" role="alert">Nenhum negócio cadastrado ainda.</div>';
                                    }
                                    
                                    $('#listmynegocios').html(dados); 
                                },
                                error: function(error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                }
                        });
                    },
                    error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                            $state.go('login');
                    }
                });
                    
                }
            })

            .state('novoemp', {
                url: '/empreendimento/novo',
                templateUrl: 'empnovo.html',
                controller: function($scope, $stateParams, $state) {
                    
                    if (!Parse.User.current()) {
                        $state.go('login');
                    }

                }
            })
        
            .state('novoprest', {
                url: '/prestador/novo',
                templateUrl: 'prestnovo.html',
                controller: function($scope, $stateParams, $state) {
                    
                    if (!Parse.User.current()) {
                        $state.go('login');
                    }

                }
            })
        
            .state('novoservicoofertado', {
                url: '/servicoofertado/novo/:prestId',
                templateUrl: 'serviconovo.html',
                controller: function($scope, $stateParams, $state) {
                    
                    if (!Parse.User.current()) {
                        $state.go('login');
                    }
                    
                    $scope.prestid = $stateParams.prestId;
                    var prest_id = $stateParams.prestId;
                    
                    console.log(prest_id);
                    
                    if (!prest_id){
                        $state.go('servicos');
                    }
                    
                    if (prest_id=''){
                        $state.go('servicos');
                    }
                    
                    
                    
                    var Prest = Parse.Object.extend("fornecedor");
                    var query = new Parse.Query(Prest);
                    query.equalTo("ativo", true);
                    query.equalTo("cadastropor", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
                    //query.equalTo("objectId", $stateParams.prestId);
                    
                    query.get( $stateParams.prestId, {
                      success: function(prestador) {
                        // The object was retrieved successfully.
                         /// console.log("prestador");
                            //console.log(results);
                          
                          if (!prestador.length>0){
                            $state.go('servicos');
                          }
                          
                          $('#lblfornec').html(prestador.get("nome")); 
                          $('#fonecid').val($stateParams.prestId);
                          
                      },
                      error: function(object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                          console.log("Erro: " + error.message);
                      }
                    });
                        

                    //query.equalTo("ativo", true);
                    //query.equalTo("cadastropor", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
                    //query.equalTo("id", prestid);


                }
            });


        $locationProvider.html5Mode(false);

    })

    .controller('formEmpController', ['$scope', function($scope, $state, $stateParams) {

        $scope.master = {};

      $scope.update = function(emp) {
        $scope.master = angular.copy(emp);
          console.log('entrou');
          console.log(emp);
          console.log($scope.master);
      };

      $scope.reset = function() {
        $scope.emp = angular.copy($scope.master);
      };

      $scope.reset();

    /*    		$scope.processForm = function() {

                var Oferta = Parse.Object.extend("oferta");
                var oferta = new Oferta();

                console.log($scope.formData);

                oferta.set("titulo", $scope.formData.nome);
                oferta.set("descricao", $scope.formData.desc);
                oferta.set("preco", parseFloat($scope.formData.preco));
                oferta.set("aberta", true);
                oferta.set("negociando", false);
                oferta.set("aceitatroca", true);
                oferta.set("anunciante", Parse.User.current().id);
                oferta.set("grupo", $scope.grupoid);

                oferta.save(null, {
                  success: function(oferta) {
                        $scope.ofertanome = $scope.formData.nomej
                            $state.go('Ofertaimages', { ofertaID: oferta.id });
                  },
                  error: function(grupo, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                  }
                });
               }*/
    }])
    
    .controller('addEmpController', function($scope, $http, $log, promiseTracker, $timeout) {

        $scope.progress = promiseTracker();

        // Form submit handler.
        $scope.submit = function(form) {
            // Trigger validation flag.
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return;
            }
            
            $scope.progress.addPromise($promise);
        
        };
        
    })

    .controller('DropdownCtrl', function ($scope, $log) {

      $scope.status = {
        isopen: false
      };

      $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
      };

      $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
      };
    });