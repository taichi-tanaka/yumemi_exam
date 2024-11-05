// DropdownMenu.spec.ts
import { shallowMount } from '@vue/test-utils';
// import DropdownMenu from '@/dropdown_menu.vue';
import DropdownMenu from './../../src/dropdown_menu.vue';

describe('dropdown_menu.vue', () => {
  it('renders the dropdown menu correctly', () => {
    const wrapper = shallowMount(DropdownMenu, {
      props: {
        list: ['総人口', '年少人口', '生産年齢人口', '老年人口'],
        modelValue: '総人口',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = shallowMount(DropdownMenu, {
      props: {
        list: ['総人口', '年少人口', '生産年齢人口', '老年人口'],
        modelValue: '総人口',
      },
    });

    const select = wrapper.find('select');
    await select.setValue('年少人口');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['年少人口']);
  });
});
