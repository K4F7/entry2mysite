// THROWAWAY PROTOTYPE: three visual variants for the d20 entry, switchable via ?variant= on /prototype/d20.
import * as THREE from 'three';
import './styles.css';

type VariantKey = 'A' | 'B' | 'C' | 'D' | 'E';

type Variant = {
  key: VariantKey;
  name: string;
  className: string;
  dieColor: number;
  numberColor: string;
  glowColor: number;
  cameraZ: number;
  ornament: 'none' | 'rail' | 'ring';
};

const variants: Variant[] = [
  { key: 'A', name: 'Center stage', className: 'variant-a', dieColor: 0xf4b183, numberColor: '#241b18', glowColor: 0xffc46b, cameraZ: 5.8, ornament: 'none' },
  { key: 'B', name: 'Ink toy', className: 'variant-b', dieColor: 0x22304a, numberColor: '#f8e8c8', glowColor: 0x76b9ff, cameraZ: 6.1, ornament: 'none' },
  { key: 'C', name: 'Candy prism', className: 'variant-c', dieColor: 0xd85b78, numberColor: '#fff5df', glowColor: 0xffafc5, cameraZ: 5.45, ornament: 'none' },
  { key: 'D', name: 'Brand rail', className: 'variant-d', dieColor: 0xe7d8bd, numberColor: '#2f2923', glowColor: 0xffd38a, cameraZ: 5.8, ornament: 'rail' },
  { key: 'E', name: 'Orbit seal', className: 'variant-e', dieColor: 0x8fc9b8, numberColor: '#102c2a', glowColor: 0xb6ffe9, cameraZ: 5.75, ornament: 'ring' },
];

const params = new URLSearchParams(window.location.search);
const requestedVariant = params.get('variant')?.toUpperCase() as VariantKey | undefined;
let activeVariant = variants.find((variant) => variant.key === requestedVariant) ?? variants[0];

const app = document.querySelector<HTMLDivElement>('#app')!;
const canvas = document.createElement('canvas');
canvas.className = 'prototype-canvas';
canvas.setAttribute('aria-label', 'Interactive d20. Click to roll and drag to rotate.');
app.append(canvas);

const ornament = document.createElement('div');
ornament.className = 'variant-ornament';
ornament.setAttribute('aria-hidden', 'true');
app.append(ornament);

const switcher = document.createElement('nav');
switcher.className = 'prototype-switcher';
switcher.setAttribute('aria-label', 'Prototype variants');
switcher.innerHTML = `
  <button class="switcher-arrow" data-direction="previous" aria-label="Previous variant">←</button>
  <span class="switcher-label"></span>
  <button class="switcher-arrow" data-direction="next" aria-label="Next variant">→</button>
`;
app.append(switcher);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambient = new THREE.HemisphereLight(0xffffff, 0x3f3028, 2.2);
scene.add(ambient);
const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
keyLight.position.set(-3, 4, 5);
keyLight.castShadow = true;
scene.add(keyLight);
const rimLight = new THREE.PointLight(activeVariant.glowColor, 1.4, 8);
rimLight.position.set(2, -1, 3);
scene.add(rimLight);

const geometry = new THREE.IcosahedronGeometry(0.78, 0);
geometry.clearGroups();
for (let face = 0; face < 20; face += 1) geometry.addGroup(face * 3, 3, face);

const faceNormals: THREE.Vector3[] = [];
const faceCenters: THREE.Vector3[] = [];
const position = geometry.getAttribute('position');
for (let face = 0; face < 20; face += 1) {
  const a = new THREE.Vector3().fromBufferAttribute(position, face * 3);
  const b = new THREE.Vector3().fromBufferAttribute(position, face * 3 + 1);
  const c = new THREE.Vector3().fromBufferAttribute(position, face * 3 + 2);
  const normal = new THREE.Vector3().subVectors(c, b).cross(new THREE.Vector3().subVectors(a, b)).normalize();
  const center = a.clone().add(b).add(c).multiplyScalar(1 / 3);
  if (normal.dot(center) < 0) normal.multiplyScalar(-1);
  faceNormals.push(normal);
  faceCenters.push(center);
}

function numberTexture(number: number, color: string) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext('2d')!;
  context.clearRect(0, 0, 256, 256);
  context.fillStyle = color;
  context.font = '900 112px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(String(number), 128, 132);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

