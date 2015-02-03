
function editElements(){
	console.log("Inside edit elements");
    document.getElementById('non-editable-view').style.display = 'none';
    document.getElementById('editable-view').style.display = 'block';
    document.getElementById('editdeletebutton').style.display = 'none';
    document.getElementById('savebutton').style.display = 'block';
}

function cancelEditElements(){
	console.log("Inside cancel edit elements");
    document.getElementById('non-editable-view').style.display = 'block';
    document.getElementById('editable-view').style.display = 'none';
    document.getElementById('editdeletebutton').style.display = 'block';
    document.getElementById('savebutton').style.display = 'none';
}

function writeReviewForElement(){
	console.log("Inside write review for element");
    document.getElementById('write-next-review').style.display = 'block';
}

function ratingButtonClicked(){
	console.log("radiobuttonchanged");
	if (document.getElementById('rating-1').checked) {
		document.getElementById("ratingtext").innerHTML = "Eek! Methinks not.";
	} else if (document.getElementById('rating-2').checked) {
		document.getElementById("ratingtext").innerHTML = "Meh. I've experienced better.";
	}else if (document.getElementById('rating-3').checked) {
		document.getElementById("ratingtext").innerHTML = "A-OK.";
	}else if (document.getElementById('rating-4').checked) {
		document.getElementById("ratingtext").innerHTML = "Yay! I am a fan.";
	}else if (document.getElementById('rating-5').checked) {
		document.getElementById("ratingtext").innerHTML = "Woohoo! As good as it gets!";
	}	
}

function cancelReviewButtonClicked(){
	console.log("inside cancelReviewButtonClicked");
    document.getElementById('non-editable-view').style.display = 'block';
    document.getElementById('editable-view').style.display = 'none';
    document.getElementById('editdeletebutton').style.display = 'block';
    document.getElementById('savebutton').style.display = 'none';
    document.getElementById('write-next-review').style.display = 'none';	
}

function validateSignUpFields(){
	var firstname = document.getElementById("firstName").value;
	var lastname = document.getElementById("lastName").value;
	var emailaddress = document.getElementById("emailaddress").value;
	var password = document.getElementById("password").value;
	if(firstname == null || firstname == ""){
		alert("First name must be filled out");
		return false;
	}else if(lastname == null || lastname == ""){
		alert("Last name must be filled out");
		return false;		
	}else if(emailaddress == null || emailaddress == ""){
		alert("Email address must be filled out");
		return false;		
	}else if(password == null || password == ""){
		alert("Password must be filled out");
		return false;		
	}
	return true;
}

function validateCategoryFields(){
	console.log("validateCategoryFields");
	var categoryname = document.getElementById("categoryname").value;
	var categorydesc = document.getElementById("categorydesc").value;
	if(categoryname === null || categoryname === ""){
		alert("Category name must be filled out!");
		return false;
	}else if(categorydesc === null || categorydesc === ""){
		alert("Category description must be filled out");
		return false;
	}	
	return true;
}

function validateElementFields(){
	var elementname = document.getElementById("elementname").value;
	var elementdesc = document.getElementById("elementdesc").value;
	var elementaddress = document.getElementById("elementaddress").value;
	var phonenum = document.getElementById("phonenum").value;
	var emailaddress = document.getElementById("emailaddress").value;
	if(elementname === null || elementname === ""){
		alert("Element name must be filled out!");
		return false;
	}else if(elementdesc === null || elementdesc === ""){
		alert("Element description must be filled out!");
		return false;
	}else if(emailaddress === null || emailaddress === ""){
		alert("Email address must be filled out!");
		return false;
	}else if(elementaddress === null || elementaddress === ""){
		alert("Element address must be filled out!");
		return false;
	}else if(phonenum === null || phonenum === ""){
		alert("Element Phone number must be filled out!");
		return false;
	}
	return true;
}
