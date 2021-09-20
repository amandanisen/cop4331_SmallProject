<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$conn = new mysqli("localhost", "Test", "TestUser", "Project1");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $phone = $inData["phone"];
		$stmt = $conn->prepare("SELECT FirstName, LastName, ID, Phone FROM Contacts WHERE Phone LIKE '%" . $phone . "%' AND UserID=?");
		# $contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("i", $inData['userId']);
		$stmt->execute();
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["ID"] . '"';
			//$searchResults .= '"' . $row["Phone"] . '","' . $row["ID"]);
		}
		
		if( $searchCount == 0 )
		{
			http_response_code(500);
			echo json_encode(array("error" => "Phone number not found in Contact Manager"));
			//returnWithError($searchResults );
		}
		else
		{
			http_response_code(200);
			//echo json_encode(array("message" => "Phone number found in Contact Manager"));
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $searchResults, $err )
	{
		$retValue = '{"Phone":[' . $searchResults.'],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '[' . $searchResults . ']';
		sendResultInfoAsJson( $retValue );
	}
	
?>
