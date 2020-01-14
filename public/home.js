function selectCategory(elem) {
	document.getElementById("submit_btn").disabled = false;
  	var x = document.getElementById("report_desc");
  	var description = elem.getAttribute('data-description');
  	x.innerHTML = description;
	document.cookie="category_value="+elem.value;

  	var button = document.getElementsByClassName('categories');
  
  	for (var i = 0; i < button.length; i++) {
    	button[i].classList.remove('active');
  	}

  	elem.classList.add('active');
}

 


// var info = document.getElementById("report_sent");

// document.getElementById('submit_btn').onclick = function () {
//   info.classList.toggle('fade');
// }

// function confirmReport(elem) {
// 	$.confirm({
// 	    title: 'Confirm!',
// 	    content: 'Simple confirm!',
// 	    buttons: {
// 	        confirm: function () {
// 	            $.alert('Confirmed!');
// 	        },
// 	        cancel: function () {
// 	            $.alert('Canceled!');
// 	        }
// 	    }
// 	});
// }