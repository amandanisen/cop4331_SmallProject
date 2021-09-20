var urlBase = 'Project1API';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contactId = 0;
var phoneNum = "";
var contactListArray;
var searchContactList = [];
var $ = document.getElementById;

let cm; // global instance of ContactManager

// started working on that
function init() {
	cm = new ContactManager();
	cm.displayContactsAsATable('contact-list'); 
}

function doSignUp(){
	userId = 0;

	// TODO: 
	firstName = "";
	lastName = "";
	phoneNum = ""
	
	var email = document.getElementById("signupName").value;

	// console.log(email);

	var password = document.getElementById("signupPassword").value;
	// var hash = md5( password );

	var confirmPass = document.getElementById("confirmPassword").value;

	if (password == confirmPass) 
	{
		document.getElementById("loginResult").innerHTML = "";

		// "email": "TestEmail@Test.com",
  		// "password": "password123",
  		// "firstname": "Landon",
  		// "lastname": "Russell",
  		// "phone": "407-938-4910"

		var json = {email:email,password:password,firstname:firstName, lastname:lastName,phone:phoneNum};

		// translating
		var jsonPayload = JSON.stringify(json);

		// console.log(jsonPayload);
		
		var url = urlBase + '/Signup.' + extension;

		// console.log(url);

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.setRequestHeader("accept", "application/json");
		try
		{
			xhr.onreadystatechange = function() 
			{
				// console.log(this.status);
				if (this.readyState == 4 && this.status == 201) 
				{
					var jsonObject = JSON.parse( xhr.responseText );

					// creating json object and fillig the fiels on the database
					// console.log(jsonObject);
					userId = jsonObject.id;

					// console.log(userId);
					
					localStorage.setItem("userIDInput",userId);

					localStorage.getItem("userIDInput");
			
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					saveCookie();
		
					window.location.href = "contactmanager.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("loginResult").innerHTML = err.message;
		}
	}

	else {
		// make conf pass red
	}	
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;

	// console.log(login);

	var password = document.getElementById("loginPassword").value;
	// var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {email:login,password:password};
	// var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	// console.log(jsonPayload);
	
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			// console.log(this.status);
			// console.log(this.readyState);

			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				// console.log(jsonObject);
				userId = jsonObject.id;

				// console.log(jsonObject.firstName);
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

        		console.log(jsonObject);

				saveCookie();
	
				window.location.href = "contactmanager.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",contactId=" + contactId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");

		console.log(tokens[0]);

		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}

	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName;
		console.log(userId);
	}
}

function readCookieUserId()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");

		console.log(tokens[0]);

		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}

	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		
		console.log(userId);
	}
}

function getContacts(){

	var url = urlBase + '/GetContact.' + extension + '?userID=' + userId;
	var json;

	// console.log(url);

	fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((myJson) => {
		// console.log(myJson[0].ID);
		json = myJson;
		// console.log(json);
		// console.log(json.length);

		for (var i = 0; i < json.length; i++){
			var obj = json[i];
			// console.log(obj);
		}

		contactListArray = json;
		displayContactsAsATable(false);
	});
}

function displayContactsAsATable(isSearch) {
	var i = 0;
    let container = document.querySelector('#' + 'contact-list');
    container.innerHTML = ''; // empty the container that contains the results
	
    if(contactListArray.length === 0) {
      container.innerHTML = '<p>No contacts. Add some, please.</p>';
      return;
    }  

    let table = document.createElement('table');
    table.insertRow()
      .innerHTML = `<th class="sort-row">Full Name</th><th class="sort-row">Phone Number</th>`;

		console.log(isSearch);
	  contactListArray.forEach((currentContact) => {

		//if it was searched
		if(isSearch){
			searchContactList.forEach((currentSearchContact) =>{
				if(currentContact.ID.toString() == currentSearchContact){
					let row = table.insertRow();
					row.innerHTML = 
						`
						<td>
							<i class="fa fa-pencil" aria-hidden="true" onclick="edit('${currentContact.ID}')"></i>
							<i class="fa fa-trash-o" onclick="deleteContact('${currentContact.ID}')"></i> 
							${currentContact.FirstName + " " + currentContact.LastName}</td>
						
						<td>${currentContact.Phone}</td>
						`
				}
			});	
		
		}else{
			let row = table.insertRow();
			row.innerHTML = 
			`
			<td>
			<i class="fa fa-pencil" aria-hidden="true" onclick="edit('${currentContact.ID}')"></i>
			<i class="fa fa-trash-o" onclick="deleteContact('${currentContact.ID}')"></i> 
				${currentContact.FirstName + " " + currentContact.LastName}</td>
			
			<td>${currentContact.Phone}</td>
			`
		}
    });
    container.appendChild(table);
}

function productAddToTable(userInfo) {
    // First check if a <tbody> tag exists, add one if not
	console.log(userInfo.FirstName);

	document.getElementById('productTable').append("<tr>" +
	"<td>" + userInfo.FirstName + " " + userInfo.LastName + "</td>" +
	"<td>" + userInfo.Phone + "</td>" +
	"</tr>");
}

// added new para to reflecct our set up
function deleteContact(contactDeleteID){
	console.log("AFTER: " + contactListArray[0].ID);

	console.log("Contact to be deleted: " + contactDeleteID);

	for (let i = 0; i < contactListArray.length; i++) {
		var contactIDstr = contactDeleteID.toString();
		var contactListIDStr = contactListArray[i].ID.toString();
		if (contactListIDStr === contactIDstr) {
			
		  let sure = confirm(`Are you sure you want to delete ${contactListArray[i].FirstName}?`);
		  if (sure){
			if(deletePostRequest(contactDeleteID)){
				contactListArray.splice(i, 1);
				displayContactsAsATable(false);

			}
			displayContactsAsATable(false);

		  } 
		}
	  }
    displayContactsAsATable(false);
}

