var urlBase = 'Project1API';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var phoneNum = "";

function doSignUp(){
	userId = 0;

	// TODO: 
	firstName = "";
	lastName = "";
	phoneNum = ""
	
	var email = document.getElementById("signupName").value;

	console.log(email);

	var password = document.getElementById("signupPassword").value;
//	var hash = md5( password );

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

		console.log(jsonPayload);
		
		var url = urlBase + '/Signup.' + extension;

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
				if (this.readyState == 4 && this.status == 201) 
				{
					var jsonObject = JSON.parse( xhr.responseText );

					// creating json object and fillig the fiels on the database
					console.log(jsonObject);
					userId = jsonObject.id;

					console.log(userId);
					
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

	console.log(login);

	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {email:login,password:password};
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	console.log(jsonPayload);
	
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log(this.status);
			console.log(this.readyState);

			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				console.log(jsonObject);
				userId = jsonObject.id;

				console.log(jsonObject.firstName);
		
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}




function addContact()
{
	var newContactID = document.getElementById("addID").value;
	var newContactFirst = document.getElementById("addFirstName").value;
	var newContactLast  = document.getElementById("addLastname").value;
	var newNumber = document.getElementById("addNumber").value;

	document.getElementById("AddResult").innerHTML = "";

	var tmp = {userID:newContactID,firstname:newContactFirst,lastname:newContactLast,phone:newNumber};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("AddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("AddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	var srch = document.getElementById("searchNumber").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";

	var tmp = {phone:srch};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("accept", "application/json");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function editContact()
{




}


function deleteContact()
{





}
