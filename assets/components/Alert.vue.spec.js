import { mount } from 'vue-test-utils'
import Alert from './Alert'

describe('AlertComponent', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(Alert)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})