import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== Config từ window.dataLove2Loveloom =====
const cfg = window.dataLove2Loveloom || {};
const data = cfg.data || {};
const keychain = data.keychain || {};
const ringTexts = data.ringTexts || ['LOVE Hà Minh Ngọc'];
const images = data.images || [];

// ===== Setup Scene =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);
document.getElementById('container').prepend(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 35;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;

// ===== Starfield =====
function createStarfield() {
  const geometry = new THREE.BufferGeometry();
  const count = 5000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 50 + Math.random() * 150;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = Math.random();
    if (c < 0.3) { colors[i*3]=1; colors[i*3+1]=0.7; colors[i*3+2]=0.8; }
    else if (c < 0.6) { colors[i*3]=0.8; colors[i*3+1]=0.8; colors[i*3+2]=1; }
    else { colors[i*3]=1; colors[i*3+1]=1; colors[i*3+2]=1; }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

scene.add(createStarfield());

// ===== Galaxy Spiral =====
function createGalaxy() {
  const group = new THREE.Group();
  const armCount = 3;
  const starsPerArm = 2000;

  for (let arm = 0; arm < armCount; arm++) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsPerArm * 3);
    const colors = new Float32Array(starsPerArm * 3);
    const armOffset = (arm / armCount) * Math.PI * 2;

    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm;
      const angle = t * Math.PI * 4 + armOffset;
      const radius = t * 12 + 1;
      const spread = (1 - t) * 1.5 + 0.2;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

      const brightness = 0.3 + t * 0.7;
      colors[i * 3] = brightness * (0.8 + Math.random() * 0.2);
      colors[i * 3 + 1] = brightness * 0.4 * Math.random();
      colors[i * 3 + 2] = brightness * (0.6 + Math.random() * 0.4);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    group.add(new THREE.Points(geometry, mat));
  }

  return group;
}

const galaxy = createGalaxy();
scene.add(galaxy);

// ===== Center Orb (clickable planet) =====
function createCenterOrb() {
  const group = new THREE.Group();

  // Core glow sphere
  const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff1493,
    emissive: 0xff1493,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.5,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Outer glow
  const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff69b4,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));

  // Point lights
  const light1 = new THREE.PointLight(0xff1493, 3, 20);
  const light2 = new THREE.PointLight(0x9400d3, 2, 15);
  light2.position.set(3, 2, 0);
  group.add(light1, light2);

  // Ambient
  scene.add(new THREE.AmbientLight(0x330033, 0.5));

  return group;
}

const centerOrb = createCenterOrb();
scene.add(centerOrb);

// ===== Text Ring =====
function createTextRing(text, radius, yOffset = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 72px serif';
  ctx.fillStyle = '#ffb3d1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fullText = text + '  ✦  ';
  const repeats = Math.ceil(canvas.width / ctx.measureText(fullText).width) + 1;
  ctx.fillText(fullText.repeat(repeats), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  const geo = new THREE.TorusGeometry(radius, 0.06, 8, 128);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
  });

  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = yOffset;
  return ring;
}

const ring1 = createTextRing(ringTexts[0] || 'LOVE Hà Minh Ngọc', 5, 0.2);
const ring2 = createTextRing('✦ forever ✦ always ✦ yours ✦', 7, -0.2);
scene.add(ring1, ring2);

// ===== Floating Hearts =====
function createHeart() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x + 0.25, y + 0.25);
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

  const geo = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff1493,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geo, mat);
}

const hearts = [];
for (let i = 0; i < 12; i++) {
  const h = createHeart();
  const angle = (i / 12) * Math.PI * 2;
  const r = 3 + Math.random() * 2;
  h.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 3, Math.sin(angle) * r);
  h.scale.setScalar(0.15 + Math.random() * 0.2);
  h.userData = { speed: 0.3 + Math.random() * 0.5, angle, r, baseY: h.position.y };
  hearts.push(h);
  scene.add(h);
}

// ===== Raycaster for click =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isGiftOpen = false;

function onPointerDown(e) {
  if (isGiftOpen) return;
  const rect = renderer.domElement.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(centerOrb.children, true);
  if (hits.length > 0) openGift();
}

renderer.domElement.addEventListener('click', onPointerDown);
renderer.domElement.addEventListener('touchstart', onPointerDown);

function openGift() {
  isGiftOpen = true;
  document.getElementById('dark-overlay').classList.add('active');

  const infoEl = document.getElementById('info');
  infoEl.innerHTML = buildGiftPanel();
  infoEl.classList.add('visible');

  infoEl.querySelector('.btn-close-gift').addEventListener('click', closeGift);
}

function buildGiftPanel() {
  const imgHtml = images.length > 0
    ? `<div class="gift-image-grid">${images.map(src => `<img src="${src}" alt="memory" loading="lazy">`).join('')}</div>`
    : '';

  return `
    <div class="gift-panel">
      <div class="gift-subtitle">✦ một món quà nhỏ ✦</div>
      <div class="gift-title">${keychain.name || 'LOVE Hà Minh Ngọc'}</div>
      ${imgHtml}
      <p class="gift-message">${keychain.address || 'Vũ trụ này thật đẹp vì có em trong đó 🌸'}</p>
      <div class="gift-hearts">💗 💗 💗</div>
      <button class="btn-close-gift">Đóng lại ✕</button>
    </div>
  `;
}

function closeGift() {
  isGiftOpen = false;
  document.getElementById('dark-overlay').classList.remove('active');
  const infoEl = document.getElementById('info');
  infoEl.classList.remove('visible');
  setTimeout(() => { infoEl.innerHTML = ''; }, 600);
}

// ===== Resize =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== Animate =====
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.008;

  // Rotate galaxy
  galaxy.rotation.y += 0.0003;

  // Pulse center orb
  const scale = 1 + Math.sin(t * 2) * 0.05;
  centerOrb.scale.setScalar(scale);

  // Rings counter-rotate
  ring1.rotation.z -= 0.001;
  ring2.rotation.z += 0.0008;

  // Float hearts
  hearts.forEach(h => {
    h.userData.angle += h.userData.speed * 0.003;
    h.position.x = Math.cos(h.userData.angle) * h.userData.r;
    h.position.z = Math.sin(h.userData.angle) * h.userData.r;
    h.position.y = h.userData.baseY + Math.sin(t + h.userData.angle) * 0.3;
    h.rotation.z = Math.sin(t * 0.5 + h.userData.angle) * 0.3;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
