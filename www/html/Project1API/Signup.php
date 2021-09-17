
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
    $stmt = $conn->prepare("SELECT Email FROM Users WHERE Email=?");
    //bind string param to '?'
    $stmt->bind_param("s", $inData["email"]);
    $stmt->execute();
    $result = $stmt->get_result();
    //echo json_encode(array("message" => "test"));
    //if found, send error
    //else continue to insert
    //  if( $row = $result->fetch_assoc() )
    //  {
    //      http_response_code(409);
    //      echo json_encode(array("error" => "Email already in use"));        
//=    }

//     else{
         $stmt = $conn->prepare("INSERT INTO Users (Email, `Password`, FirstName, LastName, Phone) VALUES (?, ?, ?, ?, ?)");
//         // prepare query
//         //bind string params to query
         $stmt->bind_param("sssss", $inData["email"], $inData["password"], $inData["firstname"], $inData["lastname"], $inData["phone"]);
//         // execute query
         if($stmt->execute()){
//             //get the ID in DB
              $last_id = mysqli_insert_id($conn);
//             // set response code - 201 created
             http_response_code(201);
             //echo json_encode(array("message" => "Able to create User."));
             returnSuccessful($inData["email"], $inData["password"], $inData["firstname"], $inData["lastname"], $inData["phone"], $last_id);
//             //returnSuccessful($inData["firstname"], $inData["lastname"], $inData["phone"], $inData["email"], $inData["password"], $last_id);
         }
//         // if unable to create the account, tell the user
         else{
            
//             // set response code - 503 service unavailable
             http_response_code(503);
             echo json_encode(array("message" => "Unable to create User."));
         }
//     }
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
    $retValue = '{"id":0,"firstName":"","lastName":"","email":"","password":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnSuccessful( $email, $password, $firstName, $lastName, $phone, $last_id)
{
    $retValue = '{"created": "yes","id":"' . $last_id . '","email":"' . $email . '","password":"' . $password .'","firstName":"' . $firstName . '","lastName":"' . $lastName . '", "phone":"' . $phone . '"}';
    sendResultInfoAsJson( $retValue );
}

?>

