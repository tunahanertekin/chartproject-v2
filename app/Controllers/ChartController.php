<?php

namespace App\Controllers;

use PDO;
use App\Models\JotForm;


class ChartController extends Controller{

    protected $jotformAPI;

    public function __construct(){
        $jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
    }

    public function index($request,$response,$args){
        ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);
        return $this->c->view->render($response,"example.twig");
    }

}