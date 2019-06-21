<?php

namespace App\Controllers;

use PDO;

class ChartController extends Controller{

    public function index($request,$response,$args){
        ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);
        return $this->c->view->render($response,"example.twig");
    }

    public function support($request,$response,$args){
        return $this->c->view->render($response,"support.twig");
    }       

}