<template>
  <div style="width:100%;height:100%">
    <h4>{{ timeStamp }}</h4>
    <v-hover>
      <div slot-scope="{ hover }" style="width:100%;height:100%">
        <!-- <v-skeleton-loader
        v-if="loading"
        class="mx-3"
        _max-width="300"
        type="card"
      /> -->
        <div ref="container" style="width:100%;height:100%" xmlns="http://www.w3.org/1999/xhtml" />
        <v-speed-dial
          v-if="hover"
          v-model="fab"
          top
          absolute
          right
          direction="bottom"
          style="top:90px;"
          open-on-hover
        >
          <template #activator>
            <v-btn v-model="fab" color="primary" fab>
              <v-icon v-if="fab">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-cog
              </v-icon>
            </v-btn>
          </template>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn
                v-model="rotate"
                fab
                dark
                small
                color="secondary"
                v-on="on"
                @click.stop="rotate = !rotate"
              >
                <v-icon v-if="rotate">
                  mdi-stop
                </v-icon>
                <v-icon v-else>
                  mdi-play
                </v-icon>
              </v-btn>
            </template>
            <span v-if="rotate">Stop rotasjon</span>
            <span v-if="!rotate">Start rotasjon</span>
          </v-tooltip>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="secondary"
                v-on="on"
                @click.stop="toggleCameraType()"
              >
                <v-icon>mdi-video</v-icon>
              </v-btn>
            </template>
            <span>Endre kameratype</span>
          </v-tooltip>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn
                v-model="showCloud"
                fab
                dark
                small
                color="secondary"
                v-on="on"
                @click.stop="toggleCloud()"
              >
                <v-icon v-if="showCloud">
                  mdi-cloud-off-outline
                </v-icon>
                <v-icon v-else>
                  mdi-cloud-outline
                </v-icon>
              </v-btn>
            </template>
            <span v-if="showCloud">Skjul punktsky</span>
            <span v-if="!showCloud">Vis punktsky</span>
          </v-tooltip>
        </v-speed-dial>

      <!-- <v-select style="position:absolute;bottom:0;right:10px;width:300px" :items="scans" label="Select scan"></v-select> -->
      </div>
    </v-hover>
  </div>
</template>

<script>
import { OrbitControls } from '../../common/OrbitControls'
import { widget } from '@/global/mixin'

