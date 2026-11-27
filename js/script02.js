// script.js

// ハンバーガー
const hamburger = document.querySelector('.l-header__hamburger');
// ナビゲーション
const nav = document.querySelector('.l-header__nav');
// ハンバーガー内のリンク（mobile_link）
const mobileLinks = document.querySelectorAll('.mobile_link');

// ハンバーガー開閉
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('is-open');
  nav.classList.toggle('is-open');
});

// メニュー内リンクをクリックしたら閉じる
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
  });
});




// slick　---カルーセル--- //
$('.slider').slick({
  autoplay: true,//自動的に動き出すか。初期値はfalse。
  infinite: true,//スライドをループさせるかどうか。初期値はtrue。
  speed: 500,//スライドのスピード。初期値は300。
  slidesToShow: 3,//スライドを画面に3枚見せる
  slidesToScroll: 1,//1回のスクロールで1枚の写真を移動して見せる
  prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
  nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
  centerMode: true,//要素を中央ぞろえにする
  variableWidth: true,//幅の違う画像の高さを揃えて表示
  dots: true,//下部ドットナビゲーションの表示

  // スマートフォン用の設定上書き
  responsive: [
    {
      breakpoint: 768, // スマートフォンの画面幅（必要に応じて調整してください）
      settings: {
        slidesToShow: 1,      // 一度に表示する枚数を一枚にします
        centerMode: false,    // 中央配置をオフにするか、パッドをゼロにします
        variableWidth: false, // ★スマホではこれをfalseにして、CSSの横幅指定を効かせます
        arrows: false         // 矢印が邪魔になる場合は非表示にします
      }
    }
  ]
});




// ふわっとの動き
document.addEventListener("DOMContentLoaded", () => {
  // 監視したい要素を取得
  const fadeElements = document.querySelectorAll(".js-fade-in");

  const observerOptions = {
    root: null, // ビューポートを基準にする
    rootMargin: "0px 0px -100px 0px", // 画面の下から100px手前で発火させる
    threshold: 0 // 要素が少しでも見えたら判定
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 画面内に入ったらクラスを追加
        entry.target.classList.add("is-in-view");
        // 一度ふわっとさせたら監視を終了する場合
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
});








//---- 特長の風船の下にスクロールするごとに出てくる点線の動き ----- //
// document.addEventListener("DOMContentLoaded", () => {
//   const container =document.querySelector(".js-line-container");
//   const line = document.querySelector(".js-scroll-line");

//   if(!container || !line) return;

//   const updateLineHeight = () => {
//     // 親要素の画面上での位置と高さを取得 //
//     const rect = container.getBoundingClientRect();
//     const windowHeight = window.innerHeight;

//     // 画面のどの高さまで来たら線を伸ばし始めるか（例：画面の６０％の位置）
//     const startOffset =windowHeight * 0.6;

//     // 親要素の上端が基準線を超えてから進んだ距離を計算
//     const scrolledDistance = startOffset - rect.top;

//     // 0~親要素の高さ　の間に数値を収める
//     const clampedHeight = Math.max(0, Math.min(scrolledDistance, rect.height));

//     // 線の高さに反映
//     line.style.height = `${clampedHeight}px`;
//   };

//   // スクロール時とリサイズ時に実行
//   window.addEventListener("scroll", updateLineHeight, { passive: true });
//   window.addEventListener("resize, updateLineHeight");
//   updateLineHeight(); // 初期表示時にも１回計算
// });


document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".js-line-container");
  if (!container) return;

  const sections = Array.from(container.querySelectorAll(".p-feature__contents"));

  const updateLines = () => {
    const windowHeight = window.innerHeight;
    // 画面のどの高さ（65%の位置）を通過したら線を伸ばし始めるか
    const triggerPoint = windowHeight * 0.65;

    sections.forEach((section, index) => {
      // 最後のセクション（08）には次の風船がないのでスキップ
      if (index >= sections.length - 1) return;

      const line = section.querySelector(".js-scroll-line");
      const currentBalloon = section.querySelector(".p-feature__numbering-balloon");
      const nextBalloon = sections[index + 1].querySelector(".p-feature__numbering-balloon");

      if (!line || !currentBalloon || !nextBalloon) return;

      // 現在のセクションと、2つの風船の画面上の座標を取得
      const sectionRect = section.getBoundingClientRect();
      const currRect = currentBalloon.getBoundingClientRect();
      const nextRect = nextBalloon.getBoundingClientRect();

      // 1. 線の開始位置（現在の風船の下端あたり・横位置は風船の中央）
      const startX = (currRect.left - sectionRect.left) + (currRect.width / 2.5);
      
      const startY = (currRect.bottom - sectionRect.top) - 5; // 風船の少し内側からスタート

      // 2. 次の風船までの最大距離（次の風船の上端まで）
      const maxDistance = (nextRect.top - currRect.bottom) + 10;

      // 線の位置を風船にピタッと合わせる
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;

      // 3. スクロール量に応じた線の伸び具合を計算
      // 風船の下端がトリガーライン（画面の65%）を超えてからの距離
      const scrolled = triggerPoint - currRect.bottom;
      const currentHeight = Math.max(0, Math.min(scrolled, maxDistance));

      line.style.height = `${currentHeight}px`;
    });
  };

  window.addEventListener("scroll", updateLines, { passive: true });
  window.addEventListener("resize", updateLines);
  // 画像の読み込み完了後にも再計算して高さズレを防ぐ
  window.addEventListener("load", updateLines);
  updateLines();
});





