export const VERTEX_SHADER_SOURCE = `
#include <common>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

varying vec3 vWorldPosition;

void main() {
	#include <begin_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
	vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
}
`;

export const FRAGMENT_SHADER_SOURCE = `
#include <common>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D tColorMap;
uniform vec4 uSamplingPoints[MAX_SAMPLING_POINT_COUNT];

varying vec3 vWorldPosition;

void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

  // calculate weight.
  float weight = 0.0;
  for (int i = 0; i < MAX_SAMPLING_POINT_COUNT; i ++) {
    highp float intensity = uSamplingPoints[i].w;
    highp float distance = distance(vWorldPosition, uSamplingPoints[i].xyz);
    weight = max(weight, max(intensity - distance, 0.0));
  }
  
  // fill color
  gl_FragColor = vec4(texture2D(tColorMap, vec2(weight, weight)).xyz, 1.0);
}
`;