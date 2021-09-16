
<?php

$inData = getRequestInfo();


$conn = new mysqli("localhost", "Test", "TestUser", "Project1");
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //check if user exists by checking their id
    $stmt = $conn->prepare("Select *
                           FROM
                           Contacts
                           WHERE
                           UserID=?;");
    //bind string param to '?'
    $stmt->bind_param("i", $inData["userID"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $response = array();
//    echo json_encode(array);/
    while ($row = $result->fetch_assoc()) {
        $response["users"][] = $row;
       
    }
    echo json_encode($response);
//    echo json_encode(array);
    //if found, retrieve all contacts
//    if( $row = $result->fetch_assoc()  )
//    {
//        http_response_code(200);
//
////        echo json_encode(array("message" => $row));
//
////        returnSuccessful($row['firstName'], $row['lastName'], $row['ID'], $row['userID']);
//
//    }else{
//        http_response_code(409);
//        echo json_encode(array("error" => "User not found."));
//    }
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

function returnSuccessful( $firstName, $lastName, $phone, $last_id, $userID)
{
    $retValue = '{"id":"' . $last_id . '", "userID":"' . $userID . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '", "phone":"' . $phone . '"}';
    sendResultInfoAsJson( $retValue );
}

?>
