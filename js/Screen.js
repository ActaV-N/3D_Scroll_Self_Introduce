function Screen(text, index) {
  const textElem = `
    <div class="screen-item screen-text">${text}</div>
  `;

  this.index = index;

  this.container = document.querySelector(".stage");

  this.elem = document.createElement("div");
  this.elem.classList.add("screen");
  this.elem.dataset.scene = index;
  this.elem.innerHTML = textElem;

  this.tx = 0;
  this.ty = 0;
  this.tz = -(index - 1) * 100;

  this.init();
}

Screen.prototype = {
  constructor: Screen,
  init: function () {
    const self = this;
    self.container.appendChild(self.elem);

    if (self.index !== 1) {
      self.tx =
        (Math.random() - 0.5) * 200 + 20 * (Math.random() > 0.5 ? 1 : -1);
      self.ty =
        (Math.random() - 0.5) * 200 + 20 * (Math.random() > 0.5 ? 1 : -1);
    }

    self.elem.style.transform = `translate3d(${self.tx}vw, ${self.ty}vw, ${self.tz}vw) rotateX(30deg) rotateY(15deg)`;

    window.addEventListener("mousemove", (e) => {
      if (self.elem.classList.contains("active")) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -1 * ((e.clientY / window.innerHeight) * 2 - 1);

        self.elem.style.transform = `translate3d(${self.tx}vw, ${self.ty}vw, ${
          self.tz
        }vw) rotateX(${mouseY * 50}deg) rotateY(${mouseX * 15}deg)`;
      }
    });
  },
  activated: function () {
    const self = this;
    self.elem.style.transform = `translate3d(${self.tx}vw, ${self.ty}vw, ${self.tz}vw) rotateX(0deg) rotateY(0deg)`;
  },
  deactivated: function () {
    const self = this;
    self.elem.style.transform = `translate3d(${self.tx}vw, ${self.ty}vw, ${self.tz}vw) rotateX(30deg) rotateY(15deg)`;
  }
};
