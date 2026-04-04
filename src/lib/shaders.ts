export const hesitantVertexShader = `
  precision highp float;
  uniform float uTime;
  uniform float uKerning;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Breathing Kerning: Subtle expansion/contraction on X-axis
    pos.x *= (1.0 + uKerning);

    // Subtle Z-axis breathing
    float elevation = sin(pos.x * 2.0 + uTime) * 0.1;
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const thermalFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uThermalStrength;
  uniform vec3 uBaseColor;
  uniform vec3 uHeatColor;
  uniform float uFlicker;
  varying vec2 vUv;
  varying float vElevation;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    float dist = distance(vUv, uMouse);
    float heat = smoothstep(0.4, 0.0, dist) * uThermalStrength;

    float flicker = (1.0 + sin(uTime * 15.0) * 0.3) * uFlicker;
    heat *= flicker;

    float n = random(vUv + uTime * 0.05) * 0.15;

    vec2 distortedUv = vUv;
    distortedUv += (sin(vUv.yx * 20.0 + uTime * 5.0) * heat * 0.5);

    vec3 finalColor = mix(uBaseColor, uHeatColor, heat);
    finalColor += n;
    
    float alpha = 0.8 + heat * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const glitchTransitionShader = `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    
    // 3-Phase Timeline Logic
    // 0.0 -> 0.25: Fade-in (High Noise)
    // 0.25 -> 0.75: Sustain (Stable)
    // 0.75 -> 1.0: Collapse (Violent Melt)
    
    float alpha = 1.0;
    float glitch = 0.0;
    
    if (uProgress < 0.25) {
      // Phase 1: Fade-in
      float localProgress = uProgress / 0.25;
      alpha = localProgress;
      glitch = (1.0 - localProgress) * 0.5;
    } else if (uProgress < 0.75) {
      // Phase 2: Sustain
      alpha = 1.0;
      glitch = 0.0;
    } else {
      // Phase 3: Collapse
      float localProgress = (uProgress - 0.75) / 0.25;
      alpha = 1.0 - localProgress;
      glitch = localProgress;
    }
    
    // Apply Glitch / Melt
    if (glitch > 0.0) {
      if (random(vec2(floor(uv.y * 50.0), uTime)) < glitch * 0.8) {
        uv.x += (random(vec2(uTime)) - 0.5) * glitch;
      }
      uv.y += sin(uv.x * 20.0 + uTime * 10.0) * glitch * 0.3;
    }
    
    // Fine Grain Noise
    float n = random(uv + uTime * 0.1) * 0.1;
    
    // In the component, we'll apply this to the text color
    gl_FragColor = vec4(vec3(1.0) + n, alpha);
  }
`;
