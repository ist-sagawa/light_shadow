// Vertex Shader
export const VS_CODE = `
  varying vec2 vUv;
  uniform float uScrollOffset;

  float PI = 3.1415926535897932384626433832795;

  void main(){
    vUv = uv;
    vec3 pos = position;

    // float offset = 3.0;
    // float freq = 0.05;
    // float amp = 0.05;
    // pos.x = pos.x + sin(pos.y * offset + uScrollOffset * freq * PI ) * amp;

    // 横方向
    float amp = 0.02; // 振幅（の役割） 大きくすると波が大きくなる
    float freq = 0.008 * uScrollOffset; // 振動数（の役割） 大きくすると波が細かくなる

    // 縦方向
    float tension = -0.001 * uScrollOffset; // 上下の張り具合

    pos.x = pos.x + sin(pos.y * PI  * freq) * amp;
    pos.y = pos.y + (cos(pos.x * PI) * tension);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader
export const FS_CODE = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uScrollOffset;

  void main(){
    // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
    );

    // 計算結果を用いて補正後のuv値を生成
    vec2 fixedUv = vec2(
      (vUv.x - 0.5) * ratio.x + 0.5,
      (vUv.y - 0.5) * ratio.y + 0.5
    );

    // vec3 texture = texture2D(uTexture, fixedUv).rgb;

    vec2 offset = vec2(0.0, uScrollOffset * 0.00005);
    float r = texture2D(uTexture, fixedUv + offset).r;
    float g = texture2D(uTexture, fixedUv + offset * 0.5).g;
    float b = texture2D(uTexture, fixedUv).b;
    float a = texture2D(uTexture, fixedUv + offset).a;
    vec4 texture = vec4(r, g, b, a);

    gl_FragColor = vec4(texture);
  }
`;
