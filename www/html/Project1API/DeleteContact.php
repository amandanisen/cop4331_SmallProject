
<?php

$inData = getRequestInfo();

//connect to DB using our user
$conn = new mysqli("localhost", "Test", "TestUser", "Project1");
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //check if id is in database
    $stmt = $conn->prepare("Select ID
                           FROM
                           Contacts
                           WHERE
                           ID=?");
    //bind the int param to id
    $stmt->bind_param("i", $inData["id"]);
    $stmt->execute();
    //get results
    $result = $stmt->get_result();
    
    //if ID is found in DB, delete row
    if( $row = $result->fetch_assoc()  )
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        //bind the int param to id
        $stmt->bind_param("i", $inData["id"]);
        
        // execute query
        if($stmt->execute()){
            //if successful http = 200
            http_response_code(200);
            echo json_encode(array("message" => "Contact deleted successfully"));
        }else{
            //else
            http_response_code(500);
            // tell the user
            echo json_encode(array("error" => "Unable to delete Contact"));
        }
    //if ID was not found, send 500 error and message
    }else{
        // set response code - 500 service unavailable
        http_response_code(500);
        // tell the user
        echo json_encode(array("error" => "ID not found in DB"));
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

?>
