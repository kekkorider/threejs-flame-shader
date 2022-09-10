varying vec3 vViewPosition;
varying vec3 vWorldPosition;

#include <normal_pars_vertex>

void main() {
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>

  #include <begin_vertex>
  #include <project_vertex>

  vViewPosition = -mvPosition.xyz;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}
