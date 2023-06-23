import {
  PlaneGeometry,
  VideoTexture,
  MeshBasicMaterial,
  Mesh,
  OrthographicCamera,
  Scene,
  MathUtils,
  Euler,
  EventDispatcher,
  Quaternion,
  Vector3,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Sprite,
  SpriteMaterial
} from 'three';



// From the source files of AR.js, edited line 19 because the original BufferPlaneGeometry or whatever it was, was outdated
class WebcamRendererLocal {
  constructor(renderer, videoElement) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new Scene();
    let video;
    if (videoElement === undefined) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElement);
    }
    this.geom = new PlaneGeometry();
    this.texture = new VideoTexture(video);
    this.material = new MeshBasicMaterial({ map: this.texture });
    const mesh = new Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: 1280,
          height: 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          // console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          setTimeout(() => {
            this.createErrorPopup(
              "Webcam Error\nName: " + e.name + "\nMessage: " + e.message
            );
          }, 1000);
        });
    } else {
      setTimeout(() => {
        this.createErrorPopup("sorry - media devices API not supported");
      }, 1000);
    }
  }

  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }

  createErrorPopup(msg) {
    if (!document.getElementById("error-popup")) {
      var errorPopup = document.createElement("div");
      errorPopup.innerHTML = msg;
      errorPopup.setAttribute("id", "error-popup");
      document.body.appendChild(errorPopup);
    }
  }
}

class LocationBasedLocal {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._proj = new SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 0;
    this._gpsMinAccuracy = 100;
    this._maximumAge = 0;
    this._watchPositionId = null;
    this.setGpsOptions(options);
    this.initialPosition = null;
    this.initialPositionAsOrigin = options.initialPositionAsOrigin || false;

