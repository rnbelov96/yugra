export {};

const initSlider = (options: {
  imagesLength: number;
  maxMode: number;
  isFlexible: boolean;
  sliderSectionName: string;
  changeModeBreakpoints?: Array<number>;
  withButtons: boolean;
  withNav: boolean;
}) => {
  const getMode = (pageWidth: number) => {
    if (!options.isFlexible) {
      return options.maxMode;
    }

    if (options.maxMode === 3 && options.changeModeBreakpoints) {
      if (pageWidth <= options.changeModeBreakpoints[0]) {
        return 1;
      }
      if (
        pageWidth > options.changeModeBreakpoints[0] &&
        pageWidth <= options.changeModeBreakpoints[1]
      ) {
        return 2;
      }
      return 3;
    }

    if (options.maxMode === 2 && options.changeModeBreakpoints) {
      if (pageWidth <= options.changeModeBreakpoints[0]) {
        return 1;
      }
      return 2;
    }

    return 1;
  };

  const cloneSliderItems = (
    imagesBoxEl: HTMLDivElement,
    itemElList: NodeListOf<Element>,
  ) => {
    let newSliderItemElListBefore: Array<Node>;
    let newSliderItemElListAfter: Array<Node>;

    if (options.imagesLength === 2) {
      newSliderItemElListBefore = [
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
      ];
      newSliderItemElListAfter = [
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
      ];
      imagesBoxEl.prepend(...newSliderItemElListBefore);
      imagesBoxEl.append(...newSliderItemElListAfter);
      return;
    }

    if (options.imagesLength === 3) {
      newSliderItemElListBefore = [
        itemElList[2].cloneNode(true),
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
        itemElList[2].cloneNode(true),
      ];
      newSliderItemElListAfter = [
        itemElList[0].cloneNode(true),
        itemElList[1].cloneNode(true),
        itemElList[2].cloneNode(true),
        itemElList[0].cloneNode(true),
      ];
      imagesBoxEl.prepend(...newSliderItemElListBefore);
      imagesBoxEl.append(...newSliderItemElListAfter);
      return;
    }

    const sliderItemElListBefore = [...itemElList].slice(-4);
    newSliderItemElListBefore = sliderItemElListBefore.map(el =>
      el.cloneNode(true),
    );
    const sliderItemElListAfter = [...itemElList].slice(0, 4);
    newSliderItemElListAfter = sliderItemElListAfter.map(el =>
      el.cloneNode(true),
    );
    imagesBoxEl.prepend(...newSliderItemElListBefore);
    imagesBoxEl.append(...newSliderItemElListAfter);
  };

  let currentImage = 1;
  let pageWidth = document.documentElement.scrollWidth;
  let mode = getMode(pageWidth);

  const cssValueList = [
    {
      mode: 3,
      pos: -100,
      width: 33,
      margin: '0% calc(1% / 6)',
      justifyContent: 'space-between',
    },
    {
      mode: 2,
      pos: -200,
      width: 49,
      margin: '0% calc(2% / 4)',
      justifyContent: 'space-between',
    },
    {
      mode: 1,
      pos: -400,
      width: 98,
      margin: '0% 1%',
      justifyContent: 'center',
    },
  ];
  let initTranslateXPos = cssValueList.find(el => el.mode === mode)
    ?.pos as number;
  let translateXPos = initTranslateXPos;
  let translateStep = 100 / mode;
  let offset: number;
  let posInit: number;
  let isDragging = false;

  const sliderImagesBoxEl = document.querySelector(
    `.${options.sliderSectionName}__img-box`,
  ) as HTMLDivElement;
  let sliderItemElList = document.querySelectorAll(
    `.${options.sliderSectionName}__img-item`,
  );

  cloneSliderItems(sliderImagesBoxEl, sliderItemElList);

  sliderItemElList = document.querySelectorAll(
    `.${options.sliderSectionName}__img-item`,
  );
  const wrapperEl = document.querySelector(
    `.${options.sliderSectionName}__wrapper`,
  ) as HTMLDivElement;

  const setStyles = (currentMode: number) => {
    const cssValues = cssValueList.find(el => el.mode === currentMode);
    if (cssValues) {
      sliderImagesBoxEl.style.transform = `translate3d(${cssValues.pos}%, 0px, 0px)`;
      sliderItemElList.forEach(el => {
        (el as HTMLDivElement).style.width = `${cssValues.width}%`;
        (el as HTMLDivElement).style.margin = `${cssValues.margin}`;
        (
          el as HTMLDivElement
        ).style.justifyContent = `${cssValues.justifyContent}`;
      });
    }
  };

  setStyles(mode);

  let wrapperCoords = wrapperEl.getBoundingClientRect();
  let wrapperLeftCoords = wrapperCoords.left;
  let wrapperWidth = wrapperCoords.width;

  let prevBtnEl: HTMLButtonElement | null = null;
  let nextBtnEl: HTMLButtonElement | null = null;
  if (options.withButtons) {
    prevBtnEl = document.querySelector(
      `.${options.sliderSectionName}__btn-prev`,
    ) as HTMLButtonElement;
    nextBtnEl = document.querySelector(
      `.${options.sliderSectionName}__btn-next`,
    ) as HTMLButtonElement;
  }

  let navBoxEl: HTMLDivElement;
  let navItemList: HTMLButtonElement[];
  if (options.withNav) {
    navBoxEl = document.querySelector(
      `.${options.sliderSectionName}__nav-box`,
    ) as HTMLDivElement;
    navItemList = Array(options.imagesLength)
      .fill({}, 0, options.imagesLength)
      .map((_el, index) => {
        const navItemEl = document.createElement('button');
        navItemEl.classList.add(`${options.sliderSectionName}__nav-item`);
        if (index === 0) {
          navItemEl.classList.add(
            `${options.sliderSectionName}__nav-item_active`,
          );
        }
        navItemEl.dataset.image = String(index + 1);
        navItemEl.addEventListener('click', e => {
          blockBtns();
          const navEl = e.currentTarget as HTMLDivElement;
          sliderImagesBoxEl.style.transition = 'transform .5s';
          const prevCurrentImage = currentImage;
          currentImage = Number(navEl.dataset.image);
          const newTranslateXPos =
            initTranslateXPos - translateStep * (currentImage - 1);
          translateXPos = newTranslateXPos;
          sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
          navItemList[currentImage - 1].classList.add(
            `${options.sliderSectionName}__nav-item_active`,
          );
          navItemList[prevCurrentImage - 1].classList.remove(
            `${options.sliderSectionName}__nav-item_active`,
          );
          setTimeout(() => {
            sliderImagesBoxEl.style.transition = '';
            activateBtns();
          }, 500);
        });
        return navItemEl;
      });

    navBoxEl.append(...navItemList);
  }

  const blockBtns = () => {
    if (nextBtnEl && prevBtnEl) {
      nextBtnEl.disabled = true;
      prevBtnEl.disabled = true;
    }
    if (options.withNav) {
      navItemList.forEach(el => {
        // eslint-disable-next-line no-param-reassign
        el.disabled = true;
      });
    }
  };

  const activateBtns = () => {
    if (nextBtnEl && prevBtnEl) {
      nextBtnEl.disabled = false;
      prevBtnEl.disabled = false;
    }
    if (options.withNav) {
      navItemList.forEach(el => {
        // eslint-disable-next-line no-param-reassign
        el.disabled = false;
      });
    }
  };

  window.addEventListener('resize', () => {
    wrapperCoords = wrapperEl.getBoundingClientRect();
    wrapperLeftCoords = wrapperCoords.left;
    wrapperWidth = wrapperCoords.width;

    if (options.isFlexible) {
      pageWidth = document.documentElement.scrollWidth;
      const newMode = getMode(pageWidth);
      if (mode === newMode) {
        return;
      }
      mode = newMode;
      translateStep = 100 / mode;
      initTranslateXPos = cssValueList.find(el => el.mode === mode)
        ?.pos as number;
      const newTranslateXPos =
        initTranslateXPos - translateStep * (currentImage - 1);
      translateXPos = newTranslateXPos;
      setStyles(mode);
    }
  });

  const dragAction = (e: MouseEvent) => {
    const posX = e.pageX - wrapperLeftCoords;
    offset = ((posInit - posX) / wrapperWidth) * 100;
    const newTranslateXPos = translateXPos - offset;
    sliderImagesBoxEl.style.transform = `translate3d(${newTranslateXPos}%, 0px, 0px)`;
  };

  const swipeAction = (e: TouchEvent) => {
    const posX = e.touches[0].clientX - wrapperLeftCoords;
    offset = ((posInit - posX) / wrapperWidth) * 100;
    const newTranslateXPos = translateXPos - offset;
    sliderImagesBoxEl.style.transform = `translate3d(${newTranslateXPos}%, 0px, 0px)`;
  };

  const dragStart = (e: MouseEvent) => {
    isDragging = true;
    posInit = e.pageX - wrapperLeftCoords;
    wrapperEl.addEventListener('mousemove', dragAction);
    wrapperEl.addEventListener('touchmove', swipeAction);
  };

  const swipeStart = (e: TouchEvent) => {
    isDragging = true;
    posInit = e.touches[0].clientX - wrapperLeftCoords;
    wrapperEl.addEventListener('mousemove', dragAction);
    wrapperEl.addEventListener('touchmove', swipeAction);
  };

  const swipeEnd = () => {
    blockBtns();
    const prevCurrentImage = currentImage;
    isDragging = false;
    sliderImagesBoxEl.style.transition = 'transform .5s';
    wrapperEl.removeEventListener('mousemove', dragAction);
    wrapperEl.removeEventListener('touchmove', swipeAction);

    if (offset < -translateStep / 8) {
      translateXPos += translateStep;
      currentImage -= 1;
      if (currentImage === 0) {
        currentImage = options.imagesLength;
      }
      if (options.withNav) {
        navItemList[currentImage - 1].classList.add(
          `${options.sliderSectionName}__nav-item_active`,
        );
        navItemList[prevCurrentImage - 1].classList.remove(
          `${options.sliderSectionName}__nav-item_active`,
        );
      }
    }

    if (offset > translateStep / 8) {
      translateXPos -= translateStep;
      currentImage += 1;
      if (currentImage === options.imagesLength + 1) {
        currentImage = 1;
      }
      if (options.withNav) {
        navItemList[currentImage - 1].classList.add(
          `${options.sliderSectionName}__nav-item_active`,
        );
        navItemList[prevCurrentImage - 1].classList.remove(
          `${options.sliderSectionName}__nav-item_active`,
        );
      }
    }

    offset = 0;

    sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;

    setTimeout(() => {
      sliderImagesBoxEl.style.transition = '';
      if (currentImage === options.imagesLength && prevCurrentImage === 1) {
        translateXPos =
          initTranslateXPos - translateStep * (options.imagesLength - 1);
        sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
      }

      if (currentImage === 1 && prevCurrentImage === options.imagesLength) {
        translateXPos = initTranslateXPos;
        sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
      }
      activateBtns();
    }, 500);
  };

  const swipeLeave = () => {
    if (isDragging) {
      swipeEnd();
    }
  };

  prevBtnEl?.addEventListener('click', () => {
    blockBtns();
    const prevCurrentImage = currentImage;
    sliderImagesBoxEl.style.transition = 'transform .5s';
    translateXPos += translateStep;
    currentImage -= 1;
    if (currentImage === 0) {
      currentImage = options.imagesLength;
    }

    if (options.withNav) {
      navItemList[currentImage - 1].classList.add(
        `${options.sliderSectionName}__nav-item_active`,
      );
      navItemList[prevCurrentImage - 1].classList.remove(
        `${options.sliderSectionName}__nav-item_active`,
      );
    }

    sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;

    setTimeout(() => {
      sliderImagesBoxEl.style.transition = '';
      if (currentImage === options.imagesLength && prevCurrentImage === 1) {
        translateXPos =
          initTranslateXPos - translateStep * (options.imagesLength - 1);
        sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
      }
      activateBtns();
    }, 500);
  });
  nextBtnEl?.addEventListener('click', () => {
    blockBtns();
    const prevCurrentImage = currentImage;
    sliderImagesBoxEl.style.transition = 'transform .5s';
    translateXPos -= translateStep;
    currentImage += 1;
    if (currentImage === options.imagesLength + 1) {
      currentImage = 1;
    }

    if (options.withNav) {
      navItemList[currentImage - 1].classList.add(
        `${options.sliderSectionName}__nav-item_active`,
      );
      navItemList[prevCurrentImage - 1].classList.remove(
        `${options.sliderSectionName}__nav-item_active`,
      );
    }

    sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;

    setTimeout(() => {
      sliderImagesBoxEl.style.transition = '';
      if (currentImage === 1 && prevCurrentImage === options.imagesLength) {
        translateXPos = initTranslateXPos;
        sliderImagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
      }
      activateBtns();
    }, 500);
  });

  wrapperEl.addEventListener('mousedown', dragStart);
  wrapperEl.addEventListener('touchstart', swipeStart);

  wrapperEl.addEventListener('mouseup', swipeEnd);
  wrapperEl.addEventListener('touchend', swipeEnd);

  wrapperEl.addEventListener('mouseleave', swipeLeave);
};

initSlider({
  imagesLength: 8,
  isFlexible: true,
  maxMode: 3,
  sliderSectionName: 'technics-slider',
  withButtons: true,
  withNav: false,
  changeModeBreakpoints: [650, 1150],
});
