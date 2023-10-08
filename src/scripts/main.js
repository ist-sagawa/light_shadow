import '../styles/style.sass'
// import MainScene from "./modules/MainScene";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { Pane } from 'tweakpane';
import * as $ from './modules/Util'

class Main {
  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer = new THREE.WebGLRenderer({
      canvas: $.qs('canvas'),
      antialias: true,
      alpha: true,
    })
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // this.renderer.clearColor(0x000000, 1);
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      .1,
      1000
    );
    this.camera.updateProjectionMatrix()


    this.params = {
      all: {
        enabled: true,
        intensity: 100,
        angle: 0.6,
        penumbra: 1,
        decay: 2,
        spacing: 10,
      },
      l0: {
        enabled: true,
      },
      l1: {
        enabled: true,
      },
      l2: {
        enabled: true,
      },
      l3: {
        enabled: true,
      },
      l4: {
        enabled: true,
      },
      l5: {
        enabled: true,
      },
      l6: {
        enabled: true,
      },
      l7: {
        enabled: true,
      },
      l8: {
        enabled: true,
      },
    }

    this.spotLights = [];
    this.target = new THREE.Mesh()
    this.back = new THREE.Mesh()
    this.isdebug = false;
    this.helper = new THREE.Group();

    this.pane = new Pane();

    // document.body.appendChild(this.renderer.domElement);
    $.addEvent(window, 'resize', this.resize.bind(this))
    $.addEvent(document, 'keydown', (e) => {
      if (e.key === ' ') {
        this.isdebug = !this.isdebug
        this.helper.visible = this.isdebug
        this.controls.enabled = this.isdebug
        if (!this.isdebug) {
          this.controls.reset();
          this.camera.position.set(0, 0, 20);
        }
      }
    })


  }

  init() {
    this.setupRenderer()
    this.setupCamera()
    this.renderer.setAnimationLoop(this.update.bind(this))
    this.createLights()
    this.createTarget()
    this.createBack()
    this.createHelper()
    this.createControls()
    this.createTweakPane()
    // this.createCube(0, 0, 0, 1)
  }

  setupRenderer() {
    this.renderer.setSize(this.width, this.height)
  }

  setupCamera() {
    this.camera.position.set(0, 0, 20);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.camera.updateProjectionMatrix();
    // this.scene.add(this.camera);
  }

  createHelper() {
    const gridHelper = new THREE.GridHelper(800, 400);
    this.helper.add(gridHelper);
    const axesHelper = new THREE.AxesHelper(1000);
    this.helper.add(axesHelper);

    for (let i = 0; i < this.spotLights.length; i++) {
      const lightHelper = new THREE.SpotLightHelper(
        this.spotLights[i],
        .2
      );
      this.helper.add(lightHelper);
    }
    this.helper.visible = this.isdebug
    this.scene.add(this.helper);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createTweakPane() {

    // console.log(this.pane);
    const shadowFolder = this.pane.addFolder({ title: 'LIGHT / SHADOW' });
    const self = this
    self.pane.addBinding(self.params.all, 'enabled').on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        e.value ? self.lightOn(light) : self.lightOff(light)
      });
    });
    self.pane.addBinding(self.params.all, 'intensity', { min: 0, max: 1000 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.intensity = e.value;
      });
    });
    self.pane.addBinding(self.params.all, 'angle', { min: 0, max: 1.5 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.angle = e.value;
      });
    }
    );
    self.pane.addBinding(self.params.all, 'penumbra', { min: 0, max: 1 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.penumbra = e.value;
      });
    });
    self.pane.addBinding(self.params.all, 'decay', { min: 0, max: 4 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.decay = e.value;
      });
    });
    self.pane.addBinding(self.params.all, 'spacing', { min: 0, max: 20 }).on('change', (e) => {
      self.setLightPosition(e.value, 3, 3)
    });

    // 影のパラメーターをUIコントロールに追加
    this.spotLights.forEach(function (light, index) {
      var lightFolder = shadowFolder.addFolder({ title: 'Light ' + index });
      // console.log(self.params);
      lightFolder.addBinding(self.params[`l${index}`], 'enabled').on('change', (e) => { e.value ? self.lightOn(light) : self.lightOff(light) });
      // self.pane.addBinding(self.params, `l${index}.enabled`).on('change', (e) => { e.value ? self.lightOn(light) : self.lightOff(light) });

      // lightFolder.addBinding(light.shadow.camera, 'near', { min: 1, max: 10 }).on('change', self.updateLights);
      // lightFolder.addBinding(light.shadow.camera, 'far', { min: 10, max: 100 }).on('change', self.updateLights);
      // lightFolder.addBinding(light.shadow.camera, 'left', { min: -10, max: 10 }).on('change', self.updateLights);
      // lightFolder.addBinding(light.shadow.camera, 'right', { min: -10, max: 10 }).on('change', self.updateLights);
      // lightFolder.addBinding(light.shadow.camera, 'top', { min: -10, max: 10 }).on('change', self.updateLights);
      // lightFolder.addBinding(light.shadow.camera, 'bottom', { min: -10, max: 10 }).on('change', self.updateLights);
    });
    // const PARAMS = {
    //   factor: 123,
    //   title: 'hello',
    //   color: '#ff0055',
    // };

    // // const pane = new this.pane();

    // this.pane.addBinding(PARAMS, 'factor');
    // this.pane.addBinding(PARAMS, 'title');
    // this.pane.addBinding(PARAMS, 'color');
  }

  lightOn(light) {
    gsap.to(light, {
      intensity: 100,
      duration: .1,
      ease: 'power4.inOut',
    })
  }

  lightOff(light) {
    gsap.to(light, {
      intensity: 0,
      duration: .1,
      ease: 'power4.inOut',
    })
  }

  updateLights() {
    this.renderer.render(this.scene, this.camera)
  }

  createLights() {
    this.spotLights = [];
    const cols = 3;
    const rows = 3;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const spotLight = new THREE.SpotLight(0x0000ff, this.params.all.intensity);

        spotLight.castShadow = true;
        spotLight.angle = this.params.all.angle;
        spotLight.penumbra = this.params.all.penumbra;
        spotLight.decay = this.params.all.decay;
        spotLight.distance = 0;

        spotLight.castShadow = true;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.target.position.set(0, 0, 0); // ターゲットを設定
        this.scene.add(spotLight);
        this.spotLights.push(spotLight);
      }
    }
    this.setLightPosition(this.params.all.spacing, cols, rows)
  }

  setLightPosition(spacing, cols, rows,) {
    const xOffset = -(cols - 1) * spacing / 2;
    const yOffset = -(rows - 1) * spacing / 2;
    this.spotLights.forEach((light, index) => {
      light.position.set(xOffset + index % cols * spacing, yOffset + Math.floor(index / rows) * spacing, 10);
    })
  }


  createTarget() {
    const texture = new THREE.TextureLoader().load("../images/logomark.png");
    const geo = new THREE.PlaneGeometry(500, 500, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      alphaTest: .2,
      side: THREE.BackSide,
      shadowSide: THREE.FrontSide,
      transparent: true,
    });

    this.target.geometry = geo;
    this.target.material = mat;
    this.target.name = "target"
    this.target.castShadow = true;
    this.target.position.set(0, 0, 0)
    this.target.scale.set(.01, .01, .01)
    this.scene.add(this.target);
  }

  createBack() {
    this.back.geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1)
    this.back.material = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
    })
    this.back.position.set(0, 0, -10);
    this.back.receiveShadow = true;
    this.scene.add(this.back);
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.updateProjectionMatrix()
  }

  update() {
    this.renderer.render(this.scene, this.camera)
    this.pane.refresh();
  }
}


window.addEventListener("load", () => {
  const main = new Main();
  main.init();
})