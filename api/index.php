<?php

// Pastikan environment Vercel dan Serverless terdeteksi
putenv('VERCEL=1');
$_ENV['VERCEL'] = '1';
$_SERVER['VERCEL'] = '1';

// Set storage paths ke direktori /tmp (writable di AWS Lambda/Vercel)
putenv('LARAVEL_STORAGE_PATH=/tmp/storage');
$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
$_SERVER['LARAVEL_STORAGE_PATH'] = '/tmp/storage';

putenv('APP_STORAGE=/tmp/storage');
$_ENV['APP_STORAGE'] = '/tmp/storage';

putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

// Fallback APP_KEY agar enkripsi & session tidak error 500
if (!getenv('APP_KEY') && empty($_ENV['APP_KEY']) && empty($_SERVER['APP_KEY'])) {
    $defaultKey = 'base64:LcK8klW/A/Q1keuDEZ+tgB79msWTyjwznZ8DCOQjPOg=';
    putenv("APP_KEY=$defaultKey");
    $_ENV['APP_KEY'] = $defaultKey;
    $_SERVER['APP_KEY'] = $defaultKey;
}

// Pastikan REMOTE_ADDR terdefinisi agar validasi proxy tidak melempar TypeError
if (empty($_SERVER['REMOTE_ADDR'])) {
    $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
}

// Tangani host dan protokol HTTPS dari proxy Vercel
if (!empty($_SERVER['HTTP_X_FORWARDED_HOST'])) {
    $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
    $_SERVER['SERVER_NAME'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
}

if (
    (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
    (!empty($_SERVER['HTTP_X_FORWARDED_PORT']) && $_SERVER['HTTP_X_FORWARDED_PORT'] === '443') ||
    isset($_SERVER['VERCEL'])
) {
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SERVER_PORT'] = '443';
}

// Pastikan semua direktori runtime di /tmp tersedia
$storageDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Jalankan aplikasi Laravel via public/index.php
require __DIR__ . '/../public/index.php';
