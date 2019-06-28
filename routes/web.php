<?php


use App\Middleware\DefaultMiddleware;

use App\Models\MultipleChoices;
use App\Models\SpecializedData;

use App\Middleware\RedirectIfUnauthenticated;
use Interop\Container\ContainerInterface;

use App\Controllers\ChartController;


$app->get('/',function($request,$response,$args){
    return "Main page";
});

/*
$app->get('/display',function($request,$response,$args){
    return $this->view->render($response, 'display.twig');
    
});
*/


$app->group('/multiple-choices',function(){
    $this->get('',MultipleChoices::class.":index");
    $this->post('',MultipleChoices::class.":index");

    $this->group('/detailed',function(){
        $this->get('',MultipleChoices::class.":detailedIndex");
        $this->post('',MultipleChoices::class.":detailedIndex");
        $this->group('/{qid}',function(){
            $this->post('',MultipleChoices::class.":seeAllAttributes");
            $this->get('',MultipleChoices::class.":seeAllAttributes");
            $this->get('/radar',MultipleChoices::class.":radarCompare");
            $this->post('/radar',MultipleChoices::class.":radarCompare");
        });
    });

    $this->group('/specialized',function(){
        $this->get('',SpecializedData::class.":index");
        $this->post('',SpecializedData::class.":otherQuestions");

        $this->post('/{qid}',SpecializedData::class.":dynamicStats");
    });
    
});

$app->get('/example',ChartController::class.":index");


$app->group('/jotcharts',function(){
    
    $this->get('',ChartController::class.":questionChoice");
        
    $this->group('/index',function(){
        $this->post('',ChartController::class.":index");
    });
   
});

