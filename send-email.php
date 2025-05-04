<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Check honeypot field for spam prevention
    if (!empty($_POST['website'])) {
        // This is likely a spam bot
        http_response_code(200); // Pretend everything is fine
        echo json_encode(['success' => false, 'message' => 'Spam detected']);
        exit;
    }
    
    // Get form data
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
    
    // Validate data
    if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill all fields with valid information']);
        exit;
    }
    
    // Set email recipient
    $to = "info@lovetoleather.com";
    
    // Set email subject
    $subject = "New Contact Form Message from $name";
    
    // Build email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Build email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'There was a problem sending your message']);
    }
} else {
    // Not a POST request
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'There was a problem with your submission, please try again']);
}
?>
