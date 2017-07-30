<!--User authontication.........................................................................................-->
var uid;

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      uid = user.uid;
      $("#Loginsignup").hide();
      $("#profilebtn").show();
      $("#signout").show();
      $("#loginbtn").hide();
      $("#eventform").show();
      $(".div1").show();
      $(".intere").show();
      $("#menu2").show();
      notify();


    } else {
      // User is signed out.
      $("#loginbtn").show();
      $("#eventform").hide();
      $("#Loginsignup").show();
      $("#profilebtn").hide();
      $("#signout").hide();
      $(".div1").hide();
      $(".intere").hide();
      $("#menu2").hide();

    }


    //Display Events posted by user...............................................................................................
    var category = getreqparam('category');
    var fb = firebase.database().ref('Event');
    $("#evntype").html(category + " Events <hr/>");
    if (category == "All") {
      fb.orderByChild("name").on('child_added', function(data) {
        //alert(data.key);
        display_e(data);
      });
    } else {
      fb.orderByChild("category").equalTo(category).on('child_added', function(data) {
        //alert(data.key);
        display_e(data);
      });
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


//getHttpRequest Parameter..........................................................................................................

function getreqparam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}


//City Selected.....................................................................................................

function cityselect(city) {
  $("#eventrow").html("");

  var category = getreqparam('category');
  var fb = firebase.database().ref('Event');
  if (category == "All") {
    fb.orderByChild("name").on('child_added', function(data) {
      //alert(data.key);
      if (city == "All" || data.val().state == city) {
        display_e(data);
      }
    });
  } else {
    fb.orderByChild("category").equalTo(category).on('child_added', function(data) {
      //alert(data.key);
      if (city == "All" || data.val().state == city) {
        display_e(data);
      }
    });
  }



}

// Display Event Function.........................................................................................................#
function display_e(data) {
  firebase.database().ref("Like").child(data.key).once('value', function(snapshot) {

  $('#likes'+data.key).html(""+snapshot.numChildren()+" people interested");
  if(snapshot.hasChild(uid)){
    var iconcng = "#" + data.key + "e";
      $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');
  }
});
  var date1 = new Date(data.val().start_date_time);
  var date2 = new Date(data.val().end_date_time);
  var imgurl = "img/header.jpg";
  var likes = 'likes'+data.key;
  var fb_temp="https://www.facebook.com/sharer/sharer.php?u="+"eventx-77033.firebaseapp.com/Event.html?eventid="+data.key;
  if (data.val().image != null) {
    imgurl = data.val().image;
  }
  $("#eventrow").append("<div id='" + data.key + "'><div class='col-sm-6 col-lg-4 col-md-6'><div class='thumbnail'><a href='Event.html?eventid=" + data.key + "'><img src='" + imgurl + "' style='height:175px;width:100%' alt='event pic'></a><div class='caption'><h4 class='pull-right'>" + data.val().category + "</h4><h4>" + data.val().name + "</h4><br/><h4 align='center'> " + date1.toDateString() + " <span class='h4'>-to-</span> " + date2.toDateString() + " </h4><h4 align='center'> " + date1.toTimeString().substring(0, 5) + " <span class='h4'>-to-</span> " + date2.toTimeString().substring(0, 5) + " </h4><h3 align='center'>State: " + data.val().state + "</h3><div><div class='pull-left' id='"+likes+"'> people interested</div><div class='text-right'><a href='"+fb_temp+"' target='_blank' id='fb_share'><i class='fa fa-facebook fa-2x' aria-hidden='true' style='color:#3b5998;'></i></a>   <i class='fa fa-thumbs-o-up fa-2x' aria-hidden='true'  id='" + data.key + "e' onclick=InterestedEvent('" + data.key + "')></i><div></div></div></div></div></div>");

}

//Interested Events clicked.........................................................................................................................................................

function InterestedEvent(eid) {
  if (uid != null) {
    var iconcng = "#" + eid + "e";
    if ($(iconcng).attr('class')=='fa fa-thumbs-o-up fa-2x') {
      //Like table......................................
      var str = "Like/" + eid;
      var fb = firebase.database().ref(str);
      fb.child(uid).set(uid);
      //User table.......................................
      var str2 = "Users/" + uid + "/Like";
      var fb2 = firebase.database().ref(str2);
      fb2.child(eid).set(eid);



      $(iconcng).attr('class', 'fa fa-thumbs-up fa-2x');
    } else {
      $(iconcng).attr('class', 'fa fa-thumbs-o-up fa-2x');
      firebase.database().ref("Like").child(eid).child(uid).remove();
      firebase.database().ref("Users").child(uid).child("Like").child(eid).remove();


    }
  } else {
    alert("Login first!");
  }
}

//Search event function.......................................................................................................................

function search_e(name) {
  name = name.toLowerCase();
  $("#eventrow").html("");
  var category = getreqparam("category");
  var state = $("#sel1").val();
  var fb = firebase.database().ref("Event");
  if (state == "All" && category == "All") {
    fb.orderByChild("s_name").startAt(name).endAt(name + '\uf8ff').on('child_added', function(data) {
      display_e(data);
    });
  } else {
    fb.orderByChild("s_name").startAt(name).endAt(name + '\uf8ff').on('child_added', function(data) {
      if (state == data.val().state || category == data.val().category) {
        display_e(data);
      }
    });
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
