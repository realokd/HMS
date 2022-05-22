var app = angular.module("myApp", ["ui.router"]);
window.baseUrl = "http://192.168.85.170:8000";
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "home.html",
      controller: "homeCtrl",
    })
    .state("account", {
      url: "/account",
      templateUrl: "patient/index.html",
      controller: "accountCtrl",
    })
    .state("docreg", {
      url: "/d   ",
      templateUrl: "doctor/index.html",
      controller: "docregCtrl",
    })
    .state("pdashb", {
      url: "/pd   ",
      templateUrl: "patient/dashb.html",
      params: {
        pdata: null,
      },
      controller: "pdashbCtrl",
    })
    .state("bookapt", {
      parent: "pdashb",
      url: "/bookapt",
      templateUrl: "patient/bookapt.html",
      controller: "bookaptCtrl",
    })
    .state("presc", {
      parent: "pdashb",
      url: "/presc",
      templateUrl: "patient/presc.html",
      controller: "prescCtrl",
    });
  $urlRouterProvider.otherwise("/");
});
app.controller("homeCtrl", function ($scope) {});

app.controller("docregCtrl", function ($scope, $http) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.remove("none");
  $scope.message = "hello login";
  $scope.hidef = true;
  $scope.funcc = function () {
    if ($scope.hidef == true) {
      $scope.hidef = false;
      return;
    }
    $scope.hidef = true;
  };
  $http
    .get(window.baseUrl + "/doctor/speciality_code")
    .then(function (response) {
      $scope.spec = response.data;
    });
  $scope.func = function () {
    datee = new Date($scope.dob).toDateString();

    dat = {
      fname: $scope.name,
      lname: "",
      email: $scope.email,
      phone: $scope.phno,
      special_code: $scope.speciality,
      dob: datee,
      fees: $scope.consult,
      qualification: $scope.qualf,
      exp: $scope.exp,
      address: $scope.add,
      gender: $scope.gender,
      passw: $scope.pass,
      cpassw: $scope.cpass,
    };
    console.log(dat);
    $http({
      method: "POST",
      url: "http://192.168.85.170:8000/doctor/register",
      data: dat,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data["success"],
          showConfirmButton: true,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.data["error"],
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };
  $scope.loginfunc = function () {
    $http({
      method: "POST",
      url: "http://192.168.85.170:8000/doctor/login",
      data: { doc_id: $scope.did, passw: $scope.lpass },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data["success"],
          showConfirmButton: true,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.data["error"],
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };
});
app.controller("pdashbCtrl", function ($scope, $http) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.add("none");

  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
      console.log(over.style.display);
    } else {
      over.style.display = "flex";
      console.log(over.style.display);
    }
  };
  $http
    .get("http://192.168.85.170:8000/patient/dashboard", {
      withCredentials: true,
    })
    .then(function (response) {
      $scope.d = response.data;
      console.log($scope.d.error);
    });
});
app.controller("bookaptCtrl", function ($scope, $http) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
      console.log(over.style.display);
    } else {
      over.style.display = "flex";
      console.log(over.style.display);
    }
  };
  $scope.show = true;
  $scope.changeshow = function () {
    if ($scope.show == true) {
      $scope.show = false;
    } else {
      $scope.show = true;
    }
  };
  $scope.paybtn = function () {
    document.getElementById("overlay").style.display = "none";
    $scope.show = true;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Appointment is Booked",
      showConfirmButton: false,
      timer: 3000,
    });
  };
  $http
    .get("http://192.168.85.170:8000/doctor/speciality_code")
    .then(function (response) {
      $scope.d = response.data;
      console.log($scope.d);
    });
});
app.controller("prescCtrl", function ($scope, $http) {
  console.log("om");
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
      console.log(over.style.display);
    } else {
      over.style.display = "flex";
      console.log(over.style.display);
    }
  };
  $scope.show = true;
  $scope.changeshow = function () {
    if ($scope.show == true) {
      $scope.show = false;
    } else {
      $scope.show = true;
    }
  };
});
app.controller("accountCtrl", function ($scope, $http, $state) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.remove("none");
  $scope.message = "hello login";
  $scope.hidef = true;
  $scope.func = function () {
    if ($scope.hidef == true) {
      $scope.hidef = false;
      return;
    }
    $scope.hidef = true;
  };

  $scope.submit = function () {
    date = new Date($scope.dob).toDateString();
    data = {
      fname: $scope.fname,
      passw: $scope.pass,
      dob: date,
      gender: $scope.gender,
      address: $scope.add,
      history: $scope.mhistory,
      cpassw: $scope.cpass,
      aadhar: $scope.aadno,
      lname: $scope.lname,
      phone: $scope.phno,
      email: $scope.email,
    };
    console.log(data);
    $http({
      method: "POST",
      url: "http://192.168.85.170:8000/patient/register",
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data["success"],
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.data["error"],
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };
  $scope.login = function () {
    date = new Date($scope.dob).toUTCString();
    dataa = { aadhar: $scope.aadharnum, passw: $scope.password };
    $http({
      method: "POST",
      url: "http://192.168.85.170:8000/patient/login",
      data: dataa,
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data["success"],
          showConfirmButton: false,
          timer: 3000,
        });
        $state.go("pdashb", { pdata: response.data });
        console.log(response);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.data["error"],
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };
});
