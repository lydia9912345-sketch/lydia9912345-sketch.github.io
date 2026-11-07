const languageButton = document.getElementById('language-toggle');
const menuButton = document.getElementById('menu-toggle');
const nav = document.querySelector('.desktop-nav');
const toast = document.getElementById('toast');
let language = 'zh';
let toastTimer;
let activePortfolioCategory = '全部';
const portfolioCategories = [
  ['全部', 'All'], ['传媒', 'Media'], ['商科', 'Business'], ['社科', 'Social Sciences'],
  ['教育', 'Education'], ['计算机', 'Computer Science'], ['工科', 'Engineering'],
  ['语言', 'Languages'], ['心理', 'Psychology'], ['法律', 'Law'], ['艺术', 'Arts'], ['城市设计', 'Urban Design']
];

function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach((element) => {
    element.innerHTML = element.dataset[language];
  });
  languageButton.innerHTML = language === 'zh' ? 'EN <span>↗</span>' : '中文 <span>↗</span>';
  languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch language to English' : '切换为中文');
  menuButton.setAttribute('aria-label', language === 'zh' ? '打开菜单' : 'Open menu');
  renderPortfolio();
  renderAudio();
}

languageButton.addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.getElementById('copy-phone').addEventListener('click', async (event) => {
  const value = event.currentTarget.dataset.value;
  try {
    await navigator.clipboard.writeText(value);
    toast.textContent = language === 'zh' ? '电话号码已复制' : 'Phone number copied';
  } catch {
    toast.textContent = value;
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
});

function renderPortfolio() {
  const categoryBox = document.getElementById('portfolio-categories');
  const list = document.getElementById('portfolio-list');
  const count = document.getElementById('portfolio-count');
  if (!categoryBox || !list || !count || !Array.isArray(window.portfolioDocs)) return;
  categoryBox.replaceChildren();
  portfolioCategories.forEach(([zh, en]) => {
    const key = zh === '全部' ? '全部' : zh;
    const number = key === '全部' ? window.portfolioDocs.length : window.portfolioDocs.filter((doc) => doc.categories.includes(key)).length;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `category-button${activePortfolioCategory === key ? ' active' : ''}`;
    button.setAttribute('aria-pressed', String(activePortfolioCategory === key));
    button.textContent = `${language === 'zh' ? zh : en} · ${number}`;
    button.addEventListener('click', () => {
      activePortfolioCategory = key;
      renderPortfolio();
    });
    categoryBox.append(button);
  });

  const docs = activePortfolioCategory === '全部'
    ? window.portfolioDocs
    : window.portfolioDocs.filter((doc) => doc.categories.includes(activePortfolioCategory));
  count.textContent = language === 'zh' ? `当前显示 ${docs.length} 篇文书` : `Showing ${docs.length} statement${docs.length === 1 ? '' : 's'}`;
  list.replaceChildren();
  if (!docs.length) {
    const empty = document.createElement('p');
    empty.className = 'portfolio-empty';
    const chosen = portfolioCategories.find(([zh]) => zh === activePortfolioCategory);
    empty.textContent = language === 'zh'
      ? `「${chosen?.[0] || activePortfolioCategory}」模块暂未收到对应文书，后续可继续补充。`
      : `No statements have been added to ${chosen?.[1] || activePortfolioCategory} yet.`;
    list.append(empty);
    return;
  }

  docs.forEach((doc, index) => {
    const article = document.createElement('article');
    article.className = 'essay-card';
    const head = document.createElement('div');
    head.className = 'essay-head';
    const serial = document.createElement('span');
    serial.className = 'essay-serial';
    serial.textContent = String(index + 1).padStart(2, '0');
    const tags = document.createElement('div');
    tags.className = 'essay-tags';
    doc.categories.forEach((category) => {
      const tag = document.createElement('span');
      tag.textContent = language === 'zh' ? category : (portfolioCategories.find(([zh]) => zh === category)?.[1] || category);
      tags.append(tag);
    });
    head.append(serial, tags);
    const title = document.createElement('h3');
    title.textContent = doc.title;
    const details = document.createElement('details');
    details.className = 'essay-details';
    const summary = document.createElement('summary');
    summary.textContent = language === 'zh' ? '展开全文' : 'Read full statement';
    const body = document.createElement('div');
    body.className = 'essay-body';
    doc.paragraphs.forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      body.append(p);
    });
    details.append(summary, body);
    article.append(head, title, details);
    list.append(article);
  });
}

