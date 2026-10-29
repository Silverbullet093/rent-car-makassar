<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/rcm-makassar');
});

Route::get('/rcm-makassar', function () {
    return view('index');
});

Route::get('/adminrcm', function () {
    return view('admin');
});

Route::get('/admin', function () {
    return redirect('/adminrcm');
});
