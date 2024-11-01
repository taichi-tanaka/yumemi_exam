<template>
  <label
    v-bind:style="{
      color: titleColor,
    }"
    class="custom-checkbox"
    ><input type="checkbox" v-model="is_checked" />{{ title }}</label
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
  setup(props) {
    const { title, titleColor } = toRefs(props);
    const is_checked = ref<boolean>(false);

    return {
      title,
      titleColor,
      is_checked,
    };
  },
});
</script>

<style scoped>
.custom-checkbox {
  font-size: 18px;
  cursor: pointer;
}
</style>
