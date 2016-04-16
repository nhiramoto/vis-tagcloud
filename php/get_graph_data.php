<?php
    header ('Content-type: application/json; charset=UTF-8');
    // if (isset($_POST['fromApp']) and $_POST['fromApp'] == true) {
        $host = 'localhost';
        $dbname = 'Tagcloud';
        $mysql_user = 'root';
        $mysql_password = '';
        try {

            $conn = new PDO('mysql:'.$host.'=localhost;dbname='.$dbname.';charset=utf8', $mysql_user, $mysql_password);
            $sql = $conn->prepare('call get_nodes();');
            $sql->execute();
            $nodes = $sql->fetchAll(PDO::FETCH_ASSOC);
            // var_dump($nodes);
            // echo '<br><br>';
            $sql = $conn->prepare('call get_links();');
            $sql->execute();
            $links = $sql->fetchAll(PDO::FETCH_ASSOC);
            // var_dump($links);
            // echo '<br><br>';
            $result = array('nodes' => $nodes, 'links' => $links);
            echo json_encode($result);
            $conn = null;

        } catch (PDOException $e) {
            echo 'Erro: <code class="erro">' . $e->getMessage() . '</code>';
        }
    // } else {
    //     echo 'Acesse a página da aplicação.';
    // }
?>
