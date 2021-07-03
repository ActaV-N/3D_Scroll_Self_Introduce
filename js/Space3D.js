(() => {
  const TEXTS = [
    "안녕하세요",
    '"ACTAV"입니다.',
    "지금부터</br>아&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;주</br>간단하게",
    "하고싶은 말을</br>하려고 합니다.",
    "영어</br>(영국 발음으로 ㅎㅎ)",
    "일본어",
    "중국어",
    "스페인어",
    "라틴어까지",
    "총 5개국어를",
    " 구사하고 싶고</br>ㅎㅎ",
    "아티스트가</br>그&nbsp;&nbsp;림&nbsp;&nbsp;&nbsp;을</br>그릴때처럼",
    "작성한 코드를</br>여러번 수정하는",
    "그런</br>개발자입니다.",
    "물론",
    "한 번에</br>완벽한</br>코드를",
    "작성하는 사람은",
    "정말 적을거라고</br>생각이 듭니다",
    "그런 의미에서",
    "개발자는",
    '"아티스트"',
    "가 아닌가",
    "싶습니다.",
    "그래서",
    "저는",
    "웹 개발자가 아닌",
    '"웹 아티스트"라고',
    "불리고</br>싶네요</br>ㅎ&nbsp;&nbsp;&nbsp;ㅎ",
    "감사합니다.",
    "-END-"
  ];

  let screenItems = [];
  //
  const stageElem = document.querySelector(".stage");
  let screenElems;
  let screenCnt;

  // Variables for activate and deactivate
  let currentIndex;
  let currentItem;
  let activeScrollPoint;
  let deactiveScrollPoint;

  const activate = () => {
    // activate currentItem
    activeScrollPoint = currentItem.dataset.scene * 1 + 0.8;
    deactiveScrollPoint = currentItem.dataset.scene * 1 - 0.8;
    currentItem.classList.add("active");
    screenItems[currentIndex].activated();
  };

  const deactivate = () => {
    // deactivate currentItem
    screenItems[currentIndex].deactivated();
    currentItem.classList.remove("active");
  };

  // Variables for setting target;
  let prevSection = 1,
    section = 1,
    target,
    source;

  let targetPos = {},
    sourcePos = {};

  const setTarget = () => {
    // Set target x y z
    target = screenElems[section];
    source = screenElems[section - 1];

    const targetStyle = window.getComputedStyle(target);
    const targetMatrix = new DOMMatrix(targetStyle.transform);

    targetPos = {
      x: (targetMatrix.m41 / window.innerWidth) * 100,
      y: (targetMatrix.m42 / window.innerWidth) * 100,
      z: (targetMatrix.m43 / window.innerWidth) * 100
    };

    const soruceStyle = window.getComputedStyle(source);
    const soruceMatrix = new DOMMatrix(soruceStyle.transform);

    sourcePos = {
      x: (soruceMatrix.m41 / window.innerWidth) * 100,
      y: (soruceMatrix.m42 / window.innerWidth) * 100,
      z: (soruceMatrix.m43 / window.innerWidth) * 100
    };
  };

  // wheel Variables;
  let oneScroll = true;
  let scrolling = false;

  window.addEventListener("wheel", (e) => {
    if (oneScroll) {
      clearTimeout(scrolling);

      if (!scrolling) {
        const heightPerScroll = window.innerHeight;
        const delta = e.deltaY;
        console.log(currentIndex);
        if (delta > 0 && window.pageYOffset < screenCnt * window.innerHeight) {
          window.scroll({
            top: (currentIndex + 1) * heightPerScroll,
            behavior: "smooth"
          });
        } else if (delta < 0 && window.pageYOffset > 0) {
          window.scroll({
            top: (currentIndex - 1) * heightPerScroll,
            behavior: "smooth"
          });
        }
      }

      scrolling = setTimeout(() => {
        scrolling = false;
      }, 300);
    }
  });

  window.addEventListener("scroll", (e) => {
    // Activate and Deactivate each screen
    const currentScroll = 1 + window.pageYOffset / window.innerHeight;

    if (activeScrollPoint < currentScroll) {
      deactivate();
      currentIndex++;
      currentItem = screenElems[currentIndex];
      activate();
    } else if (deactiveScrollPoint > currentScroll) {
      deactivate();
      currentIndex--;
      currentItem = screenElems[currentIndex];
      activate();
    }

    // Scroll to Target
    section = Math.floor(window.pageYOffset / window.innerHeight) + 1;
    if (section !== prevSection && section < screenCnt) {
      setTarget();
    }

    const ratio =
      window.pageYOffset / window.innerHeight + 1 - source.dataset.scene;

    prevSection = section;

    const xMove = sourcePos.x + (targetPos.x - sourcePos.x) * ratio;
    const yMove = sourcePos.y + (targetPos.y - sourcePos.y) * ratio;
    const zMove = sourcePos.z + (targetPos.z - sourcePos.z) * ratio;

    stageElem.style.transform = `translate3d(${-xMove}vw, ${-yMove}vw, ${-zMove}vw)`;
  });

  // Load시 위로
  window.addEventListener("load", (e) => {
    setTimeout(() => window.scrollTo(0, 0), 100);
    document.body.style.overflowY = "hidden";

    for (let i = 0; i < TEXTS.length; i++) {
      screenItems.push(new Screen(TEXTS[i], i + 1));
    }

    screenElems = document.querySelectorAll(".screen");
    screenCnt = screenElems.length;

    currentIndex = 0;
    currentItem = screenElems[currentIndex];
    document.body.style.height = `${screenCnt * 100}vh`;

    // Resize handle
    activate();
    if (screenCnt > 1) setTarget();
  });

  // Btn Event
  const btnConElem = document.querySelector(".btn-con");
  let currentBtn = document.querySelector(".btn-one-page");

  const btnActivate = () => {
    currentBtn.classList.add("active");
    if (currentBtn.classList.contains("btn-one-page")) {
      oneScroll = true;
      document.body.style.overflowY = "hidden";
      // window.scroll({ top: 0, behavior: "smooth" });
    } else {
      oneScroll = false;
      document.body.style.overflowY = "scroll";
    }
  };

  const btnDeactivate = () => {
    currentBtn.classList.remove("active");
  };

  btnConElem.addEventListener("click", (e) => {
    if (!e.target.classList.contains("active")) {
      btnDeactivate();
      currentBtn = e.target;
      btnActivate();
    }
  });

  btnActivate();
})();