let materials: THREE.MeshStandardMaterial[] = [];
const die = new THREE.Mesh(geometry, materials);
die.castShadow = true;
die.receiveShadow = true;
scene.add(die);
const faceLabels = new THREE.Group();
die.add(faceLabels);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(2.4, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.06 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.72;
floor.scale.set(1, 0.35, 1);
scene.add(floor);

let rolling = false;
let dragging = false;
let pointerMoved = false;
let pointerStart = new THREE.Vector2();
let fromQuaternion = new THREE.Quaternion();
let targetQuaternion = new THREE.Quaternion();
let rollStartedAt = 0;
let selectedFace = 0;
let spinAxis = new THREE.Vector3(0.4, 0.8, 0.2).normalize();
let spinTurns = 2.5;

function patternData(color: string, opacity: number) {
  const repeatedName = 'sein31sein31sein31sein31sein31';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" overflow="visible"><g fill="${color}" fill-opacity="${opacity}" font-family="Arial, sans-serif" font-weight="900" font-size="48" letter-spacing="-1" textLength="860" lengthAdjust="spacingAndGlyphs"><text x="-92" y="82" transform="rotate(-28 320 82)">${repeatedName}</text><text x="-92" y="202" transform="rotate(-28 320 202)">${repeatedName}</text><text x="-92" y="322" transform="rotate(-28 320 322)">${repeatedName}</text></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function applyVariant() {
  document.body.className = activeVariant.className;
  document.body.style.setProperty('--pattern-image', patternData(activeVariant.key === 'B' ? '#f8e8c8' : '#1b1714', activeVariant.key === 'C' ? 0.15 : 0.2));
  ornament.className = `variant-ornament ornament-${activeVariant.ornament}`;
  ornament.textContent = activeVariant.ornament === 'rail' ? 'sein31' : '';
  camera.position.set(0, 0, activeVariant.cameraZ);
  rimLight.color.setHex(activeVariant.glowColor);
  materials.forEach((material) => material.dispose());
  faceLabels.clear();
  materials = Array.from({ length: 20 }, (_, index) => new THREE.MeshStandardMaterial({
    color: activeVariant.dieColor,
    roughness: 0.34,
    metalness: 0.04,
    emissive: activeVariant.glowColor,
    emissiveIntensity: 0.08,
  }));
  for (let index = 0; index < 20; index += 1) {
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: numberTexture(index + 1, activeVariant.numberColor),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.31), labelMaterial);
    label.position.copy(faceCenters[index]).multiplyScalar(1.035);
    label.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), faceNormals[index]);
    faceLabels.add(label);
  }
  die.material = materials;
  const label = switcher.querySelector<HTMLSpanElement>('.switcher-label')!;
  label.textContent = `${activeVariant.key} — ${activeVariant.name}`;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function roll() {
  if (rolling) return;
  selectedFace = Math.floor(Math.random() * 20);
  const normal = faceNormals[selectedFace].clone();
  const cameraDirection = new THREE.Vector3(0, 0, 1);
  const align = new THREE.Quaternion().setFromUnitVectors(normal, cameraDirection);
  const twist = new THREE.Quaternion().setFromAxisAngle(cameraDirection, Math.random() * Math.PI * 2);
  fromQuaternion.copy(die.quaternion);
  targetQuaternion.copy(twist).multiply(align);
  spinAxis.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  spinTurns = 2.5 + Math.random() * 1.5;
  rollStartedAt = performance.now();
  rolling = true;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function animate(time: number) {
  requestAnimationFrame(animate);
  if (rolling) {
    const progress = Math.min((time - rollStartedAt) / 1500, 1);
    const eased = easeOutCubic(progress);
    die.quaternion.slerpQuaternions(fromQuaternion, targetQuaternion, eased);
    const spin = new THREE.Quaternion().setFromAxisAngle(spinAxis, Math.sin(progress * Math.PI) * spinTurns * Math.PI * 2);
    die.quaternion.premultiply(spin);
    if (progress >= 1) {
      die.quaternion.copy(targetQuaternion);
      rolling = false;
    }
  } else if (!dragging) {
    const pulse = 0.08 + Math.sin(time * 0.003) * 0.035;
    materials.forEach((material) => { material.emissiveIntensity = pulse; });
  }
  renderer.render(scene, camera);
}

canvas.addEventListener('pointerdown', (event) => {
  pointerStart.set(event.clientX, event.clientY);
  pointerMoved = false;
  dragging = false;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (!canvas.hasPointerCapture(event.pointerId) || rolling) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  if (Math.hypot(dx, dy) < 3) return;
  pointerMoved = true;
  dragging = true;
  die.rotation.y += dx * 0.012;
  die.rotation.x += dy * 0.012;
  pointerStart.set(event.clientX, event.clientY);
});

canvas.addEventListener('pointerup', (event) => {
  canvas.releasePointerCapture(event.pointerId);
  if (!pointerMoved) roll();
  dragging = false;
});

switcher.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-direction]');
  if (!button) return;
  const offset = button.dataset.direction === 'next' ? 1 : -1;
  const index = (variants.indexOf(activeVariant) + offset + variants.length) % variants.length;
  activeVariant = variants[index];
  const nextParams = new URLSearchParams(window.location.search);
  nextParams.set('variant', activeVariant.key);
  window.history.replaceState({}, '', `${window.location.pathname}?${nextParams}`);
  applyVariant();
});

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target as HTMLElement).isContentEditable) return;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  const offset = event.key === 'ArrowRight' ? 1 : -1;
  const index = (variants.indexOf(activeVariant) + offset + variants.length) % variants.length;
  activeVariant = variants[index];
  const nextParams = new URLSearchParams(window.location.search);
  nextParams.set('variant', activeVariant.key);
  window.history.replaceState({}, '', `${window.location.pathname}?${nextParams}`);
  applyVariant();
});

applyVariant();
resize();
window.addEventListener('resize', resize);
requestAnimationFrame(animate);
window.setTimeout(roll, 500);
