window.URL = window.URL || window.webkitURL;

var username;
var userid;
var userurl
var cuser;

//Tooltip.............................................................................................................
$('[data-toggle="tooltip"]').tooltip();

//User Authontication......................................................................................................

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      cuser = user;
      username = user.displayName;
      userid = user.uid;
      userurl = user.photoURL;
      $("#username").html("<b>" + username + "</b>");
      $("#userimage").attr("src", userurl);
      notify();

      //Display Events posted by user...............................................................................................
      var fb = firebase.database().ref('Event');
      fb.orderByChild("uid").equalTo(user.uid).on('child_added', function(data) {
        //alert(data.key);
        firebase.database().ref("Like").child(data.key).once('value', function(snapshot) {

          $('#likes' + data.key).html("" + snapshot.numChildren() + " people interested");
          if (snapshot.hasChild(userid)) {
            var iconcng = "#" + data.key + "e";
            $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');
          }
        });
        var date1 = new Date(data.val().start_date_time);
        var date2 = new Date(data.val().end_date_time);
        var likes = 'likes'+data.key;
        var fb_temp="https://www.facebook.com/sharer/sharer.php?u="+"eventx-77033.firebaseapp.com/Event.html?eventid="+data.key;
        var imgurl = "img/header.jpg";
        if (data.val().image != null) {
          imgurl = data.val().image;

        }

        $("#eventrow").append("<div id='" + data.key + "'><div class='col-sm-6 col-lg-4 col-md-6'><div class='thumbnail'><a href='Event.html?eventid=" + data.key + "'><img src='" + imgurl + "' style='height:175px;width:100%' alt='event pic'></a><div class='caption'><button class='btn btn-danger pull-right' onclick=myDel('" + data.key + "')><i class='fa fa-trash' aria-hidden='true'></i>  Delete</button><h4>" + data.val().name + "</h4><br/><h4 align='center'> " + date1.toDateString() + " <span class='h4'>-to-</span> " + date2.toDateString() + " </h4><h4 align='center'> " + date1.toTimeString().substring(0, 5) + " <span class='h4'>-to-</span> " + date2.toTimeString().substring(0, 5) + " </h4><h3 align='center'>State: " + data.val().state + "</h3><div><div class='pull-left' id='"+likes+"'> people interested</div><div class='text-right'><a href='"+fb_temp+"' target='_blank' id='fb_share'><i class='fa fa-facebook fa-2x' aria-hidden='true' style='color:#3b5998;'></i></a>   <i class='fa fa-thumbs-o-up fa-2x' aria-hidden='true'  id='" + data.key + "e' onclick=InterestedEvent('" + data.key + "')></i><div></div></div></div></div></div>");

      });

    } else {
      // User is signed out.
      window.location.href = 'Login.html';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});


//SignOut function....................................................................................................
$("#logout").click(function() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.href = "index.html";
  }).catch(function(error) {
    // An error happened.
    alert(error);
  });
});

//Delete events function.......................................................................................................

function myDel(eid) {
  if (confirm("Delete the selected event!") == true) {
    firebase.database().ref("Event").child(eid).remove();
    var temp = "#" + eid;
    $(temp).hide();
  } else {

  }
}


//Change User PIC function........................................................................................................

