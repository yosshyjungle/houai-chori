/**
 * 萠愛調理師専門学校 - スクリプト
 */

/**
 * ライトボックス（画像拡大表示）機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(img => img.src);
    
    // 画像をクリックしたときのイベントリスナー
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });
    
    // ライトボックスを開く
    function openLightbox(imageSrc) {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // スクロール禁止
    }
    
    // ライトボックスを閉じる
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // スクロール許可
    }
    
    // 前の画像を表示
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }
    
    // 次の画像を表示
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }
    
    // クローズボタン
    lightboxClose.addEventListener('click', closeLightbox);
    
    // 前後のボタン
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // ライトボックスの背景（オーバーレイ）をクリックして閉じる
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // キーボード操作対応
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
});

/**
 * トップへ戻るボタンの機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // スクロール位置を監視してボタンの表示/非表示を制御
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // ボタンクリック時にページ上部にスムーズスクロール
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

/**
 * ハンバーガーメニューの機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (menuToggle && navUl) {
        // メニューオーバーレイが存在しない場合は作成
        if (!menuOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
        }
        
        const overlay = document.querySelector('.menu-overlay');
        
        // ハンバーガーメニューボタンのクリックイベント
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navUl.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // オーバーレイをクリックしてメニューを閉じる
        overlay.addEventListener('click', function() {
            navUl.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // メニュー内のリンクをクリックしてメニューを閉じる
        const navLinks = navUl.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navUl.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

/**
 * お問い合わせフォーム送信処理
 */
async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('.form-button');
    const originalButtonText = submitButton.textContent;
    
    // フォームデータを取得
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        category: document.getElementById('category').value,
        message: document.getElementById('message').value
    };
    
    // 送信ボタンを無効化
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    try {
        // APIにリクエストを送信
        const response = await fetch('api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 成功時
            alert(data.message);
            form.reset();
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        } else {
            // エラー時
            if (data.errors && Array.isArray(data.errors)) {
                alert('エラーが発生しました:\n\n' + data.errors.join('\n'));
            } else {
                alert(data.message || 'エラーが発生しました');
            }
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('通信エラーが発生しました。お時間をおいて再度お試しください。');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

/**
 * カルーセル機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('studentLifeCarousel');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    
    // ドットを生成
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `スライド${index + 1}に移動`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    // スライドを表示する関数
    function showSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // ドットの状態を更新
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 指定したスライドに移動
    function goToSlide(index) {
        showSlide(index);
    }
    
    // 前のスライド
    function prevSlide() {
        showSlide(currentIndex - 1);
    }
    
    // 次のスライド
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    // ボタンのイベントリスナー
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // 自動スライド（オプション）
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5秒ごとに自動スライド
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // マウスホバー時に自動スライドを停止
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 初期化
    startAutoSlide();
});

/**
 * 調理実習の風景カルーセル機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const carousel = document.getElementById('cookingCarousel');
    const prevButton = gallerySection.querySelector('.carousel-prev');
    const nextButton = gallerySection.querySelector('.carousel-next');
    const dotsContainer = document.getElementById('cookingCarouselDots');
    
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    
    // ドットを生成
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `スライド${index + 1}に移動`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    // スライドを表示する関数
    function showSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // ドットの状態を更新
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 指定したスライドに移動
    function goToSlide(index) {
        showSlide(index);
    }
    
    // 前のスライド
    function prevSlide() {
        showSlide(currentIndex - 1);
    }
    
    // 次のスライド
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    // ボタンのイベントリスナー
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // 自動スライド（オプション）
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5秒ごとに自動スライド
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // マウスホバー時に自動スライドを停止
    const carouselContainer = gallerySection.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 初期化
    startAutoSlide();
});
