<?php

use App\Middleware\DefaultMiddleware;

use App\Middleware\RedirectIfUnauthenticated;
use Interop\Container\ContainerInterface;

use App\Controllers\ChartController;

$app->group('/jotcharts',function(){
    
    $this->get('',ChartController::class.":formChoice");
        
    $this->group('/{formID}',function(){

        $this->get('',ChartController::class.":questionChoice");
        $this->post('',ChartController::class.":questionChoice");

        $this->group('/bar-radar',function(){
            $this->get('/{mcq}',ChartController::class.":index");
            $this->post('/{mcq}',ChartController::class.":index");
        });
        $this->group('/time-basis',function(){
            $this->get('/{mcq}',ChartController::class.":timeBasis");
            $this->post('/{mcq}',ChartController::class.":timeBasis");
        });
        $this->group('/related-stats/{mcq}/{oq}',function(){
            $this->get('',ChartController::class.":relatedStats");
            $this->post('',ChartController::class.":relatedStats");
        });
    });
    
   
});

$app->get('/frontend',ChartController::class.":frontendTrial");