function renderAudio() {
  const list = document.getElementById('audio-list');
  if (!list) return;
  const samples = Array.isArray(window.audioSamples) ? window.audioSamples : [];
  list.replaceChildren();
  if (!samples.length) {
    const empty = document.createElement('p');
    empty.className = 'audio-empty';
    empty.textContent = language === 'zh' ? '音频录音待添加。' : 'Audio samples will be added here.';
    list.append(empty);
    return;
  }
  samples.forEach((sample, index) => {
    const card = document.createElement('article');
    card.className = 'audio-card';
    const number = document.createElement('span');
    number.className = 'audio-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const content = document.createElement('div');
    content.className = 'audio-card-content';
    const heading = document.createElement('div');
    heading.className = 'audio-card-heading';
    const title = document.createElement('h3');
    title.textContent = language === 'zh' ? sample.title : (sample.titleEn || sample.title);
    const label = document.createElement('span');
    label.className = 'audio-label';
    label.textContent = language === 'zh' ? (sample.label || '英语自我介绍') : (sample.labelEn || 'English introduction');
    heading.append(title, label);
    content.append(heading);
    const descriptionText = language === 'zh' ? sample.description : (sample.descriptionEn || sample.description);
    if (descriptionText) {
      const description = document.createElement('p');
      description.textContent = descriptionText;
      content.append(description);
    }
    if (sample.src) {
      const player = document.createElement('audio');
      player.preload = 'metadata';
      player.src = sample.src;
      player.className = 'audio-native';
      player.setAttribute('aria-hidden', 'true');
      const controls = document.createElement('div');
      controls.className = 'audio-controls';
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'audio-play-button';
      play.setAttribute('aria-label', language === 'zh' ? `播放${sample.title}` : `Play ${sample.titleEn || sample.title}`);
      play.setAttribute('aria-pressed', 'false');
      play.textContent = '▶';
      const elapsed = document.createElement('span');
      elapsed.className = 'audio-time audio-elapsed';
      elapsed.textContent = '0:00';
      const seek = document.createElement('input');
      seek.type = 'range';
      seek.className = 'audio-seek';
      seek.min = '0';
      seek.max = '100';
      seek.value = '0';
      seek.step = '0.1';
      seek.setAttribute('aria-label', language === 'zh' ? '调整播放进度' : 'Seek audio');
      const duration = document.createElement('span');
      duration.className = 'audio-time audio-duration';
      duration.textContent = '--:--';
      controls.append(play, elapsed, seek, duration);
      content.append(player, controls);

      const formatTime = (seconds) => {
        if (!Number.isFinite(seconds)) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };
      const updateProgress = () => {
        const progress = player.duration ? (player.currentTime / player.duration) * 100 : 0;
        seek.value = String(progress);
        seek.style.setProperty('--audio-progress', `${progress}%`);
        elapsed.textContent = formatTime(player.currentTime);
        duration.textContent = formatTime(player.duration);
      };
      const updatePlayButton = (isPlaying) => {
        play.textContent = isPlaying ? 'Ⅱ' : '▶';
        play.setAttribute('aria-pressed', String(isPlaying));
        play.setAttribute('aria-label', language === 'zh'
          ? `${isPlaying ? '暂停' : '播放'}${sample.title}`
          : `${isPlaying ? 'Pause' : 'Play'} ${sample.titleEn || sample.title}`);
      };
      player.addEventListener('loadedmetadata', updateProgress);
      player.addEventListener('timeupdate', updateProgress);
      player.addEventListener('play', () => updatePlayButton(true));
      player.addEventListener('pause', () => updatePlayButton(false));
      player.addEventListener('ended', () => updatePlayButton(false));
      play.addEventListener('click', async () => {
        if (player.paused) {
          list.querySelectorAll('audio').forEach((other) => {
            if (other !== player) other.pause();
          });
          try {
            await player.play();
          } catch {
            updatePlayButton(false);
          }
        } else {
          player.pause();
        }
      });
      seek.addEventListener('input', () => {
        if (!player.duration) return;
        player.currentTime = (Number(seek.value) / 100) * player.duration;
        updateProgress();
      });
      updateProgress();
    } else {
      const pending = document.createElement('div');
      pending.className = 'audio-pending';
      const icon = document.createElement('span');
      icon.className = 'audio-note-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '♪';
      const pendingText = document.createElement('span');
      pendingText.textContent = language === 'zh' ? '录音文件待添加' : 'Recording to be added';
      pending.append(icon, pendingText);
      content.append(pending);
    }
    card.append(number, content);
    list.append(card);
  });
}

renderPortfolio();
renderAudio();
window.audioSamplesReady?.then(() => renderAudio()).catch(() => {});
