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
window.jQuery?.('.slider').slick?.({
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


// PC版の風船の結び目を通る波線を、スクロールに合わせて表示する
document.addEventListener("DOMContentLoaded", () => {
  const line = document.querySelector(".p-feature__flow-line");
  if (!line) return;

  const list = line.parentElement;
  const path = line.querySelector("path");
  const balloons = [...list.querySelectorAll(".p-feature__numbering-balloon")];
  let frame = null;

  function updateReveal() {
    frame = null;
    const { top, height } = line.getBoundingClientRect();
    if (height === 0) return;

    const revealAt = window.innerHeight * 0.85;
    const visible = Math.max(0, Math.min(height, revealAt - top));
    line.style.setProperty("--feature-line-hidden", `${height - visible}px`);
  }

  function scheduleReveal() {
    if (frame === null) frame = window.requestAnimationFrame(updateReveal);
  }

  function drawLine() {
    const bounds = line.getBoundingClientRect();
    if (bounds.width === 0) return;

    const anchors = balloons.map(balloon => {
      const rect = balloon.getBoundingClientRect();
      const triangle = window.getComputedStyle(balloon, "::before");
      const knotSize = parseFloat(triangle.width);
      const left = rect.left - bounds.left;
      const top = rect.top - bounds.top;

      return {
        center: { x: left + rect.width / 2, y: top + rect.height / 2 },
        // 回転した三角形の下辺に線を重ねる
        knot: {
          x: left + balloon.clientLeft + parseFloat(triangle.left) + knotSize * 0.65,
          y: top + rect.height - balloon.clientTop - parseFloat(triangle.bottom) - knotSize * 0.1,
        },
      };
    });

    const first = anchors[0].knot;
    const bend = Math.min(112, balloons[0].offsetWidth * 0.72);
    const commands = [`M ${first.x} ${first.y}`];

    anchors.slice(1).forEach(({ center: end, knot }, index) => {
      const start = anchors[index].knot;
      const distance = end.y - start.y;
      const direction = index % 2 === 0 ? -1 : 1;

      // 結び目から真下へ出て、次の風船の背面へ緩やかにつなぐ
      commands.push(
        `C ${start.x} ${start.y + distance / 3}, ` +
        `${end.x + bend * direction} ${end.y - distance / 3}, ${end.x} ${end.y}`
      );

      if (index < anchors.length - 2) {
        commands.push(`L ${knot.x} ${knot.y}`);
      }
    });

    path.setAttribute("d", commands.join(" "));
    scheduleReveal();
  }

  drawLine();
  window.addEventListener("scroll", scheduleReveal, { passive: true });
  window.addEventListener("resize", drawLine);
  window.addEventListener("load", drawLine, { once: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(drawLine);
    observer.observe(list);
    balloons.forEach(balloon => observer.observe(balloon.closest(".p-feature__contents")));
  }
});
