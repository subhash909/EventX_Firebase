//firebase code.............................................................................................................

window.URL = window.URL || window.webkitURL;
var uid;

//Tooltip.............................................................................................................
$('[data-toggle="tooltip"]').tooltip();

<!--User authontication.........................................................................................-->

initApp = function() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            // User is signed in.
            uid=user.uid;
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
    var esdt=new Date(esdate+" "+estime);
    var eedt=new Date(eedate+" "+eetime);
    var myEpoch1 = esdt.getTime();
    var myEpoch2 = eedt.getTime();

    //alert(myEpoch);

    var fb = firebase.database().ref();
    var eventpush = fb.child("Event").push();
    var eventid=eventpush.key;
//upload event pic storage...........................................................
    var filetemp = document.getElementById("Imagepicker").files;
    var file = filetemp[0];
    var epic="https://firebasestorage.googleapis.com/v0/b/eventx-77033.appspot.com/o/Event_images%2Fheader.jpg?alt=media&token=7d65bcd0-0ccb-4686-8eac-913180b0a50c";
    if(file!=null){
    var name = 'Event_images/' + eventid;
    var storageRef = firebase.storage().ref();
    var tempchild = storageRef.child(name);
    tempchild.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        tempchild.getDownloadURL().then(function(url) {
            epic=url;
            eventpush.child("image").set(epic);
        });
    });
  }
  else{
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
        "state_category": estate+"_"+etype,
        "uid":uid,
        "h_name": h_name,
        "email": email,
        "phone": phone,
        "image": epic
    });
    //  alert("Event Posted Successfully");
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
      var timer = setTimeout(function(){
        $("#post_succ").html("<h2>Event Posted Successfully</h2><p align='center' style='color:red;'>please refresh</p>");

      },3000);


    //window.location.href="index.html";
});


//Manage starting and ending date..............................................................................................

$("#eedate").click(function(){
  var str=$("#esdate").val();
  //  alert(str);
  $("#eedate").attr('min',str);
});
$("#esdate").click(function(){
  var str=$("#eedate").val();
  //  alert(str);
  $("#esdate").attr('max',str);
});

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
