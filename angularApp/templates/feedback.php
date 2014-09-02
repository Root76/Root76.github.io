<?php

if(isset($_POST['submit'])){

  $send_to = "harroisweaver@gmail.com";
  $send_subject = "DayWon Feedback";

  /*Be careful when editing below this line */

  $f_name = cleanupentries($_POST["topic"]);
  $f_email = cleanupentries($_POST["email"]);
  $f_message = cleanupentries($_POST["message"]);

  function cleanupentries($entry) {
      $entry = trim($entry);
      $entry = stripslashes($entry);
      $entry = htmlspecialchars($entry);

      return $entry;
  }

  $message = "This email was submitted on " . date('m-d-Y') . 
  "\n\nName: " . $f_name . 
  "\n\nE-Mail: " . $f_email . 
  "\n\nMessage: \n" . $f_message;

  $send_subject .= " - {$f_name}";

  $headers = "From: " . f_email . "\r\n" .
      "Reply-To: " . f_email . "\r\n" .
      "X-Mailer: PHP/" . phpversion();

  if (!$f_email) {
      echo "no email";
      exit;
  } else 
  if (!$f_name){
      echo "no name";
      exit;
  } else{
  if (filter_var($f_email, FILTER_VALIDATE_EMAIL)) {
      mail($send_to, $send_subject, $message, $headers);
      echo "true";
  else{
      echo "invalid email";
      exit;
      }
  }

}

?>

<div>
  <div class="modal-header">
    <a href="javascript:void(0)" title="Close" class="close" onclick="$('.modal').click()">X</a>
    <h2 id="createHeader">Feedback</h2>
  </div>
  <div class="modal-body">   
    <form id="feedbacktext" action="" method="POST" enctype="text/plain">
      <select id="feedbackselect" name="topic">
        <option>Tell us what you love</option>
        <option>Tell us what you dislike</option>
        <option>Report a bug</option>
        <option>Feature request</option>
        <option>Request help</option>
        <option>Other</option>
      </select>
      <input name="email" /></input>
      <textarea name="message"></textarea>
      <input type="submit" name="submit" value="Submit"></input>
    </form>
  </div>
</div>