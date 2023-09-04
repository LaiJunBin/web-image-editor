import type { MenuType } from '@/const/menus'
import { shallowMount } from '@vue/test-utils'
import TheNavbarVue from '../TheNavbar.vue'
import { nextTick } from 'vue'

enum TestMenuAction {
  CHILD1,
  CHILD2,
  CHILD3
}

const menus: MenuType<TestMenuAction>[] = [
  {
    text: 'Parent 1',
    children: [
      {
        text: 'Child 1',
        action: TestMenuAction.CHILD1
      },
      {
        text: 'Child 2',
        action: TestMenuAction.CHILD2
      }
    ]
  },
  {
    text: 'Parent 2',
    children: [
      {
        text: 'Child 3',
        action: TestMenuAction.CHILD3
      }
    ]
  }
]

const disableMenus: MenuType<TestMenuAction>[] = [
  {
    text: 'Parent 1',
    children: [
      {
        text: 'Child 1',
        action: TestMenuAction.CHILD1
      },
      {
        text: 'Disabled Child',
        action: TestMenuAction.CHILD2,
        disabled: () => true
      }
    ]
  }
]

describe('TheNavbar', () => {
  test('render properly menus', async () => {
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('open/close menu', async () => {
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus
      }
    })

    const targetMenu = wrapper.findAll('li').find((li) => li.text().match(menus[0].text))
    expect(targetMenu).toBeDefined()

    const targetSubMenu = targetMenu!.get('ul')
    expect(targetSubMenu.isVisible()).toBeFalsy()

    await targetMenu?.trigger('click')
    expect(targetSubMenu.isVisible()).toBeTruthy()

    await targetMenu?.trigger('click')
    expect(targetSubMenu.isVisible()).toBeFalsy()
  })

  test('emit menu action', async () => {
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus
      }
    })

    const targetMenu = wrapper.findAll('li').find((li) => li.text().match(menus[0].text))
    expect(targetMenu).toBeDefined()

    const targetItem = targetMenu!
      .findAll('li')
      .find((li) => li.text().match(menus[0].children[0].text))
    expect(targetItem).toBeDefined()

    await targetItem?.trigger('click')
    expect(wrapper.emitted('menu-action')).toEqual([[menus[0].children[0].action]])
  })

  test('close menu when click outside', async () => {
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus
      }
    })

    const targetMenu = wrapper.findAll('li').find((li) => li.text().match(menus[0].text))
    expect(targetMenu).toBeDefined()

    const targetSubMenu = targetMenu!.get('ul')
    expect(targetSubMenu.isVisible()).toBeFalsy()

    await targetMenu?.trigger('click')
    expect(targetSubMenu.isVisible()).toBeTruthy()

    window.dispatchEvent(new Event('click'))
    await nextTick()
    expect(targetSubMenu.isVisible()).toBeFalsy()
  })

  test('unmount', async () => {
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus
      }
    })

    const targetMenu = wrapper.findAll('li').find((li) => li.text().match(menus[0].text))
    expect(targetMenu).toBeDefined()

    const targetSubMenu = targetMenu!.get('ul')
    expect(targetSubMenu.isVisible()).toBeFalsy()

    await targetMenu?.trigger('click')
    expect(targetSubMenu.isVisible()).toBeTruthy()

    wrapper.unmount()
    window.dispatchEvent(new Event('click'))
    await nextTick()
    expect(targetSubMenu.isVisible()).toBeTruthy()
  })

  test('disabled menu item', async () => {
    const disabledClasses = 'cursor-no-drop opacity-50 hover:!bg-neutral-500'.split(' ')
    const wrapper = shallowMount(TheNavbarVue<TestMenuAction>, {
      attachTo: document.body,
      props: {
        menus: disableMenus
      }
    })

    const targetMenu = wrapper.findAll('li').find((li) => li.text().match(disableMenus[0].text))
    expect(targetMenu).toBeDefined()

    const targetItem = targetMenu!
      .findAll('li')
      .find((li) => li.text().match(disableMenus[0].children[1].text))

    expect(targetItem).toBeDefined()
    expect(disabledClasses.every((className) => targetItem!.classes().includes(className))).toBe(
      true
    )
    await targetItem?.trigger('click')
    expect(wrapper.emitted('menu-action')).toBeUndefined()
  })
})
