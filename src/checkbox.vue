<template>
  <label
    v-bind:style="{
      color: titleColor,
    }"
    class="custom-checkbox"
    ><input type="checkbox" v-model="is_checked" @change="emitCheckedState" />{{
      title
    }}</label
  >
  <!-- <p>{{ state }}</p> -->
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
export default defineComponent({
  name: 'CheckBox',
  props: {
    title: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String,
      default: '#42b983', // デフォルトのタイトルの色
    },
  },
  emits: ['update:is_checked', 'change'],
  setup(props, { emit }) {
    const { title, titleColor } = toRefs(props);
    const is_checked = ref<boolean>(false);

    const emitCheckedState = () => {
      emit('update:is_checked', is_checked.value);
      emit('change', is_checked.value);
    };

    return {
      title,
      titleColor,
      is_checked,
      emitCheckedState,
    };
  },
});
</script>

<style scoped>
.custom-checkbox {
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
}

/* スマートフォン対応 */
@media (max-width: 768px) {
  .custom-checkbox {
    font-size: 16px;
    padding: 8px;
  }
}

/* PC対応 */
@media (min-width: 769px) {
  .custom-checkbox {
    font-size: 18px;
    padding: 10px;
  }
}
</style>
