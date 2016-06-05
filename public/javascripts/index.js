$(document).ready(function() {

  // Fade alerts away.
  $(".alert").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert").alert('close');
  });

  $(".delete").click(function() {
    var url = '/listings/' + $(this).val();
    console.log(url);

    $.ajax({
      url: url,
      type: 'DELETE',
      success: function(result) {
        test = this;
        location.reload();
        alert(result["message"]);
      }
    });
  });

});
