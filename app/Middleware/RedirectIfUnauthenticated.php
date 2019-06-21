<?php

namespace App\Middleware;

class RedirectIfUnauthenticated{

    public function __invoke($request,$response,$next){
        if(!isset($_SESSION['username'])){
            $response = $response->withRedirect('/public/login');
        }
        return $next($request,$response);
    }

}
