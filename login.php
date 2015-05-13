 <?php
// In this test, the file is named "test.php".

require_once "Auth.php";

function loginFunction()
{
     /*
      * Change the HTML output so that it fits to your
      * application.
      */
     echo "<form method=\"post\" action=\"test.php?login=1\">";
     echo "<input type=\"text\" name=\"username\">";
     echo "<input type=\"password\" name=\"password\">";
     echo "<input type=\"submit\">";
     echo "</form>";
}

if (isset($_GET['login']) && $_GET['login'] == 1) {
     $optional = true;
} else {
     $optional = false;
}

$options = array(
  'dsn' => "mysql://user:password@localhost/database",
  );
$a = new Auth("DB", $options, "loginFunction", $optional);

$a->start();

echo "Everybody can see this text!<br />";

if (!isset($_GET['login'])) {
     echo "<a href=\"test.php?login=1\">Click here to log in</a>\n";
}

if ($a->getAuth()) {
     echo "One can only see this if he is logged in!";
}
?> 