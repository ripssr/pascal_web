<?php
header('Content-Type: application/json');
// $host - host where database is, $name - username in database, $password - password for database, $database - name of database
$link = mysqli_connect($host, $name, $password, $database) 
    or die("Ошибка " . mysqli_error($link));
 
if(isset($_GET['article'])){
    $query ="SELECT * FROM articles WHERE id =" . $_GET['article'];
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
    if($result)
    {
        $row = mysqli_fetch_row($result);
        echo json_encode([
            $row[1],
            $row[2]
        ]);
    };
}

mysqli_close($link);
?>
