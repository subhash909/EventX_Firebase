//firebase code.............................................................................................................

window.URL = window.URL || window.webkitURL;
var uid;
var ev_data;
var u_pic;
var u_name;
<!--User authontication.........................................................................................-->

initApp = function() {

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      uid = user.uid;
      u_pic = user.photoURL;
      u_name = user.displayName;
      $("#Loginsignup").hide();
      $("#profilebtn").show();
      $("#signout").show();
      $(".div1").show();
      $(".intere").show();
      notify();


    } else {
      // User is signed out.
      $("#loginbtn").show();
      $("#Loginsignup").show();
      $("#profilebtn").hide();
      $("#signout").hide();
      $(".div1").hide();
      $(".intere").hide();
      $("#comm_form").hide();
    }


    //retrive the details of event from firebase......................................................................................
    var eventid = get("eventid");
    firebase.database().ref("Event").orderByKey().equalTo(eventid).on('child_added', function(data) {
      ev_data = data;
      //alert(data.val().name);
      var date1 = new Date(data.val().start_date_time);
      var date2 = new Date(data.val().end_date_time);
      var imgurl = "img/header.jpg";
      if (data.val().image != null) {
        imgurl = data.val().image;
      }
      $("#eventimg").attr("src", imgurl);
      $("#eventdetails").append("<h1><b>" + data.val().name + "</b></h1><h3>" + date1.toDateString() + " to " + date2.toDateString() + "</h3><h3>" + date1.toTimeString().substring(0, 5) + " to " + date2.toTimeString().substring(0, 5) + "</h3><h3>" + data.val().state + ", INDIA</h3>");

      var zz = data.val().description.split("\n");
      for (var i = 0; i < zz.length; i++) {
        $("#desc").append("<p>" + zz[i] + "</p>");

      }
      $("#venue1").html(data.val().venue);
      $("#h_detl").append("<h4>" + data.val().h_name + "</h4><h5>Email : " + data.val().email + "</h5>");
      if (data.val().phone != "") {
        $("#h_detl").append("<h5>Phone : " + data.val().phone + "</h5>");

      }
      if (uid == data.val().uid) {
        $("#eventdetails").append("<div class='col-lg-12' align='right'><a href='#themoda' data-toggle='modal' id='eventform' class='btn btn-primary btn-xl page-scroll'><i class='fa fa-pencil' aria-hidden='true'></i> Edit Event</a></div>");

      }


      //Share on fb...........................................................................................................
      var fb_temp = "https://www.facebook.com/sharer/sharer.php?u=" + "eventx-77033.firebaseapp.com/Event.html?eventid=" + ev_data.key;
      $("#fb_share").attr("href", fb_temp);

      // loading comments...................................................................................................
      var fb = firebase.database().ref('Comment/' + ev_data.key);
      var eve_temp = fb.orderByChild('time').on('child_added', function(data) {
        //alert('ment');
        var edit_comm = " ";
        var show_comm = '';
        if (data.val().user_id == uid) {
          show_comm = 'show_comm' + data.key;
          var com_id = '"' + data.key + '"';
          var edi_com = '"' + data.key + '","' + data.val().comment + '"';
          edit_comm = "<ul class='actions' id='comm_edit'><li><a class='reply btn' id='edit_comm' onClick='edit_comm(" + edi_com + ")'>Edit</a></li><li><a class='reply btn' onClick='delete_comm(" + com_id + ")'>Delete</a></li></ul>";
        } else {
          if (uid == ev_data.val().uid) {
            show_comm = 'show_comm' + data.key;
            var com_id = '"' + data.key + '"';
            var edi_com = '"' + data.key + '","' + data.val().comment + '"';
            edit_comm = "<ul class='actions' id='comm_edit'><li><a class='reply btn' onClick='delete_comm(" + com_id + ")'>Delete</a></li></ul>";

          }
        }
        var d1 = new Date(data.val().time);
        time = d1.toLocaleString();

        $('#comm_append').append("<li class='list-group-item' id='" + data.key + "'><span class='circle'><img src='" + data.val().profile_pic + "' alt='user'></span><span class='title'>" + data.val().username + "<time>" + time + "</time><div id='" + show_comm + "'><p>" + data.val().comment + "</p></div></span>" + edit_comm + "</li>");


      });
      //Linking map.............................................................................................
      var mapstr = "https://www.google.co.in/maps/place/";
      var mapstr1 = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBh4UzPJ8Oz7LD-p2p5uRU_RW6YSjWc_qw&q=";
      var str = data.val().venue;
      str = str.replace(/,/g, " ");
      var res = str.split(" ");
      for (var i = 0; i < res.length; i++) {
        if (i == 0) {
          mapstr = mapstr + res[i];
          mapstr1 = mapstr1 + res[i];

        } else {
          mapstr = mapstr + "+" + res[i];
          mapstr1 = mapstr1 + "+" + res[i];

        }
      }
      mapstr += "+" + data.val().state;
      mapstr1 += "+" + data.val().state;
      $("#map").attr("href", mapstr);
      $("#iframe_map").attr("src", mapstr1);

      // Event you may like.................................................................................
      var fb = firebase.database().ref('Event').orderByChild('state').equalTo(ev_data.val().state).limitToFirst(3).on('child_added', function(data) {
        if (data.key != ev_data.key) {
          $("#ev_empty").hide();
          var date1 = new Date(data.val().start_date_time);
          var date2 = new Date(data.val().end_date_time);
          var imgurl = "img/header.jpg";
          if (data.val().image != null) {
            imgurl = data.val().image;
          }
          $("#eventrow").append("<div id='" + data.key + "'><div class='col-sm-6 col-lg-4 col-md-6'><div class='thumbnail'><a href='Event.html?eventid=" + data.key + "'><img src='" + imgurl + "' style='height:175px;width:100%' alt='event pic'></a><div class='caption'><h4 class='pull-right'>" + data.val().category + "</h4><h4>" + data.val().name + "</h4><br/><h4 align='center'> " + date1.toDateString() + " <span class='h4'>-to-</span> " + date2.toDateString() + " </h4><h4 align='center'> " + date1.toTimeString().substring(0, 5) + " <span class='h4'>-to-</span> " + date2.toTimeString().substring(0, 5) + " </h4><h3 align='center'>State: " + data.val().state + "</h3><div align='center'><i class='fa fa-thumbs-o-up fa-2x'aria-hidden='true'  id='" + data.key + "e' onclick=InterestedEvent('" + data.key + "')></i></div></div></div></div></div>");

        }

      });

    });
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

