var app = angular.module("myApp", ["ui.router"]);
app.run(function ($rootScope) {
  $rootScope.crrdate = new Date().toISOString().split("T")[0];
});
window.baseUrl = "https://10.21.85.83:8000";
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
      url: "/d",
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
    })
    .state("ddashb", {
      url: "/ddashb   ",
      templateUrl: "doctor/ddashb.html",
      controller: "ddashbCtrl",
    })
    .state("rlogin", {
      url: "/rlogin   ",
      templateUrl: "receptionist/index.html",
      controller: "rloginCtrl",
    })
    .state("pending", {
      parent: "ddashb",
      url: "/pendingapts",
      templateUrl: "doctor/pending.html",
      controller: "pendingCtrl",
    })
    .state("resch", {
      parent: "ddashb",
      url: "/resch",
      params: {
        id: null,
      },
      templateUrl: "doctor/resch.html",
      controller: "reschCtrl",
    })
    .state("prev", {
      parent: "ddashb",
      url: "/prevapts",
      templateUrl: "doctor/prev.html",
      controller: "prevCtrl",
    })
    .state("checked", {
      parent: "ddashb",
      url: "/checked",
      params: { id: null },
      templateUrl: "doctor/checked.html",
      controller: "checkedCtrl",
    })
    .state("plist", {
      parent: "ddashb",
      url: "/plist",
      params: { id: null, phone: null, name: null },
      templateUrl: "doctor/plist.html",
      controller: "plistCtrl",
    })
    .state("rdashb", {
      url: "/rdashb",
      templateUrl: "receptionist/rdashb.html",
      controller: "rdashbCtrl",
    })
    .state("rdoc", {
      parent: "rdashb",
      url: "/rdoc",
      templateUrl: "receptionist/rdoc.html",
      controller: "rdocCtrl",
    })
    .state("rpat", {
      parent: "rdashb",
      url: "/rpat",
      templateUrl: "receptionist/rpat.html",
      controller: "rpatCtrl",
    })
    .state("report", {
      parent: "rdashb",
      url: "/r1",
      templateUrl: "receptionist/report.html",
      controller: "reportCtrl",
    })
    .state("reportt", {
      parent: "rdashb",
      url: "/r2",
      templateUrl: "receptionist/reportt.html",
      controller: "reporttCtrl",
    });
  $urlRouterProvider.otherwise("/");
});
app.controller("homeCtrl", function ($scope) {});
app.controller("reporttCtrl", function ($scope, $http, $state) {
  $http
    .get(window.baseUrl + "/doctor/speciality_code/")
    .then(function (response) {
      $scope.spec = response.data;
      $scope.speciality = 0;
    });
  $scope.dwise = function () {
    var sd = new Date($scope.sdate).toDateString();
    var ed = new Date($scope.edate).toDateString();

    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/report_date_wise/",
      withCredentials: true,
      data: { start_date: sd, end_date: ed, code: $scope.speciality },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (res) {
      $scope.app = res.data.appointments;
      console.log($scope.app);
    });
  };
});

app.controller("rloginCtrl", function ($scope, $state, $http) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.remove("none");
  $scope.rtomodel = "";
  $scope.rmodel = "";

  $scope.loginbtn = function () {
    console.log("hello");
    if ($scope.rmodel == "" || $scope.rtomodel == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fields Can't be Empty",
      });
      return;
    }
    console.log($scope.rmodel);
    console.log($scope.rtomodel);

    value = { username: $scope.rmodel, passw: $scope.rtomodel };

    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/login/",
      withCredentials: true,
      data: value,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data["success"],
          showConfirmButton: true,
        });
        $state.go("rdashb");
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Credentials",
        });
      });
  };
  $scope.logout = function () {
    $http.get(window.baseUrl + "receptionist/logout/").then(function (res) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged Out",
        showConfirmButton: true,
      });
    });
  };
});

