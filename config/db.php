<?php
/**
 * データベース接続設定
 */

// データベース接続情報
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // パスワードが必要な場合は設定
define('DB_NAME', 'houai_school');

// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

try {
    // MySQLに接続
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';charset=utf8mb4',
        DB_USER,
        DB_PASS
    );
    
    // エラーモードを例外にする
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    error_log('Database connection error: ' . $e->getMessage());
    die('データベース接続エラーが発生しました。');
}
?>
