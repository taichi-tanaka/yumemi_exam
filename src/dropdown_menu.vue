<template>
  <div>
    <select id="dropdown" v-model="selected" @change="emitCheckedState">
      <option v-for="item in list" :key="item" :value="item">{{ item }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    list: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const selected = ref(props.list[0]);

    const emitCheckedState = () => {
      emit('selected', selected.value);
    };

    return {
      selected,
      emitCheckedState,
    };
  },
});
</script>

<style scoped>
.dropdown-label {
  font-weight: bold;
  margin-right: 10px;
}
</style>