    this.userLatitude = null;
    this.userLongitude = null;
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
    if (options.maximumAge !== undefined) {
      this._maximumAge = options.maximumAge;
    }
  }


  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      navigator.geolocation.getCurrentPosition(function () { }, function (err) { console.log('error on getting location', error) }, {});
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
          if (!position.coords.longitude && !position.coords.latitude) {
            console.log('did not get the positions');
          } else {
            console.log('my position: ', parseFloat(position.coords.longitude.toFixed(3)), parseFloat(position.coords.latitude.toFixed(3)))
            this.setUserPosition(parseFloat(position.coords.longitude), parseFloat(position.coords.latitude))
          }
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            // alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge != 0 ? maximumAge : this._maximumAge,
        }
      );
      return true;
    }
    return false;
  }

  setUserPosition = (longitude, latitude,) => {

    // console.log('long and lat in web.js', typeof longitude, typeof latitude + 0.001,)

    this.userLatitude = latitude;
    this.userLongitude = longitude;

  }

  getUserPosition() {
    return {
      latitude: this.userLatitude,
      longitude: this.userLongitude,
    };
  }


  stopGps() {
    if (this._watchPositionId !== null) {
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    if (this.initialPositionAsOrigin) {
      if (this.initialPosition) {
        projectedPos[0] -= this.initialPosition[0];
        projectedPos[1] -= this.initialPosition[1];
      } else {
        throw "Trying to use 'initial position as origin' mode with no initial position determined";
      }
    }
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    return new Promise((resolve, reject) => {
      try {
        this.setWorldPosition(object, lon, lat, elev);
        this._scene.add(object);
        // console.log('added object!');
        resolve();
      } catch (error) {
        console.error('An error occurred while adding the object:', error);
        reject(error);
      }
    });
  }




  setWorldPosition(object, lon, lat, elev) {
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    if (elev !== undefined) {
      object.position.y = elev;
    }
    [object.position.x, object.position.z] = worldCoords;
  }

  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  setWorldOrigin(lon, lat) {
    this.initialPosition = this._proj.project(lon, lat);
  }

  _gpsReceived(position) {
    let distMoved = Number.MAX_VALUE;
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if (distMoved >= this._gpsMinDistance) {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;

        if (this.initialPositionAsOrigin && !this.initialPosition) {
          this.setWorldOrigin(
            position.coords.longitude,
            position.coords.latitude
          );
        }

        this.setWorldPosition(
          this._camera,
          position.coords.longitude,
          position.coords.latitude
        );

        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        }
      }
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
    const dlongitude = MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(MathUtils.degToRad(src.latitude)) *
      Math.cos(MathUtils.degToRad(dest.latitude)) *
      (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}

const _zee = new Vector3(0, 0, 1);
const _euler = new Euler();
const _q0 = new Quaternion();
const _q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends EventDispatcher {
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.TWO_PI = 2 * Math.PI;
    this.HALF_PI = 0.5 * Math.PI;
    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    this.smoothingFactor = 1;

    const onDeviceOrientationChangeEvent = function (event) {
      scope.deviceOrientation = event;
    };

    const onScreenOrientationChangeEvent = function () {
      scope.screenOrientation = window.orientation || 0;
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    const setObjectQuaternion = function (
      quaternion,
      alpha,
      beta,
      gamma,
      orient
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load

      // iOS 13+

      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "orientationchange",
                onScreenOrientationChangeEvent
              );
              window.addEventListener(
                scope.orientationChangeEventName,
                onDeviceOrientationChangeEvent
              );
            }
          })
          .catch(function (error) {
            console.error(
              "DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent
        );
        window.addEventListener(
          scope.orientationChangeEventName,
          onDeviceOrientationChangeEvent
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent
      );
      window.removeEventListener(
        scope.orientationChangeEventName,
        onDeviceOrientationChangeEvent
      );

      scope.enabled = false;
    };

    this.update = function () {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        let alpha = device.alpha
          ? MathUtils.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        let beta = device.beta ? MathUtils.degToRad(device.beta) : 0; // X'

        let gamma = device.gamma ? MathUtils.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? MathUtils.degToRad(scope.screenOrientation)
          : 0; // O

        if (this.smoothingFactor < 1) {
          if (this.lastOrientation) {
            const k = this.smoothingFactor;
            alpha = this._getSmoothedAngle(
              alpha,
              this.lastOrientation.alpha,
              k
            );
            beta = this._getSmoothedAngle(
              beta + Math.PI,
              this.lastOrientation.beta,
              k
            );
            gamma = this._getSmoothedAngle(
              gamma + this.HALF_PI,
              this.lastOrientation.gamma,
              k,
              Math.PI
            );
          } else {
            beta += Math.PI;
            gamma += this.HALF_PI;
          }

          this.lastOrientation = {
            alpha: alpha,
            beta: beta,
            gamma: gamma,
          };
        }

        setObjectQuaternion(
          scope.object.quaternion,
          alpha,
          this.smoothingFactor < 1 ? beta - Math.PI : beta,
          this.smoothingFactor < 1 ? gamma - this.HALF_PI : gamma,
          orient
        );

        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
      }
    };

    // NW Added
    this._orderAngle = function (a, b, range = this.TWO_PI) {
      if (
        (b > a && Math.abs(b - a) < range / 2) ||
        (a > b && Math.abs(b - a) > range / 2)
      ) {
        return { left: a, right: b };
      } else {
        return { left: b, right: a };
      }
    };

    // NW Added
    this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
      const angles = this._orderAngle(a, b, range);
      const angleshift = angles.left;
      const origAnglesRight = angles.right;
      angles.left = 0;
      angles.right -= angleshift;
      if (angles.right < 0) angles.right += range;
      let newangle =
        origAnglesRight == b
          ? (1 - k) * angles.right + k * angles.left
          : k * angles.right + (1 - k) * angles.left;
      newangle += angleshift;
      if (newangle >= range) newangle -= range;
      return newangle;
    };

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  }
}

class SphMercProjection {
  constructor() {
    this.EARTH = 40075016.68;
    this.HALF_EARTH = 20037508.34;
  }

  project(lon, lat) {
    return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
  }

  unproject(projected) {
    return [this.sphMercToLon(projected[0]), this.sphMercToLat(projected[1])];
  }

  lonToSphMerc(lon) {
    return (lon / 180) * this.HALF_EARTH;
  }

  latToSphMerc(lat) {
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    return (y * this.HALF_EARTH) / 180.0;
  }

  sphMercToLon(x) {
    return (x / this.HALF_EARTH) * 180.0;
  }

  sphMercToLat(y) {
    var lat = (y / this.HALF_EARTH) * 180.0;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return lat;
  }

  getID() {
    return "epsg:3857";
  }
}

export {

  // ARjs methods
  WebcamRendererLocal,
  LocationBasedLocal,
  DeviceOrientationControls,

  // three methods
  PlaneGeometry,
  VideoTexture,
  MeshBasicMaterial,
  Mesh,
  OrthographicCamera,
  Scene,
  MathUtils,
  Euler,
  EventDispatcher,
  Quaternion,
  Vector3,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Sprite,
  SpriteMaterial,
};