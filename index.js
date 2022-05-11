var app = angular.module('myApp', [ "ui.router" ]);  

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url : '/',
            templateUrl : "home.html",
            controller : "homeCtrl"
        })
        .state('Login', {
            url : '/login',
            template : "<h1>Login Page</h1>",
            controller : "LoginCtrl"
        })
        .state('Signup', {
            url : '/signup',
            template : "<h1>Signup Page</h1>",
            controller : "SignupCtrl"
        }); 
  
    $urlRouterProvider.otherwise("/");
});

app.controller("homeCtrl",function($scope){
    $scope.message = "hello world";
});