import '../styles/style.sass'
// import MainScene from "./modules/MainScene";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { Pane } from 'tweakpane';
import * as $ from './modules/Util'
import * as Tone from 'tone'
import logo from '/images/logomark.png'

class Main {
  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer = new THREE.WebGLRenderer({
      canvas: $.qs('canvas'),
      
    })
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.clearColor(0x000000, 1);
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      .1,
      1000
    );
    this.camera.updateProjectionMatrix()

    this.params = {
      sound: {
        vol: -20,
        reverb: 0,
        type: 'sine',
        delay: 0,
        attack: 0.001,
        bitCrusher: 0,
        random: true,
      },
      camera: {
        x: 0,
        y: 0,
        z: 20,
      },
      all: {
        enabled: true,
        intensity: 100,
        angle: 0.6,
        penumbra: 1,
        decay: 2,
        spacing: 10,
      },
      l0: {
        enabled: "",
      },
      l1: {
        enabled: "",
      },
      l2: {
        enabled: "",
      },
      l3: {
        enabled: "",
      },
      l4: {
        enabled: "",
      },
      l5: {
        enabled: "",
      },
      l6: {
        enabled: "",
      },
      l7: {
        enabled: "",
      },
      l8: {
        enabled: "",
      },
    }

    window.params = this.params

    this.backPos = new THREE.Vector3(0, 0, -10);
    this.spotLights = [];
    this.target = new THREE.Mesh()
    this.back = new THREE.Mesh()
    this.isdebug = false;
    this.helper = new THREE.Group();

    this.pane = new Pane({
      container: document.querySelector('.ui .tweakpane')
    });

    // document.body.appendChild(this.renderer.domElement);
    $.addEvent(window, 'resize', this.resize.bind(this))
    $.addEvent(document, 'keydown', (e) => {
      if (e.key === ' ') {
        this.isdebug = !this.isdebug
        this.helper.visible = this.isdebug
        this.controls.enabled = this.isdebug
        if (!this.isdebug) {
          this.controls.reset();
          this.params.camera.x = this.camera.position.x
          this.params.camera.y = this.camera.position.y
          this.params.camera.z = this.camera.position.z
        }
      }
    })

    $.addEvent(".start", 'click', () => {
      this.createSound()
      Tone.Transport.start();
      this.loopStart()
    })

    $.addEvent(".stop", 'click', () => {
      Tone.Transport.stop();
      this.loopStop()
    });

    let mouseMoveTimeout = null 

    $.addEvent(window,"mousemove", (e) => {
      clearTimeout(mouseMoveTimeout)
      const uiDom = document.querySelector('.ui')
      uiDom.classList.add("show")
      this.target.material.side = THREE.DoubleSide
      mouseMoveTimeout = setTimeout(() => {
        const uiDom = document.querySelector('.ui')
        this.target.material.side = THREE.BackSide
        uiDom.classList.remove("show")
      }, 3000)
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
    // this.createControls()
    this.createTweakPane()
    // this.createCube(0, 0, 0, 1)
  }

  createSound() {

    // オシレーターを作成してエンベロープに接続

    this.synth1 = new Tone.Synth({
      oscillator : {
        type : this.params.sound.type
      },
      envelope : {
        attack : this.params.sound.attack ,
        decay : 0.5 ,
        sustain : 0.1 ,
        release : .2
      }
    }).toDestination();

    this.synth2 = new Tone.Synth({
      oscillator : {
        type : this.params.sound.type
      },
      envelope : {
        attack : this.params.sound.attack ,
        decay : 0.1 ,
        sustain : 0.8 ,
        release : .8
      }
    }).toDestination();

    this.s1Melo0 = [
      ,,,,
    ]

    this.s1Melo1 = [
      "C5",,,,
    ]
    this.s1Melo2 = [
      ,,"C#5",,
    ]
    this.s1Melo3 = [
      "C#5",,"B5",,
      "C#5","B5",,"B5",
      "C#5","B5",,,
      "C#5",,"B5",,
    ]
    this.s1Melo4 = [
      ,"C#4",,,
      "E4",,,,
      ,,,,
      "E4",,"E5","E4",
    ]
    this.s1Melo5 = [
      ,"C#5","B5",,
      "E6","B5","C#5",,
      "E6","B5","C#5",,
      "E6","B5","C#5",,
    ]
    this.s1Melo6 = [
      ,,"C#4",,
      "B4",,"C#4",,
      ,,"C#4",,
      ,,,,
    ]

    this.s2Melo0 = [
      ,,,,
    ]

    this.s2Melo1 = [
      "C#3",,,,
    ]
    this.s2Melo2 = [
      ,,"C3",,
    ]

    this.s2Melo3 = [
      "C#3",,,,
      "C#3","F#3",,"C#3",
      ,,"C#3",,
      ,"C#3",,,
    ]
    

    this.s1MeloArr = [
      this.s1Melo0,
      this.s1Melo1,
      this.s1Melo2,
      this.s1Melo3,
      this.s1Melo4,
      this.s1Melo5,
      this.s1Melo6,
    ]
    this.s2MeloArr = [
      this.s2Melo0,
      this.s2Melo1,
      this.s2Melo2,
      this.s2Melo3,
    ]

    this.s1NowMeloNum = 1
    this.s2NowMeloNum = 0


    window.t1 = this
    
    this.pingpong = new Tone.PingPongDelay("16n", 0.8).toDestination();
    this.pingpong.wet.value = this.params.sound.delay
    this.synth1.connect(this.pingpong);
    this.synth2.connect(this.pingpong);

    this.reverb = new Tone.Reverb(this.params.sound.reverb).toDestination();
    this.pingpong.connect(this.reverb);

    this.count = 0
    this.lCount = 0
    this.loop = new Tone.Loop((time) => {
      // console.log(time)

      const length1 = this.s1MeloArr[this.s1NowMeloNum].length
      let light1Flg = false
      const note1 = this.s1MeloArr[this.s1NowMeloNum][this.count%length1]
      if(note1){
        this.playSynth1(note1,time)
        light1Flg = true
      }

      const length2 = this.s2MeloArr[this.s2NowMeloNum].length
      let light2Flg = false
      const note2 = this.s2MeloArr[this.s2NowMeloNum][this.count%length2]
      if(note2){
        this.playSynth2(note2,time)
        light2Flg = true
      }
      this.count++

      self = this

      self.spotLights.forEach(function (light, index) {
        self.params[`l${index}`].enabled = ""
      })
      if(light1Flg){
        this.params[`l${this.lCount}`].enabled = "lead"
      }else{
        if(light2Flg){
          this.params[`l${this.lCount}`].enabled = "bass"
        }
      }

      if(this.count%32 == 0 && this.params.sound.random){
        this.s1NowMeloNum = Math.floor(Math.random() * this.s1MeloArr.length)
        this.s2NowMeloNum = Math.floor(Math.random() * this.s2MeloArr.length)
        if(this.s1NowMeloNum == 0 && this.s2NowMeloNum == 0){
          if(Math.random() > .5){
            this.s1NowMeloNum = 1
          }else{
            this.s2NowMeloNum = 1
          }
        }
        this.randomParam()
      }

      if(this.lCount == 8){
        this.lCount = 0
      }else{
        this.lCount++
      }
    }, "16n")
    Tone.Transport.bpm.value = 140;
    Tone.Destination.volume.value = this.params.sound.vol;

    // this.loopStart()

  }

  loopStart() {
    this.loop.start(0)
  }

  loopStop() {
    this.loop.stop(0)
  }

  playSynth1(note,time) {
    this.synth1.triggerAttackRelease(note, "16n",time);
  }

  playSynth2(note,time) {
    this.synth2.triggerAttackRelease(note, "16n",time);
  }

  setupRenderer() {
    this.renderer.setSize(this.width, this.height)
  }

  setupCamera() {
    this.camera.position.set(
      this.params.camera.x,
      this.params.camera.y,
      this.params.camera.z
    );
    this.camera.lookAt(this.backPos);
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

  randomParam() {
    this.params.sound.reverb = Math.random() * 50
    this.params.sound.delay = Math.random()
    this.params.sound.type = ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)]
    this.params.sound.attack = (Math.random() > .4) ? 0.001 : 0.4
    console.log(this.params.sound);

    this.params.all.angle = Math.random() * 1.5 + .2

    this.params.all.penumbra = this.params.sound.reverb / 50
    

    if(this.params.sound.delay > 0.8){
      this.params.all.intensity = this.params.sound.delay * 1000
    }
    
    this.params.all.spacing = Math.random() * 20

    if(this.params.sound.type == 'sawtooth'){
      this.params.all.decay = 0.1
    }else if(this.params.sound.type == 'triangle'){
      this.params.all.decay = 1.2
    }else if(this.params.sound.type == 'square'){
      this.params.all.decay = 0.6
    }else if(this.params.sound.type == 'sine'){
      this.params.all.decay = 2
      this.params.all.angle = 1.5
    }
    this.params.all.decay += this.params.sound.attack
    this.params.all.penumbra += this.params.sound.attack * .4

    if(Math.random() > .7){
      this.params.camera.x = 0
      this.params.camera.y = 0
      this.params.camera.z = 20
    }else{
      this.params.camera.x = Math.random() * 100 - 50
      this.params.camera.y = Math.random() * 100 - 50
      if(Math.random() > .4){
        this.params.camera.z = Math.random() * 150
      }else{
        this.params.camera.z = 20
      }
    }
    
    this.camera.lookAt(this.backPos);

  }

  createTweakPane() {

    window.params = this.params
    // console.log(this.pane);
    const lightFolder = this.pane.addFolder({ title: 'LIGHTS' });

    const soundFolder = this.pane.addFolder({ title: 'Sound' });
    const self = this
    soundFolder.addBinding(self.params.sound, 'vol' , { min: -40, max: 0 }).on('change', (e) => {
      Tone.Destination.volume.value = e.value;
    });
    soundFolder.addBinding(self.params.sound, 'reverb' , { min: 0, max: 50 }).on('change', (e) => {
      this.reverb.decay = e.value;
    });
    soundFolder.addBinding(self.params.sound, 'type' , { options: { sine: 'sine', square: 'square', sawtooth: 'sawtooth', triangle: 'triangle' } }).on('change', (e) => {
      this.synth1.oscillator.type = e.value;
      this.synth2.oscillator.type = e.value;
    });
    soundFolder.addBinding(self.params.sound, 'delay' , { min: 0, max: 1 }).on('change', (e) => {
      this.pingpong.wet.value = e.value;
    });
    soundFolder.addBinding(self.params.sound, 'attack' , { min: 0.001, max: 1 }).on('change', (e) => {
      this.synth1.envelope.attack = e.value;
      this.synth2.envelope.attack = e.value;
    });

    soundFolder.addBinding(self.params.sound, 'random')

    const cameraFolder = this.pane.addFolder({ title: 'Camera' });
    cameraFolder.addBinding(self.params.camera, 'x' , { min: -100, max: 100 }).on('change', (e) => {
      this.camera.position.x = e.value;
      this.camera.lookAt(this.backPos);
    })
    cameraFolder.addBinding(self.params.camera, 'y' , { min: -100, max: 100 }).on('change', (e) => {
      this.camera.position.y = e.value;
      this.camera.lookAt(this.backPos);
    })
    cameraFolder.addBinding(self.params.camera, 'z' , { min: 20, max: 150 }).on('change', (e) => {
      this.camera.position.z = e.value;
      this.camera.lookAt(this.backPos);
    })

    const allLightFolder = this.pane.addFolder({ title: 'LIGHT SETTINGS' });
    allLightFolder.addBinding(self.params.all, 'enabled').on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        self.params[`l${index}`].enabled = e.value;
      });

    });
    allLightFolder.addBinding(self.params.all, 'intensity', { min: 0, max: 1000 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.intensity = e.value;
      });
    });
    allLightFolder.addBinding(self.params.all, 'angle', { min: 0, max: 1.5 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.angle = e.value;
      });
    }
    );
    allLightFolder.addBinding(self.params.all, 'penumbra', { min: 0, max: 1 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.penumbra = e.value;
      });
    });
    allLightFolder.addBinding(self.params.all, 'decay', { min: 0, max: 4 }).on('change', (e) => {
      self.spotLights.forEach(function (light, index) {
        light.decay = e.value;
      });
    });
    allLightFolder.addBinding(self.params.all, 'spacing', { min: 0, max: 20 }).on('change', (e) => {
      self.setLightPosition(e.value, 3, 3)
    });

    this.spotLights.forEach(function (light, index) {
      var lFolder = lightFolder.addFolder({ title: 'Light ' + index });
      lFolder.addBinding(self.params[`l${index}`], "enabled", { options: { none: '', lead: 'lead', bass: 'bass' } }).on('change', (e) => { e.value ? self.lightOn(index,e.value) : self.lightOff(index) });
    });
  }

  lightOn(id,type) {
    const light = this.spotLights[id];
    light.color = (type == 'lead') ? new THREE.Color(0xffffff) : new THREE.Color(0x0000ff)
    gsap.to(light, {
      intensity: 200,
      duration: .3,
      ease: 'back.out',
    })
  }

  lightOff(id) {
    const light = this.spotLights[id];
    gsap.to(light, {  
      intensity: 0,
      duration: .3,
      ease: 'back.out',
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
        const spotLight = new THREE.SpotLight();

        spotLight.castShadow = true;
        spotLight.angle = this.params.all.angle;
        spotLight.penumbra = this.params.all.penumbra;
        spotLight.decay = this.params.all.decay;
        spotLight.distance = 0;

        spotLight.castShadow = true;
        spotLight.shadow.camera.far = 10000;
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
      light.position.set(-xOffset + index % cols * -spacing, yOffset + Math.floor(index / rows) * spacing, 10);
    })
  }


  createTarget() {
    const texture = new THREE.TextureLoader().load(logo);
    const geo = new THREE.PlaneGeometry(5, 5, 1, 1);
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
    this.scene.add(this.target);
  }

  createBack() {
    this.back.geometry = new THREE.PlaneGeometry(5000, 5000, 1, 1)
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