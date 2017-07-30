//User authontication........................................................................................
var uid;

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      uid = user.uid;
      notify();

      //Show Interested Events.....................................................................................................

      var fb1 = firebase.database().ref('Like');
      fb1.orderByChild(uid).equalTo(uid).on('child_added', function(data1) {

        var fb = firebase.database().ref('Event');
        fb.orderByKey().equalTo(data1.key).on('child_added', function(data) {
          var int_ppl = 0;
          firebase.database().ref("Like").child(data.key).once('value', function(snapshot) {

            $('#likes' + data.key).html("" + snapshot.numChildren() + " people interested");
            int_ppl = snapshot.numChildren();
          });
          var date1 = new Date(data.val().start_date_time);
          var date2 = new Date(data.val().end_date_time);
          var imgurl = "img/header.jpg";
          var likes = 'likes'+data.key;
          var fb_temp="https://www.facebook.com/sharer/sharer.php?u="+"eventx-77033.firebaseapp.com/Event.html?eventid="+data.key;
          if (data.val().image != null) {
            imgurl = data.val().image;

          }

          //$("#eventrow").append("<div id='" + data.key + "'><div class='col-sm-6 col-lg-4 col-md-6'><div class='thumbnail'><a href='Event.html?eventid=" + data.key + "'><img src='" + imgurl + "' style='height:175px;width:100%' alt='event pic'></a><div class='caption'><h4 class='pull-right'>" + data.val().category + "</h4><h4>" + data.val().name + "</h4><br/><h4 align='center'> " + date1.toDateString() + " <span class='h4'>-to-</span> " + date2.toDateString() + " </h4><h4 align='center'> " + //date1.toTimeString().substring(0, 5) + " <span class='h4'>-to-</span> " + date2.toTimeString().substring(0, 5) + " </h4><h3 align='center'>State: " + data.val().state + "</h3><div><div class='pull-left' id='"+likes+"'> people interested</div><div class='text-right'><a href='"+fb_temp+"' target='_blank' id='fb_share'><i class='fa fa-facebook fa-2x' aria-hidden='true' style='color:#3b5998;'></i></a>   <i class='fa fa-thumbs-o-up fa-2x' aria-hidden='true'  id='" + data.key + "e' //    //onclick=InterestedEvent('" + data.key + "')></i><div></div></div></div></div></div>");

          $("#eventrow").append("<div id='" + data.key + "'><div class='col-sm-6 col-lg-4 col-md-6'><div class='thumbnail'><a href='Event.html?eventid=" + data.key + "'><img src='" + imgurl + "' style='height:175px;width:100%' alt='event pic'></a><div class='caption'><p class='pull-right'>" + data.val().category + "</p><h4>" + data.val().name + "</h4><br/><h4 align='center'> " + date1.toDateString() + " <span class='h4'>-to-</span> " + date2.toDateString() + " </h4><h4 align='center'> " + date1.toTimeString().substring(0, 5) + " <span class='h4'>-to-</span> " + date2.toTimeString().substring(0, 5) + " </h4><h3 align='center'>State: " + data.val().state + "</h3><div><div class='pull-left' id='"+likes+"'>"+int_ppl+" people interested</div><div class='text-right'><a href='"+fb_temp+"' target='_blank' id='fb_share'><i class='fa fa-facebook fa-2x' aria-hidden='true' style='color:#3b5998;'></i></a> <i class='fa fa-thumbs-up fa-2x'aria-hidden='true' onclick=un_inter('" + data.key + "')></i></div></div></div></div></div></div>");


        });
        //alert(data.key);

      });


    } else {
      // User is signed out.
      window.location.href = "Login.html";
    }
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


//Delete events function.......................................................................................................

function un_inter(eid) {
  if (confirm("Remove the selected event!") == true) {
    firebase.database().ref("Like").child(eid).child(uid).remove();
    firebase.database().ref("Users").child(uid).child("Like").child(eid).remove();
    var temp = "#" + eid;
    $(temp).hide();
  } else {

  }
}

// show Notification..........................................................................................
var notify = function() {
  var fb = firebase.database().ref('Notification').child(uid).orderByKey().once('value', function(snapdata) {
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
  firebase.database().ref('Notification').child(uid).child(key).remove();
  //alert("ll");
};
