varying vec3 vViewPosition;

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

#include <normal_pars_fragment>

void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);

  #include <normal_fragment_begin>

  vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

  vec4 matcapColor = texture2D( matcap, uv );

  vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

  #include <output_fragment>
}
