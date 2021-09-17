
<?php

$inData = getRequestInfo();


$conn = new mysqli("localhost", "Test", "TestUser", "Project1");
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //check if phone number is already in database
    //if it is, say phone number is already being used
    $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID=?");
    $stmt->bind_param("i", $inData["id"]);
    $stmt->execute();
    $result = $stmt->get_result();
     if( $row = $result->fetch_assoc())
    {
         $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ? WHERE ID = ?");
         $stmt->bind_param("sssi", $inData["firstname"], $inData["lastname"], $inData["phone"], $inData["id"]);
        if($stmt->execute()){
             // set response code - 201 created
             http_response_code(201);
             returnSuccessful($inData["firstname"], $inData["lastname"], $inData["phone"], $inData["id"]);
       }
        
        
//         // if unable to create the contact, tell the user
         else{            
             // set response code - 503 service unavailable
             http_response_code(503);
             echo json_encode(array("message" => "Unable to edit Contact."));
         }
     }else{
            http_response_code(409);
            echo json_encode(array("error" => "ID not found in database"));
     }
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

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnSuccessful( $firstName, $lastName, $phone, $last_id)
{
    $retValue = '{"Updated": "yes","id":"' . $last_id . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '", "phone":"' . $phone . '"}';
    sendResultInfoAsJson( $retValue );
}

?>
