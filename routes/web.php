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


        $this->group('/checkbox',function(){
    
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

        $this->group('/radio',function(){
            $this->group('/bar-radar',function(){
                $this->get('/{mcq}',function($request,$response,$args){
                    return "Single Choice: bar-radar";
                });
                $this->post('/{mcq}',function($request,$response,$args){
                    return "Single Choice: bar-radar";
                });
            });
            $this->group('/time-basis',function(){
                $this->get('/{mcq}',function($request,$response,$args){
                    return "Single Choice: time basis";
                });
                $this->post('/{mcq}',function($request,$response,$args){
                    return "Single Choice: time basis";
                });
            });
            $this->group('/related-stats/{mcq}/{oq}',function(){
                $this->get('',function($request,$response,$args){
                    return "Single Choice: related stats";
                });
                $this->post('',function($request,$response,$args){
                    return "Single Choice: related stats";
                });
            });
        });

        $this->group('/dropdown',function(){
            $this->group('/bar-radar',function(){
                $this->get('/{mcq}',function($request,$response,$args){
                    return "Dropdown: bar-radar";
                });
                $this->post('/{mcq}',function($request,$response,$args){
                    return "Dropdown: bar-radar";
                });
            });
            $this->group('/time-basis',function(){
                $this->get('/{mcq}',function($request,$response,$args){
                    return "Dropdown: time basis";
                });
                $this->post('/{mcq}',function($request,$response,$args){
                    return "Dropdown: time basis";
                });
            });
            $this->group('/related-stats/{mcq}/{oq}',function(){
                $this->get('',function($request,$response,$args){
                    return "Dropdown: related stats";
                });
                $this->post('',function($request,$response,$args){
                    return "Dropdown: related stats";
                });
            });
        });

        
    });
    
});