app.controller("rpatCtrl", function ($scope, $http, $state) {
  $scope.rpatinit = function () {
    $http
      .get(window.baseUrl + "/receptionist/all_patients/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.patdetails = response.data.patients;
        // console.log($scope.patdetails);
      });
  };
  $scope.rpatinit();

  $scope.hitpehit = function (id) {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/patient_details/",
      data: { patient_id: id },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      $scope.patdetails = response.data.doc_details;
      // console.log(response.data);
      $scope.upcomingapts = response.data.upcoming_appointments;
      $scope.pdetails = response.data.patient_details;
      $scope.pastapts = response.data.past_appointments;
      $scope.doctors = response.data.doctors;
      // console.log($scope.upcomingapts);
      // console.log($scope.pastapts);
      // console.log($scope.pdetails);
      // console.log($scope.doctors);
    });
  };
});
app.controller("rdocCtrl", function ($scope, $http) {
  $scope.hint = "";

  $http
    .get(window.baseUrl + "/doctor/speciality_code/")
    .then(function (response) {
      $scope.spec = response.data;
      $scope.speciality = 0;
      // console.log($scope.spec);
    });
  // $scope.changefunc = function () {
  //   console.log($scope.speciality);
  // };
  $scope.changefunc = function (
    value = { code: $scope.speciality, hint: $scope.hint }
  ) {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/doctor_search/",
      withCredentials: true,
      data: value,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      $scope.docdata = response.data.result;
      // console.log($scope.docdata);
    });
  };
  $scope.viewall = function (value) {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/doctor_past_apts/",
      withCredentials: true,
      data: { doc_id: value },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      $scope.viewall = response.data.past_appointments;
      // console.log($scope.viewall);
    });
  };
  $scope.changefunc({ code: 0, hint: "" });
  $scope.requests = function () {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/doctor_details/",
      data: { doc_id: id },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function () {});
  };
  $scope.hitpehit = function (id) {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/doctor_details/",
      data: { doc_id: id },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      $scope.docdetails = response.data.doc_details;
      // console.log(response.data);
      $scope.upcomingapts = response.data.upcoming_appointments;
      $scope.pdetails = response.data.patients;
      $scope.pastapts = response.data.past_appointments;
    });
  };
});

app.controller("docregCtrl", function ($scope, $http, $state) {
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
    .get(window.baseUrl + "/doctor/speciality_code/")
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
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/register/",

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
  $scope.doc_id = "";
  $scope.lpass = "";
  $scope.loginfunc = function () {
    if ($scope.did == "" || $scope.lpass == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fields Can't be Empty",
      });
      return;
    }
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/login/",
      withCredentials: true,
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
        $state.go("ddashb");
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
app.controller("ddashbCtrl", function ($scope, $http, $state) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.add("none");

  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
  $scope.printpresc = function () {
    var fram = window.frames["prescpage"].contentWindow;
    fram.print();
  };
  $scope.viewpresbtn = function (val) {
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/get_presc/",
      data: { app_id: val },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (res) {
      var fram = window.frames["prescpage"];
      fram.srcdoc = res.data;
    });
  };
  $scope.pendingbtn = function () {
    $http
      .get(window.baseUrl + "/doctor/pending_apps/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.pendingapts = response.data.pending_approval;
        if ($scope.pendingapts.length == 0) {
          Swal.fire("There is no appointment pending for approval");
        } else {
          $scope.overlayfunc();
        }
      });
  };
  $scope.prevbtn = function () {
    $http
      .get(window.baseUrl + "/doctor/past_apps/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.pastapts = response.data.past_appointments;
        console.log($scope.pastapts);
        if ($scope.pastapts.length == 0) {
          Swal.fire("There is no Past appointment pending for approval");
        } else {
          $scope.overlayfunc();
        }
      });
  };
  $scope.reschbtn = function (value) {
    $scope.overlayfunc();
    $state.go("resch", {
      id: value,
    });
  };
  $scope.logout = function () {
    $state.go("docreg");
    $http
      .get(window.baseUrl + "/doctor/logout/", {
        withCredentials: true,
      })
      .then(function (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Successfully Logged out",
          showConfirmButton: true,
        });
      });
  };
  $scope.dashhitd = function () {
    $http
      .get(window.baseUrl + "/doctor/dashboard/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.plist = response.data.patients;
        $scope.docname = response.data.doc_name;
        $scope.scapts = response.data.upcoming_appointments;
        // $scope.plist = response.data.patients;
      })
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unauthorized Access",
          timer: 2000,
        });
        $state.go("docreg");
      });
  };
  $scope.dashhitd();
});
app.controller("pendingCtrl", function ($scope, $state, $http) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
  $scope.approve = function (id, status) {
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/change_status/",
      data: { app_id: id, status: status },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function () {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Staus Updated",
        showConfirmButton: true,
      });
      $scope.overlayfunc();
      $scope.dashhitd();
    });
  };
});
app.controller("reschCtrl", function ($scope, $state, $http, $stateParams) {
  $scope.reschapt = function (value) {
    var ta = new Date($scope.resch_date).toLocaleString();
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/reshedule_app/",
      data: { app_id: $stateParams.id, datetime: ta },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function () {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Appointmen is Rescheduled",
        showConfirmButton: true,
      });
      $scope.overlayfunc();
      $scope.dashhitd();
    });
  };
});
app.controller("plistCtrl", function ($scope, $http, $stateParams) {
  $scope.p_phone = $stateParams.phone;
  $scope.p_id = $stateParams.id;
  $scope.p_name = $stateParams.name;

  $scope.bookap = function () {
    var aptbdate = new Date($scope.datetimee).toLocaleString();

    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/book_appointment/",
      data: { patient_id: $scope.p_id, datetime: aptbdate },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Appointmeent is Booked",
        showConfirmButton: true,
      });
      $scope.med_history = response.data.patient_details.history;
      $scope.allapts = response.data.appointment_details;
      $scope.dashhitd();
      // $scope.overlayfunc();
    });
  };
  $http({
    method: "POST",
    url: window.baseUrl + "/doctor/patient_details/",
    data: { patient_id: $scope.p_id },
    withCredentials: true,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).then(function (response) {
    $scope.med_history = response.data.patient_details.history;
    $scope.allapts = response.data.appointment_details;
  });
  $scope.show = false;
  $scope.book = function () {
    document.getElementById("book").classList.remove("w-100");
    document.getElementById("book").classList.remove("h-100");
    document.getElementById("book").classList.add("w-50");
    document.getElementById("book").classList.add("h-50");
    $scope.show = true;
  };

  $scope.about = function () {
    document.getElementById("book").classList.remove("w-50");
    document.getElementById("book").classList.remove("h-50");
    document.getElementById("book").classList.add("w-100");
    document.getElementById("book").classList.add("h-100");
    $scope.show = false;
  };
});

