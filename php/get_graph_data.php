<?php
    if (isset($_POST['fromApp']) and $_POST['fromApp'] == true) {
        try {

            $conn = new PDO('mysql:host=localhost;dbname=tagcloud;', 'toshiaki', '');
            $sql = $conn->prepare('call get_nodes();');
            $sql->execute();
            $nodes = $sql->fetchAll(PDO::FETCH_ASSOC);
            #var_dump($nodes);
            #echo '<br><br>';
            $sql = $conn->prepare('call get_links();');
            $sql->execute();
            $links = $sql->fetchAll(PDO::FETCH_ASSOC);
            #var_dump($links);
            #echo '<br><br>';
            $result = array('nodes' => $nodes, 'links' => $links);
            echo json_encode($result);
            $conn = null;

        } catch (PDOException $e) {
            echo 'Erro: <code class="erro">' . $e->getMessage() . '</code>';
        }
    } else {
        echo 'Acesse a página da aplicação.';
    }
?>