export default {
  mixins: [widget],
  props: {
    fullscreen: Boolean,
    time: {
      type: [Number, String],
      default: 0
    }
  },
  data: () => ({
    loading: true,
    scene: {},
    camera: {},
    cameraType: '', // "" eller "ortho"
    container: null,
    renderer: {},
    fab: false,
    rotate: true,
    pointCloud: undefined,
    showCloud: true,
    scans: [],
    values: ['lastModel.points'],
    kg: 0,
    rotertSky: undefined,
    grid: undefined,
    timeStamp: ''
    // hover: false
  }),
  watch: {
    fullscreen () {
      this.onResize()
    },
    rotertSky () {
      // console.log('clear scene')
      this.clearScene()
      this.addLights()
      this.newPointCloud(this.rotertSky.scan_result, 'rgb(69,183,104)')
    },
    grid () {
      this.createTerrain(this.grid)
    },
    time (val) {
    // const THREE = this.$three
      // console.log(
      //   'new timestamp:',
      //   new Date(val).toISOString().replace('T', ' ')
      // )
      // this.getPointCloud('last', undefined, THREE.FrontSide, val)
      // this.getPointCloud(new Date(val).toISOString())
    }
  },
  beforeDestroy () {
    // Stopper animation loop når man lukker bildet
    this.renderer.setAnimationLoop(null)
    window.removeEventListener('resize', this.onResize)
  },
  mounted () {
    const THREE = this.$three
    this.getPointCloud('last', undefined, THREE.FrontSide)
    this.getPointCloud('empty', '#777777', THREE.BackSide)

    this.$nextTick(function () {
      window.addEventListener('resize', this.onResize)

      const THREE = this.$three
      // var OrbitControls = this.$OrbitControls;
      this.container = this.$refs.container
      const width = this.container.clientWidth
      const height = this.container.clientHeight

      // setter opp scene og konfigurerer kamera
      this.scene = new THREE.Scene()
      // eslint-disable-next-line unicorn/number-literal-case
      this.scene.background = new THREE.Color(0x1e1e1e)
      this.setCameraType(this.cameraType)
      // this.scene.rotateX(Math.PI / 2)
      // setter opp lys
      this.addLights()
      // setter opp rendering
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      this.renderer.setPixelRatio(1)
      this.renderer.setSize(width, height)
      this.renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer.shadowMap.enabled = true
      this.container.innerHTML = ''
      this.container.appendChild(this.renderer.domElement)
      // tegn scene en gang
      this.render()
      // Fedig med oppsett, animer!!
      this.animate()
      window.addEventListener('resize', this.onResize, false)
    })
  },
  methods: {
    generateModel (data, color = '#6b4603', side) {
      const THREE = this.$three
      const geom = new THREE.BufferGeometry()
      const vertices = new Float32Array(data.vertices)
      const normals = new Float32Array(data.vertex_normals)
      geom.setIndex(data.simplices)
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      const material = new THREE.MeshStandardMaterial({ color, flatShading: true, side })
      const mesh = new THREE.Mesh(geom, material)
      mesh.position.y = 1
      mesh.position.z = 0
      mesh.rotation.x = -Math.PI / 2
      mesh.scale.multiplyScalar(0.01)
      mesh.castShadow = false
      mesh.receiveShadow = true
      // wireframe
      const geo = new THREE.EdgesGeometry(mesh.geometry)
      const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF })
      const wireframe = new THREE.LineSegments(geo, mat)
      mesh.add(wireframe)
      this.scene.add(mesh)
    },
    async getPointCloud (type, color, side, time) {
      // const timestamp = new Date(time)
      this.loading = true
      const nodes = [`${this.base}.${type}Model.vertices`]
      nodes.push(`${this.base}.${type}Model.vertex_normals`)
      nodes.push(`${this.base}.${type}Model.simplices`)
      const data = await this.apiService.read(nodes)
      // top.webMI.data.call('JMH_getHistory', { nodes, timestamp: timestamp.toISOString(), binary: true }, (data) => {
      //   try {
      //     console.log(data)
      //   } catch (error) {

      //   }
      // })
      if (type === 'last') {
        // const _timeStamp = new Date(data[0].timestamp)
        this.timeStamp = `Siste scan: ${this.$moment(data[0].timestamp).fromNow()}`
      }

      this.generateModel({
        vertices: data[0].value,
        vertex_normals: data[1].value,
        simplices: data[2].value
      }, color, side)
    // this.newPointCloud(Object.values(data[3].value.value), '#00ff00')
    },
    addLights (target) {
      const THREE = this.$three
      const hemiLight = new THREE.HemisphereLight(0x808080, 0x606060)
      hemiLight.position.set(0, 0, 0)
      this.scene.add(hemiLight)

      const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
      directionalLight.position.set(0, 1, 0)
      // directionalLight.target(target)
      directionalLight.castShadow = true
      directionalLight.shadow.camera.top = 10
      directionalLight.shadow.camera.bottom = -10
      directionalLight.shadow.camera.left = -10
      directionalLight.shadow.camera.right = 10
      this.scene.add(directionalLight)
      // this.scene.add(directionalLight.target)

      // const light = new THREE.AmbientLight(0x777777)
      // this.scene.add(light)
      // const pointLight = new THREE.PointLight(0xFFFFFF, 1, 10000)
      // pointLight.position.set(230, 320, 950)
      // this.scene.add(pointLight)
    },
    onResize () {
      const container = this.$refs.container
      this.camera.aspect = container.clientWidth / container.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(container.clientWidth, container.clientHeight)
    },
    getWindowWidth () {
      this.windowWidth = this.container.clientWidth
    },
    resizeEvent (ev) {
      // console.log(ev)
    },
    getWindowHeight () {
      this.windowHeight = this.container.clientHeight
    },
    clearScene () {
      this.scene.remove.apply(this.scene, this.scene.children)
    },
    animate () {
      this.renderer.setAnimationLoop(this.animate)
      this.render()
    },
    rotateScene (value) {
      this.scene.rotation.z = (value / 50) * Math.PI
    },
    setCameraType (type) {
      const THREE = this.$three
      const width = this.container.clientWidth
      const height = this.container.clientHeight
      if (type === 'ortho') {
        this.camera = new THREE.OrthographicCamera(
          width / -2,
          width / 2,
          height / 2,
          height / -2,
          0.2,
          1000
        )
        this.camera.position.set(0, 0, 12)
        this.camera.zoom = 100
        this.camera.updateProjectionMatrix()
        // this.scene.rotateY(Math.PI / 2);
      } else {
        this.camera = new THREE.PerspectiveCamera(
          50,
          this.container.clientWidth / this.container.clientHeight,
          0.2,
          1000
        )
        // this.camera.up.set(1, 0, 0)
        this.camera.position.set(0, 0.5, 12)
        this.camera.updateProjectionMatrix()
      }
      // const OrbitControls = this.$OrbitControls
      this.controls = new OrbitControls(this.camera, this.container)
      this.controls.target.set(0, -2, 0)
      this.controls.update()
    },
    toggleCameraType () {
      if (this.cameraType === 'ortho') {
        this.cameraType = ''
        this.setCameraType('')
      } else {
        this.cameraType = 'ortho'
        this.setCameraType('ortho')
      }
    },
    toggleCloud () {
      this.showCloud = !this.showCloud
      this.scene.children[2].visible = this.showCloud
    },
    render () {
      if (this.rotate) {
        this.scene.rotateY(0.005)
      }
      this.renderer.render(this.scene, this.camera)
    },
    newPointCloud (res, _color) {
      const THREE = this.$three
      // var points = res;
      const length = res.length
      const drawcount = length
      const dotGeometry = new THREE.BufferGeometry()
      const dotMaterial = new THREE.PointsMaterial({
        color: _color,
        size: 0.1,
        sizeAttenuation: true
      })
      // const positions = [] // new Float32Array( length * 3 ); // 3 vertices per point
      // const colors = [] // new Float32Array( length * 3 ); // 3 vertices per point
      // const color = new THREE.Color()

      // for (let i = 0; i < length; i++) {
      //   const x = res[i][0]
      //   const y = res[i][1] * -1
      //   const z = res[i][2] * -1
      //   positions.push(x, y, z)
      //   const vx = 1
      //   const vy = 0
      //   const vz = 0
      //   // if (res[i][3] > 35000) {
      //   //   vy = 1
      //   // } else {
      //   //   vx = 1
      //   // }
      //   color.setRGB(vx, vy, vz)
      //   colors.push(color.r, color.g, color.b)
      // }

      dotGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(res, 3)
      )
      // dotGeometry.setAttribute(
      //   'color',
      //   new THREE.Float32BufferAttribute(colors, 3)
      // )
      // dotGeometry.setDrawRange(0,drawcount);
      const pointCloud = new THREE.Points(dotGeometry, dotMaterial)
      pointCloud.scale.multiplyScalar(0.01)
      pointCloud.rotation.x = -Math.PI / 2
      pointCloud.position.y = 1
      this.scene.add(pointCloud)

      pointCloud.geometry.setDrawRange(0, drawcount)
      pointCloud.geometry.attributes.position.needsUpdate = true
      pointCloud.geometry.attributes.color.needsUpdate = true
    },
    getScans () {
      const self = this
      top.webMI.data.call(
        'API',
        {
          script: 'levelScanner.getScans',
          base: this.base,
          right: this.$store.getters['userData/getRight']()
        },
        function (data) {
          const files = JSON.parse(data.data)

          self.scans = files
          self.scans.sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
          )
        }
      )
    }
  }
}
</script>

<style>
</style>
