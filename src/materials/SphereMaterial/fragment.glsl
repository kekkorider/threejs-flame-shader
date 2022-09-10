varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform vec3 diffuse;
uniform vec3 u_FlameColor;
uniform float opacity;
uniform sampler2D matcap;
uniform sampler2D t_noise;
uniform float u_time;
uniform vec3 u_PivotPosition;
uniform float u_AlphaFalloffStart;
uniform float u_AlphaFalloffEnd;
uniform float u_FlameFalloffStart;
uniform float u_FlameFalloffEnd;

#include <normal_pars_fragment>

void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);

  #include <normal_fragment_begin>

  vec3 viewDir = normalize(vViewPosition);
	vec3 x = normalize( vec3(viewDir.z, 0.0, - viewDir.x));
	vec3 y = cross(viewDir, x);
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

  vec4 matcapColor = texture2D(matcap, uv);
  vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

  // Get the distance between the mesh (`vWorldPosition`) and
  // the object used to trigger the effect (`u_PivotPosition`).
  float distanceFromPivot = distance(vWorldPosition, u_PivotPosition);

  // Animated noise texture
  vec4 tNoise = texture2D(t_noise, uv+vec2(u_time* -0.2, u_time*0.1));

  // This value is used to fade out the colors based on
  // how close the mesh is to `u_PivotPosition`.
  // Subtracting one of the texture's channels makes it look "flamy"
  float mixValue = distanceFromPivot - 1.0 - tNoise.b;

  // Mix the matcap with the flames' color given the `flameFalloff` value
  float flameFalloff = smoothstep(u_FlameFalloffStart, u_FlameFalloffEnd, mixValue);
  outgoingLight = mix(outgoingLight, u_FlameColor+u_FlameColor, 1.0 - flameFalloff);

  #include <output_fragment>

  // Same as `flameFalloff`, but for the alpha channel
  float alphaFalloff = smoothstep(u_AlphaFalloffStart, u_AlphaFalloffEnd, mixValue);
  gl_FragColor.a = alphaFalloff;
}
