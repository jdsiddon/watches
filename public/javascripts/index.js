$(document).ready(function() {

  // Fade alerts away.
  $(".alert").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert").alert('close');
  });

});
