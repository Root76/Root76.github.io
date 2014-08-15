<?php

$send_to = "harrisweaver@gmail.com";
$send_subject = "DayWon Feedback";

if (isset($_POST['email'])) {

    $f_subject = $_POST["subject"];
    $f_email = $_POST["email"];
    $f_message = $_POST["message"];

    $message = "This email was submitted on " . date('m-d-Y') . 
    "\n\Subject: " . $f_subject . 
    "\n\nE-Mail: " . $f_email . 
    "\n\nMessage: \n" . $f_message;

    $send_subject .= " - {$f_subject}";

    $headers = "From: " . "feedback@daywon.com" . "\r\n" .
        "Reply-To: " . "feedback@daywon.com" . "\r\n" .
        "X-Mailer: PHP/" . phpversion();

    if (!$f_email) {
        echo "no email";
        exit;
    }else if (!$f_subject){
        echo "no name";
        exit;
    }else{
        if (filter_var($f_email, FILTER_VALIDATE_EMAIL)) {
            mail($send_to, $send_subject, $message, $headers);
            echo "true";
        }else{
            echo "invalid email";
            exit;
        }
    }

}

?>