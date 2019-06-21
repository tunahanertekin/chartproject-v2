<?php

require __DIR__ . '/../bootstrap/app.php';


/*
$app->get('/', function($request,$response,$args){
    $users=$this->db->query('SELECT * FROM usertable;')->fetchAll(PDO::FETCH_OBJ);
    
    var_dump($users);        
});
*/

/*
$app->get('/customer/{username}',function($request,$response,$args){
    $user=$this->db->prepare('SELECT * FROM usertable WHERE username = :username');

    $user->execute([
        'username' => $args['username']
    ]);

    $user = $user->fetch(PDO::FETCH_OBJ);
    return $this->view->render($response,'profile.twig',compact('user'));
    //var_dump($user->fetch(PDO::FETCH_OBJ));
});
*/



$app->run();
?>