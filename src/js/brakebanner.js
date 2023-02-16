class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });

    document.querySelector(selector).appendChild(this.app.view);

    this.stage = this.app.stage;
    this.loader = new PIXI.Loader();

    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");

    this.loader.load();

    this.loader.onComplete.add(() => {
      this.show();
    });
  }

  show() {
    let bikeContainer = this.createBikeContainer();
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;
    this.stage.addChild(bikeContainer);

    let actionButton = this.createActionButton();
    actionButton.x = actionButton.y = 300;
    this.stage.addChild(actionButton);

    actionButton.interactive = true;
    actionButton.buttonMode = true;

    let resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };

    window.addEventListener("resize", resize);
    resize();

    actionButton.on("mousedown", () => {
      //   bikeLeverImage.rotation = (Math.PI / 180) * -30;
      //   console.log(bikeContainer);
      gsap.to(bikeContainer.children[1], {
        duration: 0.6,
        rotation: (Math.PI / 180) * -30,
      });

      pause();
    });

    actionButton.on("mouseup", () => {
      //   bikeLeverImage.rotation = 0;
      gsap.to(bikeContainer.children[1], {
        duration: 0.4,
        rotation: 0,
      });

      start();
    });

    // 创建粒子
    let particleContainer = new PIXI.Container();
    this.stage.addChild(particleContainer);

    particleContainer.pivot.x = window.innerWidth / 2;
    particleContainer.pivot.y = window.innerHeight / 2;

    particleContainer.x = window.innerWidth / 2;
    particleContainer.y = window.innerHeight / 2;

    particleContainer.rotation = (Math.PI / 180) * 35;

    let particles = [];

    let colors = [0xf1cf54, 0xb5cea8, 0x818181, 0x000000];

    for (let i = 0; i < 10; i++) {
      let gr = new PIXI.Graphics();

      gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);

      gr.drawCircle(0, 0, 4);

      gr.endFill();

      let pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr: gr,
      };

      gr.x = pItem.sx;
      gr.y = pItem.sy;

      particleContainer.addChild(gr);

      particles.push(pItem);
    }

    let speed = 0;

    function loop() {
      speed += 0.5;

      speed = Math.min(speed, 20);

      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];

        pItem.gr.y += speed;

        if (speed >= 20) {
          pItem.gr.scale.y = 40;
          pItem.gr.scale.x = 0.06;
        }

        if (pItem.gr.y > window.innerHeight) pItem.gr.y = 0;
      }
    }

    function start() {
      speed = 0;
      gsap.ticker.add(loop);
    }

    function pause() {
      gsap.ticker.remove(loop);
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];

        pItem.gr.scale.x = 1;
        pItem.gr.scale.y = 1;

        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: "elastic.out",
        });
      }
    }

    start();

    // 粒子有多个颜色;
    // 向某一个角度持续移动;
    // 超出边界后回到顶部继续移动;
    // 按住鼠标停止;
    // 停止的时候还有一点回弹的效果;
    // 松开鼠标继续;
  }

  createBikeContainer() {
    let bikeContainer = new PIXI.Container();

    let bikeImage = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );

    let bikeHandlerbarImage = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );

    let bikeLeverImage = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );

    bikeContainer.addChild(bikeImage);
    bikeContainer.addChild(bikeLeverImage);
    bikeContainer.addChild(bikeHandlerbarImage);

    bikeLeverImage.pivot.x = bikeLeverImage.pivot.y = 455;

    bikeLeverImage.x = 722;
    bikeLeverImage.y = 900;

    return bikeContainer;
  }

  createActionButton() {
    let actionButton = new PIXI.Container();

    let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btnCircleImage = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    let btnCircleImage2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );

    actionButton.addChild(btnImage);
    actionButton.addChild(btnCircleImage);
    actionButton.addChild(btnCircleImage2);

    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
    btnCircleImage.pivot.x = btnCircleImage.pivot.y = btnCircleImage.width / 2;
    btnCircleImage2.pivot.x = btnCircleImage2.pivot.y =
      btnCircleImage2.width / 2;

    btnCircleImage.scale.x = btnCircleImage.scale.y = 0.8;
    gsap.to(btnCircleImage.scale, {
      duration: 1,
      x: 1.3,
      y: 1.3,
      repeat: -1,
    });
    gsap.to(btnCircleImage, {
      duration: 1,
      alpha: 0,
      repeat: -1,
    });

    return actionButton;
  }
}
