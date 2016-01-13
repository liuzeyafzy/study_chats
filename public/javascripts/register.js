$(function(){
  $('.register-btn').click(function(){
    var username = $('.register-username').val();
    var password = $('.register-password').val();
    $.ajax({
      url: '/register',
      type: 'post',
      data:{
        username: username,
        password: password
      },
      success: function(data, status){
        if(status === 'success'){
          location.href = 'login';
        }
      },
      error: function(data, error){
        location.href = 'register';
      }
    })
  })
});