<template>
  <div class="dropdown-container">
    <select id="dropdown" v-model="selected" class="dropdown-select">
      <option v-for="item in list" :key="item" :value="item">{{ item }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    list: {
      type: Array as () => string[],
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    bidirectional: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'selected'],
  setup(props, { emit }) {
    const { modelValue, bidirectional } = toRefs(props);
    const selected = ref(modelValue.value);
    selected.value = props.list[0];

    watch(modelValue, newValue => {
      if (bidirectional.value === true) {
        if (selected.value !== newValue) {
          selected.value = newValue;
          emit('selected', selected.value);
        }
      } else {
        emit('update:modelValue', selected.value);
      }
    });

    watch(selected, newValue => {
      if (selected.value === newValue) {
        emit('update:modelValue', selected.value);
        emit('selected', selected.value);
      }
    });

    return {
      selected,
    };
  },
});
</script>

<style scoped>
.dropdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown-select {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: center;
}

@media (max-width: 768px) {
  /* スマートフォン表示用のスタイル */
  .dropdown-label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .dropdown-select {
    width: 100%;
    font-size: 14px;
  }
}

@media (min-width: 769px) {
  /* PC表示用のスタイル */
  .dropdown-label {
    font-size: 16px;
  }

  .dropdown-select {
    width: auto;
  }
}
</style>
