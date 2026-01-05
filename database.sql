-- 萠愛調理師専門学校 データベース初期化スクリプト

-- データベース作成
CREATE DATABASE IF NOT EXISTS houai_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE houai_school;

-- お問い合わせテーブル作成
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    name VARCHAR(100) NOT NULL COMMENT 'お名前',
    email VARCHAR(100) NOT NULL COMMENT 'メールアドレス',
    phone VARCHAR(20) NOT NULL COMMENT '電話番号',
    category VARCHAR(50) NOT NULL COMMENT 'お問い合わせカテゴリ',
    message TEXT NOT NULL COMMENT 'メッセージ本文',
    ip_address VARCHAR(45) COMMENT 'クライアントIPアドレス',
    user_agent VARCHAR(255) COMMENT 'User Agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    status VARCHAR(20) DEFAULT '未対応' COMMENT 'ステータス',
    INDEX idx_created_at (created_at),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='お問い合わせ';

-- ユーザーテーブル（管理画面用）
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'ユーザー名',
    password VARCHAR(255) NOT NULL COMMENT 'パスワード（ハッシュ化）',
    email VARCHAR(100) NOT NULL COMMENT 'メールアドレス',
    role VARCHAR(20) DEFAULT 'staff' COMMENT 'ロール（admin/staff）',
    is_active TINYINT(1) DEFAULT 1 COMMENT 'アクティブ状態',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ユーザー';

-- お知らせテーブル
CREATE TABLE IF NOT EXISTS news (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    title VARCHAR(255) NOT NULL COMMENT 'タイトル',
    content TEXT NOT NULL COMMENT '内容',
    category VARCHAR(50) COMMENT 'カテゴリ',
    is_published TINYINT(1) DEFAULT 0 COMMENT '公開状態',
    created_by INT COMMENT '作成者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    INDEX idx_published (is_published),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='お知らせ';

-- 体験入学スケジュールテーブル
CREATE TABLE IF NOT EXISTS experience_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    event_date DATE NOT NULL COMMENT 'イベント日付',
    event_time TIME NOT NULL COMMENT 'イベント時間',
    capacity INT DEFAULT 20 COMMENT '定員',
    registered_count INT DEFAULT 0 COMMENT '登録者数',
    description TEXT COMMENT '説明',
    is_open TINYINT(1) DEFAULT 1 COMMENT '開放状態',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    INDEX idx_event_date (event_date),
    INDEX idx_is_open (is_open)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='体験入学セッション';

-- レコード統計用テーブル
CREATE TABLE IF NOT EXISTS statistics (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    date DATE NOT NULL UNIQUE COMMENT '日付',
    page_views INT DEFAULT 0 COMMENT 'ページビュー',
    contact_count INT DEFAULT 0 COMMENT 'お問い合わせ件数',
    experience_inquiries INT DEFAULT 0 COMMENT '体験入学問い合わせ件数',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='統計情報';
