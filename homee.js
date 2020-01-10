function selectCategory(elem) {
	document.getElementById("submit_btn").disabled = false;
  	var x = document.getElementById("report_desc");
  	var description = elem.getAttribute('data-description');
  	x.innerHTML = description;

  	var button = document.getElementsByClassName('categories');
  
  	for (var i = 0; i < button.length; i++) {
    	button[i].classList.remove('active');
  	}

  	elem.classList.add('active');
}

function reportSent(x){
	var info = document.getElementById("report_sent");
	info.style.display = "block";

	setTimeout(function(){$(info).fadeOut();}, 2000);
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