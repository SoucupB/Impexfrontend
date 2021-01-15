function populateCheckboxes(email, desc) {
  $.ajax({
    type: "GET",
    url: 'http://' + publicIP + ':' + publicPort + '/sendEmail?email=' + email + "&description=" + desc,
    data: {},
    success: function( data ) {
      console.log("Email sent");
    },
    dataType: 'json'
  });
  return false;
}