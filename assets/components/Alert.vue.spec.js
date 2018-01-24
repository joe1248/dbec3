import { mount } from '@vue/test-utils'
import Alert from './Alert'

describe('Alert', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(Component)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})