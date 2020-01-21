function selectCategory(elem) {
    if(elem.classList.contains('active')){
      elem.classList.remove('active');
      document.getElementById("submit_btn").disabled = true;
      var x = document.getElementById("report_desc");
      x.style.display = 'none';
    }else{
      document.getElementById("submit_btn").disabled = false;
      var x = document.getElementById("report_desc");
      var description = elem.getAttribute('data-description');
      x.style.display = 'block';
      x.innerHTML = description;
      document.cookie = "category_value=" + elem.value;

      var button = document.getElementsByClassName('categories');
    
      for (var i = 0; i < button.length; i++) {
        button[i].classList.remove('active');
      }
    elem.classList.add('active');
  }
}

document.querySelector("#confirm_btn2").addEventListener("click", function() {
  swal({
    text: "Report has been sent!",
    type: 'success',
    position: "top right",
    backdrop: "transparent",
    background: "#efffed",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    timer: 2000
  });
  setTimeout(function(){$('#submit_modal1').css("filter", "blur(0)");}, 500);
});

$("#confirm_btn1").click(function(){
  $("#submit_modal1").css("filter", "blur(2px)");  
});

$("#cancel_btn").click(function(){
  $("#submit_modal1").css("filter", "blur(0)");  
});

function showChat(){
  $('.toast').toast('show');
}