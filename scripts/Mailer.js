function sdEmail(email, desc) {
  waitingState()
  $.ajax({
    type: "GET",
    url: 'http://' + publicIP + ':' + publicPort + '/sendEmail?email=' + email + "&description=" + desc,
    data: {},
    success: function( data ) {
      console.log("Email sent");
      $('#star_rotation').remove()
      createHtml()
    },
    dataType: 'json'
  });
  return false;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function waitingState() {
  $("#success_msg").remove()
  $("#email_div").append("<div id = 'star_rotation' class = 'star'>★</div>")
}

function createHtml() {
  $('#star_rotation').remove()
  $("#success_msg").remove()
  $("#email_div").append("<span id = 'success_msg' style='position: relative; top: -20px; color:green;'>Your email has been sent! ✓</span>");
}