function changeuserpic() {
  var filetemp = document.getElementById("userpic").files;
  var file = filetemp[0];
  var temp = "profile/" + userid;
  var imgchild = firebase.storage().ref().child(temp);

  imgchild.put(file).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
    imgchild.getDownloadURL().then(function(url) {
      //alert(url);
      $("#userimage").attr("src", url);
      cuser.updateProfile({
        photoURL: url
      }).then(function() {
        // Update successful.
        alert("updated");
      }, function(error) {
        alert("unable to upload");
      });
    });
  });

}


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

  var esdt = new Date(esdate + " " + estime);
  var eedt = new Date(eedate + " " + eetime);
  var myEpoch1 = esdt.getTime();
  var myEpoch2 = eedt.getTime();


  var fb = firebase.database().ref();
  var eventpush = fb.child("Event").push();
  var eventid = eventpush.key;
  //upload event pic storage...........................................................
  var filetemp = document.getElementById("Imagepicker").files;
  var file = filetemp[0];
  var epic = "https://firebasestorage.googleapis.com/v0/b/eventx-77033.appspot.com/o/Event_images%2Fheader.jpg?alt=media&token=7d65bcd0-0ccb-4686-8eac-913180b0a50c";
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
    //alert("error");
    eventpush.child("image").set(epic);
  }




  eventpush.set({
    "name": ename,
    "s_name": ename.toLowerCase(),
    "category": etype,
    "start_date_time": myEpoch1,
    "end_date_time": myEpoch2,
    "venue": evenue,
    "state": estate,
    "description": edescription,
    "state_category": estate + "_" + etype,
    "uid": userid,
    "h_name": h_name,
    "email": email,
    "phone": phone,
    "image": epic
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
  $("#post_succ").html("<h2 style='color:red;'>Event posting please waite......!</h2>");
  var timer = setTimeout(function() {
    $("#post_succ").html("<h2>Event Posted Successfully</h2><p align='center' style='color:red;'>please refresh</p>");

  }, 3000);

  //window.location.href="index.html";
});

//Interested Events clicked.........................................................................................................................................................
function InterestedEvent(eid) {
  if (userid != null) {
    var iconcng = "#" + eid + "e";
    if ($(iconcng).attr('class')=='fa fa-thumbs-o-up fa-2x') {
      //Like table......................................
      var str = "Like/" + eid;
      var fb = firebase.database().ref(str);
      fb.child(userid).set(userid);
      //User table.......................................
      var str2 = "Users/" + userid + "/Like";
      var fb2 = firebase.database().ref(str2);
      fb2.child(eid).set(eid);



      $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');
    } else {
      $(iconcng).attr('class', 'fa fa-thumbs-o-up fa-2x');
      firebase.database().ref("Like").child(eid).child(userid).remove();
      firebase.database().ref("Users").child(userid).child("Like").child(eid).remove();


    }
  } else {
    alert("Login first!");
  }
}


/*function InterestedEvent(eid) {
  if (userid != null) {
    var str = "Like/" + eid;
    var fb = firebase.database().ref(str);
    fb.child(userid).set(userid);

    //User table.......................................
    var str2 = "Users/" + userid + "/Like";
    var fb2 = firebase.database().ref(str2);
    fb2.child(eid).set(eid);


    var iconcng = "#" + eid + "e";
    $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');

  } else {
    alert("Login first!");
  }
}*/

//Manage starting and ending date..............................................................................................

$("#eedate").click(function() {
  var str = $("#esdate").val();
  //  alert(str);
  $("#eedate").attr('min', str);
});
$("#esdate").click(function() {
  var str = $("#eedate").val();
  //  alert(str);
  $("#esdate").attr('max', str);
});

// show Notification..........................................................................................
var notify = function() {
  var fb = firebase.database().ref('Notification').child(userid).orderByKey().once('value', function(snapdata) {
    //console.log(snapdata.numChildren());
    $("#menu3").text(snapdata.numChildren());
    snapdata.forEach(function(child) {
      var us_id = '"' + child.key + '"';
      //console.log(child.val().e_id);
      $('#menu2_add').append("<li role='presentation' onClick='noti_click(" + us_id + ")'><a role='menuitem' tabindex='-1' href='Event.html?eventid=" + child.val().e_id + "'>" + child.val().u_name + " comment on your " + child.val().e_name + " event</a></li><li role='presentation' class='div1 divider'></li>");
    });


  });
};

// Notification cilck....................................................................

function noti_click(key) {
  //  alert("ddd");
  firebase.database().ref('Notification').child(userid).child(key).remove();
  //alert("ll");
};
