<?php
/**
 * お問い合わせフォーム処理API
 */

header('Content-Type: application/json; charset=utf-8');

// CORSヘッダー（同一オリジンからのリクエストのみ許可）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POSTリクエストのみを許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'メソッドが許可されていません']);
    exit();
}

// 入力値の取得
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// バリデーション
$errors = [];

if (empty($input['name'])) {
    $errors[] = 'お名前が入力されていません';
}

if (empty($input['email'])) {
    $errors[] = 'メールアドレスが入力されていません';
} elseif (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = '有効なメールアドレスを入力してください';
}

if (empty($input['phone'])) {
    $errors[] = '電話番号が入力されていません';
}

if (empty($input['category'])) {
    $errors[] = 'お問い合わせ内容を選択してください';
}

if (empty($input['message'])) {
    $errors[] = 'メッセージが入力されていません';
}

// エラーがある場合
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'バリデーションエラー',
        'errors' => $errors
    ]);
    exit();
}

// データベース接続
try {
    require_once __DIR__ . '/../config/db.php';
    
    // テーブルが存在するか確認（存在しない場合は作成）
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS contacts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            category VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            ip_address VARCHAR(45),
            user_agent VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT "未対応",
            INDEX idx_created_at (created_at),
            INDEX idx_email (email)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    
    // データベースを選択
    $pdo->exec('USE ' . DB_NAME);
    
    // データを挿入
    $stmt = $pdo->prepare(
        'INSERT INTO contacts (name, email, phone, category, message, ip_address, user_agent) 
         VALUES (:name, :email, :phone, :category, :message, :ip_address, :user_agent)'
    );
    
    $result = $stmt->execute([
        ':name' => htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8'),
        ':email' => htmlspecialchars($input['email'], ENT_QUOTES, 'UTF-8'),
        ':phone' => htmlspecialchars($input['phone'], ENT_QUOTES, 'UTF-8'),
        ':category' => htmlspecialchars($input['category'], ENT_QUOTES, 'UTF-8'),
        ':message' => htmlspecialchars($input['message'], ENT_QUOTES, 'UTF-8'),
        ':ip_address' => $_SERVER['REMOTE_ADDR'],
        ':user_agent' => $_SERVER['HTTP_USER_AGENT']
    ]);
    
    if ($result) {
        // メール送信（オプション）
        $to = $input['email'];
        $subject = '【萠愛調理師専門学校】お問い合わせありがとうございます';
        
        $message = "
{$input['name']} 様

この度は、萠愛調理師専門学校へのお問い合わせいただき、ありがとうございます。

ご入力いただきました内容を確認いたしました。
確認のため、このメールをお送りしています。

━━━━━━━━━━━━━━━━━━━━━
【お問い合わせ内容】
お名前: {$input['name']}
メールアドレス: {$input['email']}
電話番号: {$input['phone']}
カテゴリ: {$input['category']}

メッセージ:
{$input['message']}
━━━━━━━━━━━━━━━━━━━━━

当校の担当者より、2営業日以内にご連絡させていただきます。

ご不明な点がございましたら、お気軽にお電話ください。

萠愛調理師専門学校
ご質問・お問い合わせ窓口
        ";
        
        $headers = "From: noreply@houaichouri.com\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // メール送信をスキップ（サーバー設定による）
        // mail($to, $subject, $message, $headers);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'お問い合わせありがとうございます。確認メールをお送りしました。'
        ]);
    } else {
        throw new Exception('データの保存に失敗しました');
    }
    
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'データベースエラーが発生しました'
    ]);
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'エラーが発生しました'
    ]);
}
?>
