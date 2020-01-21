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