//SignOut function....................................................................................................
$("#signout").click(function() {
  firebase.auth().signOut().then(function() {

    $("#signout").hide();
    $("#Loginsignup").html("Login/SignUp")
  });

});

//Get Event ID parameter function..................................................................................................
function get(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

//Tooltip.............................................................................................................
$('[data-toggle="tooltip"]').tooltip();


//On Event Pic change......................................................................................................

function changepic() {
  var filetemp = document.getElementById("Imagepicker").files;
  var sss = window.URL.createObjectURL(filetemp[0]);
  $("#imgdisplay").attr("src", sss);


}


//form submit...................................................................................................
$("#eform").submit(function(event) {
  event.preventDefault();

  var ename = $("#ename").val();
  var etype = $("#etype").val();
  var esdate = $("#esdate").val();
  var eedate = $("#eedate").val();
  var estime = $("#estime").val();
  var eetime = $("#eetime").val();
  var evenue = $("#evenue").val();
  var estate = $("#estate").val();
  var edescription = $("#edescription").val();
  var h_name = $('#o_name').val();
  var email = $('#o_email').val();
  var phone = $('#o_phone').val();

  var epic = ev_data.val().image;

  if (ename == "") {
    ename = ev_data.val().name;
  }
  if (etype == "") {
    etype = ev_data.val().category;
  }
  if (evenue == "") {
    evenue = ev_data.val().venue;
  }
  if (estate == "") {
    estate = ev_data.val().state;
  }
  if (edescription == "") {
    edescription = ev_data.val().description;
  }
  if (h_name == "") {
    h_name = ev_data.val().h_name;
  }
  if (email == "") {
    email = ev_data.val().email;
  }
  if (phone == "") {
    phone = ev_data.val().phone;
  }

  if (esdate == "") {
    var d1 = new Date(ev_data.val().start_date_time);
    esdate = d1.toLocaleDateString();
  }
  if (eedate == "") {
    var d2 = new Date(ev_data.val().end_date_time);
    eedate = d2.toLocaleDateString();
  }
  if (estime == "") {
    var t1 = new Date(ev_data.val().start_date_time);
    estime = t1.toTimeString().substring(0, 8);
  }
  if (eetime == "") {
    var t2 = new Date(ev_data.val().end_date_time);
    eetime = t2.toTimeString().substring(0, 8);
  }




  var esdt = new Date(esdate + " " + estime);
  var eedt = new Date(eedate + " " + eetime);
  var myEpoch1 = esdt.getTime();
  var myEpoch2 = eedt.getTime();


  var fb = firebase.database().ref();
  var eventpush = fb.child("Event").child(ev_data.key);
  var eventid = eventpush.key;
  //upload event pic storage...........................................................
  var filetemp = document.getElementById("Imagepicker").files;
  var file = filetemp[0];
  if (file != null) {
    var name = 'Event_images/' + eventid;
    var storageRef = firebase.storage().ref();
    var tempchild = storageRef.child(name);
    tempchild.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      tempchild.getDownloadURL().then(function(url) {
        epic = url;
        eventpush.child("image").set(epic);
      });
    });
  } else {
    eventpush.child("image").set(epic);
  }




  eventpush.set({
    "image": epic,
    "name": ename,
    "s_name": ename.toLowerCase(),
    "category": etype,
    "start_date_time": myEpoch1,
    "end_date_time": myEpoch2,
    "venue": evenue,
    "state": estate,
    "description": edescription,
    "state_category": estate + "_" + etype,
    "uid": uid,
    "h_name": h_name,
    "email": email,
    "phone": phone
  });
  //  alert("Event Edited Successfully");
  /*  $("#ename").val("");
    $("#etype").val("");
    $("#esdate").val("");
    $("#eedate").val("");
    $("#estime").val("");
    $("#eetime").val("");
    $("#evenue").val("");
    $("#edescription").val("");*/
  $(".form").hide();
  $("#post_succ").html("<h2 style='color:red;'>Event Editing please waite.......!</h2>");
  var timer = setTimeout(function() {
    $("#post_succ").html("<h2>Event Edited Successfully</h2><p align='center' style='color:red;'>Please refferesh the page!</p>");

  }, 3000);

  //window.location.href="index.html";
});



