$(function(){
  $('.login-btn').click(function(){
    var username = $('.login-username').val();
    var password = $('.login-password').val();
    $.ajax({
      url: '/login',
      type: 'post',
      data: {
        username: username,
        password: password
      },
      success: function(data, status){
        if(status === 'success'){
          location.href = 'home';
        }
      },
      error: function(data, error){
        console.log('error');
        alert(data.responseText);
      }
    })
  })
})