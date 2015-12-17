<?php
    header ('Content-type: text/html; charset=UTF-8');
    #if (isset($_GET["fromApp"])
      #and $_GET["fromApp"]==true) {
        try {

            $conn = new PDO('mysql:host=localhost;dbname=tagcloud', 'toshiaki', '');
            $sql = $conn->prepare('call get_tags(:nid1,:nid2)');
            $nid1 = (int) $_GET["nid1"];
            if (isset($_GET["nid2"])) {
                $nid2 = $_GET["nid2"];
            } else {
                $nid2 = null;
            }
            echo 'nid1:' . $nid1 . '<br>';
            echo 'nid2:' . $nid2 . '<br>';
            $sql->bindValue(':nid1', $nid1, PDO::PARAM_INT);
            $sql->bindValue(':nid2', $nid2, PDO::PARAM_INT);
            $sql->execute();
            $tags = $sql->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tags);
            $conn = null;

        } catch (PDOException $e) {
            echo 'Erro: <code class="erro">' . $e->getMessage() . '</code>';
        }
    #} else {
        #echo 'Acesse a página da aplicação.';
    #}
?>
