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
            $this->group('/bar-radar2',function(){
                $this->get('/{mcq}',ChartController::class.":index2");
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
                $this->get('/{scq}',ChartController::class.":radioIndex");
                $this->post('/{scq}',ChartController::class.":radioIndex");
            });
            $this->group('/time-basis',function(){
                $this->get('/{scq}',ChartController::class.":radioTimeBasis");
                $this->post('/{scq}',ChartController::class.":radioTimeBasis");
            });
            $this->group('/related-stats/{scq}/{oq}',function(){
                $this->get('',ChartController::class.":radioRelatedStats");
                $this->post('',ChartController::class.":radioRelatedStats");
            });
                
        });

        $this->group('/dropdown',function(){
            $this->group('/bar-radar',function(){
                $this->get('/{ddq}',ChartController::class.":dropdownIndex");
                $this->post('/{ddq}',ChartController::class.":dropdownIndex");
            });
            $this->group('/time-basis',function(){
                $this->get('/{ddq}',function($request,$response,$args){
                    return "Dropdown: time basis";
                });
                $this->post('/{ddq}',function($request,$response,$args){
                    return "Dropdown: time basis";
                });
            });
            $this->group('/related-stats/{ddq}/{oq}',function(){
                $this->get('',ChartController::class.":dropdownRelatedStats");
                $this->post('',ChartController::class.":dropdownRelatedStats");
            });
        });

        
    });
    
});