//Post Comment............................................................................................................


function comm_post() {
  //alert("post");
  var comment = $('#exampleInputEmail1').val();
  var fb = firebase.database().ref('Comment/' + ev_data.key).push();
  fb.set({
    "comment": comment,
    "profile_pic": u_pic,
    "time": new Date().getTime(),
    "user_id": uid,
    "username": u_name
  });

  $('#exampleInputEmail1').val("");
  if (ev_data.val().uid != uid) {
    firebase.database().ref('Notification').child(ev_data.val().uid).child(uid).set({
      "u_name": u_name,
      "e_name": ev_data.val().name,
      "e_id": ev_data.key
    });
  }
}

function comm_post2(comm_id) {
  //alert(comm_id);
  var comment = $('#exampleInputEmail2' + comm_id).val();
  var fb = firebase.database().ref('Comment/' + ev_data.key + '/' + comm_id + '/comment');
  fb.set(comment);

  $('#show_comm' + comm_id).html("<p>" + comment + "</p>");


}

function comm_cancel() {
  //alert("cancel");
  $('#exampleInputEmail1').val("");

}

function comm_cancel2(comm_id) {
  //alert("cancel");
  var comment = $('#exampleInputEmail2' + comm_id).val();
  $('#show_comm' + comm_id).html("<p>" + comment + "</p>");

}

// comment form submited..............................................................................................

$("#comm_form").submit(function(event) {
  event.preventDefault();
  comm_post();

});

//comment delete.........................................................................................

function delete_comm(comm_id) {
  var fb = firebase.database();
  var fb1 = fb.ref('Comment/' + ev_data.key + "/" + comm_id);
  fb1.remove();
  $('#' + comm_id).hide();
  fb.ref('Notification').child(ev_data.val().uid).child(uid).remove();
};


//edit comment..........................................................................................

function edit_comm(comm_id, comm) {
  var input_id = 'exampleInputEmail2' + comm_id;
  var com_id = '"' + comm_id + '"';
  $('#show_comm' + comm_id).html("<fieldset class='form-group'><input type='text' class='form-control' id='" + input_id + "' placeholder='Add a comment' value='" + comm + "'></fieldset><button type='button' class='btn btn-sm btn-success' onClick='comm_post2(" + com_id + ")'>Post</button><button type='button' class='btn btn-sm btn-secondary' onclick='comm_cancel2(" + com_id + ")'>Cancel</button>");
  //alert(comm_id+comm);
}


//Interested Events clicked.........................................................................................................................................................

function InterestedEvent(eid) {
  if (uid != null) {
    //Like table......................................
    var str = "Like/" + eid;
    var fb = firebase.database().ref(str);
    fb.child(uid).set(uid);
    //User tale.......................................
    var str2 = "Users/" + uid + "/Like";
    var fb2 = firebase.database().ref(str2);
    fb2.child(eid).set(eid);


    var iconcng = "#" + eid + "e";
    $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');

  } else {
    alert("Login first!");
  }
}

// show Notification..........................................................................................
var notify = function(){
var fb = firebase.database().ref('Notification').child(uid).orderByKey().once('value', function(snapdata){
  //console.log(snapdata.numChildren());
  $("#menu3").text(snapdata.numChildren() );
  snapdata.forEach(function(child){
    var us_id='"'+ child.key+'"';
    //console.log(child.val().e_id);
  $('#menu2_add').append("<li role='presentation' onClick='noti_click("+us_id+")'><a role='menuitem' tabindex='-1' href='Event.html?eventid="+child.val().e_id+"'>"+child.val().u_name+" comment on your "+child.val().e_name+" event</a></li><li role='presentation' class='div1 divider'></li>");
  });


});
};

// Notification cilck....................................................................

function noti_click(key){
//  alert("ddd");
  firebase.database().ref('Notification').child(uid).child(key).remove();
  //alert("ll");
};