app.controller("checkedCtrl", function ($scope, $http, $stateParams) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
  $scope.presarr = [];
  $scope.pres = "";
  $scope.addpres = function () {
    if ($scope.pres == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Prescription Can't be Empty",
      });
      return;
    }
    for (var i = 0; i < $scope.presarr.length; i++) {
      if ($scope.presarr[i] == $scope.pres) {
        Swal.fire("This Prescription already exists");
        return;
      }
    }
    $scope.presarr.push($scope.pres);
    $scope.pres = "";
  };
  $scope.del = function (val) {
    $scope.presarr.splice(val, 1);
  };
  $scope.submitpres = function () {
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/add_presc/",
      data: { app_id: $stateParams.id, presc: $scope.presarr },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function () {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Prescriptiohn is Added",
        showConfirmButton: true,
      });
      $scope.overlayfunc();
      $scope.dashhitd();
    });
  };
});

app.controller("prevCtrl", function ($scope, $state, $http) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
});

app.controller("pdashbCtrl", function ($scope, $http, $state) {
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.add("none");

  var aajtarik = new Date();

  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
  $scope.delnot = function (val) {
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/mark_as_read/",
      data: { noti_id: val },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (res) {
      $scope.notify();
    });
  };
  $scope.notify = function () {
    $http
      .get(window.baseUrl + "/patient/get_notifications/", {
        withCredentials: true,
      })
      .then(function (res) {
        $scope.notis = res.data.notis;
        console.log($scope.notis);
      });
  };
  $scope.aptdetails = function () {
    $http
      .get(window.baseUrl + "/patient/dashboard/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.d = response.data.patient_details;
        $scope.aptDetails = response.data.appointment_details;
        $scope.aptstatus = console.log(response.data.patient_details);
        var dobtarik = new Date($scope.d.dob);
        var ho = new Date(dobtarik - aajtarik).getFullYear();
        $scope.age = ho;
      })
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unauthorized Access",
          timer: 2000,
        });
        $state.go("account");
      });
  };
  $scope.aptdetails();

  $scope.logout = function () {
    $http.get(window.baseUrl + "/patient/logout/", {
      withCredentials: true,
    });
    $state.go("account");
  };
  $scope.presbtn = function () {
    console.log("hi");
    $http
      .get(window.baseUrl + "/patient/past_appointments/", {
        withCredentials: true,
      })
      .then(function (res) {
        // console.log(res.data);
        $scope.past_a = res.data.checked_appointments;
        console.log($scope.past_a);
      });
  };
  $scope.printpresc = function () {
    var fram = window.frames["prescpage"].contentWindow;
    fram.print();
  };
  $scope.viewpresbtn = function (val) {
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/get_presc/",
      data: { app_id: val },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (res) {
      var fram = window.frames["prescpage"];
      fram.srcdoc = res.data;
    });
  };
  $scope.delapt = function (value) {
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/cancel_appointment/",
      data: { app_id: value },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function () {
      Swal.fire({
        position: "center",
        icon: "success",
        title:
          "Appointmen is deleted. Your Payment will be refuncded within 24 hours",
        showConfirmButton: true,
      });
      $scope.aptdetails();
    });
  };
});
app.controller("bookaptCtrl", function ($scope, $http) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
    }
  };
  $scope.show = true;
  $scope.changeshow = function () {
    if ($scope.show == true) {
      $scope.show = false;
      var tarik = new Date($scope.datetime);
      $scope.aptTime = `${tarik.getDate()}/${tarik.getMonth()}, ${tarik.getHours()}:${tarik.getMinutes()}`;
    } else {
      $scope.show = true;
    }
  };
  $scope.paybtn = function () {
    document.getElementById("overlay").style.display = "none";
    var dat = new Date($scope.datetime).toLocaleString();
    $scope.show = true;
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/book_appointment/",
      data: { datetime: dat, doc_id: $scope.doctorname },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    }).then(function (response) {
      $scope.doctorsli = response.data;
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Appointment is Booked",
        showConfirmButton: false,
        timer: 3000,
      });
      $scope.aptdetails();
    });
  };
  $scope.dynamicdd = function (value) {
    $http({
      method: "POST",
      url: window.baseUrl + "/doctor/special_docs/",
      data: { code: value },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    }).then(function (response) {
      $scope.doctorsli = response.data;
    });
  };
  $http
    .get(window.baseUrl + "/doctor/speciality_code/")
    .then(function (response) {
      $scope.spec = response.data;
    });
});
app.controller("prescCtrl", function ($scope, $http) {
  $scope.overlayfunc = function () {
    var over = document.getElementById("overlay");
    if (over.style.display == "flex") {
      over.style.display = "none";
    } else {
      over.style.display = "flex";
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
  $http
    .get(window.baseUrl + "/patient/past_appointments/", {
      withCredentials: true,
    })
    .then(function (res) {});
});
app.controller("rdashbCtrl", function ($scope, $http, $state) {
  // console.log($scope.crrdate);
  var nav = document.getElementsByClassName("navbar")[0];
  nav.classList.add("none");
  $scope.refresh = function () {
    $http
      .get(window.baseUrl + "/receptionist/dashboard/", {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response.data);
        $scope.schapts = response.data.upcoming_appointments;
      })
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unauthorized Access",
          timer: 2000,
        });
        $state.go("rlogin");
      });
  };
  $scope.refresh();
  $scope.logoutbtn = function () {
    $http
      .get(window.baseUrl + "/receptionist/logout/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.requests = response.data.pending_apts;
      });
  };
  $scope.req = function () {
    $http
      .get(window.baseUrl + "/receptionist/pending_appointments/", {
        withCredentials: true,
      })
      .then(function (response) {
        $scope.requests = response.data.pending_apts;
      });
  };

  $scope.status = function (id, st) {
    $http({
      method: "POST",
      url: window.baseUrl + "/receptionist/change_status/",
      data: { app_id: id, status: st },
      withCredentials: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (response) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Status updated",
        showConfirmButton: true,
        timer: 3000,
      });
      $scope.req();
    });
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
  $scope.fname = "";
  $scope.lname = "";
  $scope.add = "";
  $scope.email = "";
  $scope.phno = "";
  $scope.cpass = "";
  $scope.gender = "";
  $scope.aadno = "";
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

    if (
      $scope.fname == "" ||
      $scope.lname == "" ||
      $scope.add == "" ||
      $scope.email == "" ||
      $scope.phno == "" ||
      $scope.cpass == "" ||
      $scope.gender == "" ||
      $scope.aadno == ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fields Can't be empty",
      });
      return;
    }

    $http({
      method: "POST",
      url: window.baseUrl + "/patient/register/",
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
        });
      });
  };

  $scope.login = function () {
    if (
      $scope.aadharnum == undefined ||
      $scope.password == undefined ||
      $scope.aadharnum.length == "" ||
      $scope.password == ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fields Can't be Empty",
      });
      return;
    }
    // date = new Date($scope.dob).toUTCString();
    dataa = { aadhar: $scope.aadharnum, passw: $scope.password };
    $http({
      method: "POST",
      url: window.baseUrl + "/patient/login/",
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
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.data["error"],
        });
      });
  };
});
