<?php
    header ('Content-type: application/json; charset=UTF-8');
    if (isset($_GET["fromApp"])
      and $_GET["fromApp"] == true) {

        $host = 'localhost';
        $dbname = 'Tagcloud';
        $mysql_user = 'root';
        $mysql_password = '';

        try {

            $conn = new PDO('mysql:host='.$host.';dbname='.$dbname.';charset=utf8', $mysql_user, $mysql_password);
            $sql = $conn->prepare('call get_tags(:nid1,:nid2)');
            $nid1 = (int) $_GET["nid1"];
            if (isset($_GET["nid2"])) {
                $nid2 = (int) $_GET["nid2"];
            } else {
                $nid2 = null;
            }
            $sql->bindParam(':nid1', $nid1, PDO::PARAM_INT);
            $sql->bindParam(':nid2', $nid2, PDO::PARAM_INT);
            $sql->execute();
            $tags = $sql->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tags);
            $conn = null;

        } catch (PDOException $e) {
            echo 'Erro: <code class="erro">' . $e->getMessage() . '</code>';
        }
    } else {
        echo 'Acesse a página da aplicação.';
    }
?>
