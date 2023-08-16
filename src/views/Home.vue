<template>
  <div>
    <Controls />
    <Suspense>
      <Map />
    </Suspense>
  </div>
</template>

<script>
import { Suspense } from 'vue';


import Map from '@/components/Map.vue';
import Controls from '@/components/Controls.vue';

export default {
  name: 'Home',
  components: {
    Map,
    Controls
},
};
</script>