function deletePostRequest(contactId){
	console.log("ID TO DELETE QUERY: " + contactId);
	var json = {id:contactId};
	// var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( json );

	console.log(jsonPayload);
	
	var url = urlBase + '/DeleteContact.' + extension;
	console.log(url);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log(this.status);
			// console.log(this.readyState);

			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				// console.log(jsonObject);
				var message = jsonObject.message;

				// console.log(jsonObject.firstName);
		
				if( message.includes("successfully") )
				{		
					displayContactsAsATable(false);
					// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return true;
				}else{
					return false;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		return false;
		// document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// idl if this is the correct add function but it's the last one i had
function addContact()
{
	var newContactFirst = document.getElementById("addFirstName").value;
	var newContactLast  = document.getElementById("addLastName").value;
	var newNumber = document.getElementById("addNumber").value;

	document.getElementById("AddResult").innerHTML = "";

	var tmp = {userID:userId,firstname:newContactFirst,lastname:newContactLast,phone:newNumber};
	var jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
    
	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log(this.status)
			if (this.readyState == 4 && this.status == 201) 
			{
				document.getElementById("AddResult").innerHTML = "Contact has been added";
				var jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject.id);
				contactId = jsonObject.id;
				window.location.href = "contactmanager.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("AddResult").innerHTML = err.message;
	}
}

function edit(contactID) {
    for (let i = 0; i < contactListArray.length; i++) {
		console.log(contactListArray[i].ID.toString());
		console.log("contactID.toString(): "+ contactID.toString());

      if (contactListArray[i].ID.toString() === contactID.toString()) {
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.update').style.display = 'block';
        document.querySelector('.update .name').value = contactListArray[i].FirstName;
		document.querySelector('.update .lastname').value = contactListArray[i].LastName;
        document.querySelector('.update .phone').value = contactListArray[i].Phone;
        document.querySelector('.update button').addEventListener('click', (e) => {
          e.preventDefault();
          editContact(i);
        });
      }
    }
    displayContactsAsATable(false);
  }
  
  function editContact(idx) {
	console.log("in edit: "+ contactListArray[idx].ID.toString());
    let name = document.querySelector('.update .name').value;
	let lastname = document.querySelector('.update .lastname').value;
    let phone = document.querySelector('.update .phone').value;
	//if this was successful, close window
	editContactRequest(contactListArray[idx].ID.toString(), name, lastname, phone, idx);
	displayContactsAsATable(false);
	document.querySelector('.overlay').style.display = 'none';
	document.querySelector('.update').style.display = 'none';
	
   
  }
  
  function closeUpdate() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.update').style.display = 'none';
  }



  
function editContactPostRequest(selectedID, newContactFirst, newContactLast, newNumber, idx)
{


	var newContactFirst = document.getElementById("newFirstName").value;
	var newContactLast  = document.getElementById("newLastName").value;
	var newNumber = document.getElementById("newNumber").value;
  
	// document.getElementById("AddResult").innerHTML = "";
  
	var tmp = {userID:userId,firstname:newContactFirst,lastname:newContactLast,phone:newNumber};
	var jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
	/*
		  "firstname": "Landon",
  "lastname": "Russell",
  "phone": "1234567899",
  "id": 1

	*/
	var tmp = {firstname:newContactFirst,lastname:newContactLast,phone:newNumber,id:selectedID};
	var jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
    
	var url = urlBase + '/Edit.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log(this.status)
			if (this.readyState == 4 && this.status == 201) 
			{
				
				var jsonObject = JSON.parse( xhr.responseText );
				contactListArray[idx].FirstName = jsonObject.FirstName;
				contactListArray[idx].LastName = jsonObject.LastName;;
				contactListArray[idx].Phone = jsonObject.Phone;
				displayContactsAsATable(false);
				// closeUpdate();
				// window.location.href = "contactmanager.html";
			}
		};
		xhr.send(jsonPayload);

	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function editContactRequest(selectedID, newContactFirst, newContactLast, newNumber, idx)
{


	/*
		  "firstname": "Landon",
  "lastname": "Russell",
  "phone": "1234567899",
  "id": 1

	*/
	var tmp = {firstname:newContactFirst,lastname:newContactLast,phone:newNumber,id:selectedID};
	var jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
    
	var url = urlBase + '/Edit.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log(this.status)
			if (this.readyState == 4 && this.status == 201) 
			{
				
				var jsonObject = JSON.parse( xhr.responseText );
				contactListArray[idx].FirstName = jsonObject.FirstName;
				contactListArray[idx].LastName = jsonObject.LastName;;
				contactListArray[idx].Phone = jsonObject.Phone;
				displayContactsAsATable(false);
				// closeUpdate();
				// window.location.href = "contactmanager.html";
			}
		};
		xhr.send(jsonPayload);

	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function searchContact()
{
	var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchText");
	var inputStr = input.value.toString();
	console.log(inputStr);
	if(inputStr === ""){
		displayContactsAsATable(false);
		searchContactList = [];
	}else{
		for (i = 0; i < contactListArray.length; i++) {
			var contactPhoneStr = contactListArray[i].Phone.toString();
			if(contactPhoneStr.includes(inputStr)){
				searchContactList.push(contactListArray[i].ID.toString());
				console.log("Contains: " + contactPhoneStr);
			}
		
			// // a = contactListArray[i].getElementsByTagName("a")[0];
			// // txtValue = a.textContent || a.innerText;
			// if (txtValue.toUpperCase().indexOf(filter) > -1) {
			//     li[i].style.display = "";
			// } else {
			//     li[i].style.display = "none";
			// }
		}
		displayContactsAsATable(true);
		searchContactList = [];
	}
   

}
