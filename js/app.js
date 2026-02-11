(function(){
  // Use the actual images from the /img folder with updated captions provided by the user
  // Swap photos 7 & 8 (sources swapped, titles left in place)
  const IMAGES = [
    { src: 'img/IMG-20250819-WA0002.jpeg', title: 'Ever since we met', desc: '' },
    { src: 'img/IMG-20250820-WA0005.jpeg', title: "I knew you'd be the one", desc: '' },
    { src: 'img/IMG-20251228-WA0000.jpg', title: 'Every moment with you is so precious', desc: '' },
    { src: 'img/IMG-20260104-WA0013.jpg', title: "I've prayed all my life for you", desc: '' },
    { src: 'img/PXL_20251224_192530235.jpg', title: 'And I am grateful to God that he answered me', desc: '' },
    { src: 'img/PXL_20251230_225823676.jpg', title: 'I ask him to bless our relationship continually', desc: '' },
    { src: 'img/PXL_20250821_144901203.jpg', title: 'His blessings are greater than I could possibly say', desc: '' },
    { src: 'img/PXL_20250820_121608439.jpg', title: 'I love you, Diana', desc: '' },
    { src: 'img/IMG-20260106-WA0001.jpg', title: "Here's to our new beginning", desc: '' },
    { src: 'img/IMG-20260106-WA0002.jpg', title: 'forever ♥︎', desc: '' }
  ];

  const heartButton = document.getElementById('heartButton');
  const gallery = document.getElementById('gallery');
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let current = 0;

  function buildSlides(){
    if(!carousel) return;
    carousel.innerHTML = '';

    IMAGES.forEach((img,i)=>{
      const slide = document.createElement('figure');
      slide.className = 'slide';
      slide.setAttribute('data-index', i);
      slide.innerHTML = `
        <img src="${img.src}" alt="${img.title}">
        <figcaption>
          <h2>${img.title}</h2>
          <p>${img.desc}</p>
        </figcaption>
      `;
      // Start off-screen to the right
      slide.style.transform = 'translateX(100%)';
      carousel.appendChild(slide);
    });

    // Show first slide
    requestAnimationFrame(()=>{
      current = 0;
      updateSlides(true);
    });
  }

  function updateSlides(entrance){
    if(!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    slides.forEach((s, idx)=>{
      s.style.transition = entrance ? 'transform 600ms cubic-bezier(.22,.9,.3,1)' : 'transform 400ms ease';
      s.style.transform = `translateX(${100*(idx-current)}%)`;
    });
  }

  function showGallery(){
    if(!gallery) return;
    gallery.setAttribute('aria-hidden','false');
    gallery.classList.add('visible');
  }

  function hideHeartArea(){
    const center = document.querySelector('.center');
    if(center) center.style.display = 'none';
  }

  function goTo(index){
    if(!carousel) return;
    if(index < 0) index = 0;
    if(index >= IMAGES.length) index = IMAGES.length - 1;
    current = index;
    updateSlides();
  }

  // Buttons
  if(nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); goTo(current+1); });
  if(prevBtn) prevBtn.addEventListener('click', (e)=>{ e.preventDefault(); goTo(current-1); });

  // Keyboard
  document.addEventListener('keydown', (e)=>{
    if(gallery && gallery.classList.contains('visible')){
      if(e.key === 'ArrowRight') goTo(current+1);
      if(e.key === 'ArrowLeft') goTo(current-1);
    }
  });

  // Touch swipe
  let startX = null;
  if(carousel){
    carousel.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
    carousel.addEventListener('touchend', (e)=>{
      if(startX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const dx = endX - startX;
      if(dx < -40) goTo(current+1);
      if(dx > 40) goTo(current-1);
      startX = null;
    });
    // click to advance
    carousel.addEventListener('click', ()=>goTo(current+1));
  }

  // Heart click animation
  if(heartButton){
    heartButton.addEventListener('click', ()=>{
      const svg = heartButton.querySelector('svg') || heartButton;
      const text = svg ? svg.querySelector('.svg-text') : null;
      if(text){ text.style.transition = 'opacity 200ms ease'; text.style.opacity = '0'; }

      // clone for fullscreen animation
      const rect = svg.getBoundingClientRect();
      const clone = svg.cloneNode(true);
      clone.classList.add('anim-heart');
      clone.style.position = 'fixed';
      clone.style.left = rect.left + 'px';
      clone.style.top = rect.top + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.margin = '0';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);

      // animate
      void clone.offsetWidth;
      clone.style.transition = 'all 650ms cubic-bezier(.22,.9,.3,1)';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.width = '100vw';
      clone.style.height = '100vh';

      const heartColor = getComputedStyle(document.documentElement).getPropertyValue('--heart-color').trim() || '#FCA2FC';
      const path = clone.querySelector('.heart-shape');
      if(path) path.setAttribute('fill', heartColor);

      setTimeout(()=>{
        document.body.style.background = heartColor;

        setTimeout(()=>{
          clone.style.transition = 'opacity 300ms';
          clone.style.opacity = '0';
          setTimeout(()=>{
            clone.remove();

            setTimeout(()=>{
              document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--page-bg').trim() || '#F7F381';
              buildSlides();
              hideHeartArea();
              showGallery();
            }, 200);

          }, 300);
        }, 200);
      }, 700);
    });
  }

})();
