import { mount } from 'vue-test-utils' // see https://vue-test-utils.vuejs.org
import Alert from './Alert'

describe('AlertComponent', () => {

    const wrapper = mount(Alert);

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    })

    test('should have default data', function () {
        let wrapper = mount(Alert);
        expect(wrapper.vm).toMatchObject({
            "show": true
        });
    });

    test('should have default html', function () {
        let wrapper = mount(Alert);
        expect(wrapper.html()).toBe('<div class="Alert"><p></p></div>');
    });

    test('should have 2 default props empty', function () {
        let wrapper = mount(Alert);
        expect(wrapper.props()).toMatchObject({
            "msg": undefined,
            "type": undefined
        });
    });
//.toHaveBeenCalledWith(arg1, arg2, ...)
    /*test('throws on octopus', () => {
  expect(() => {
    drinkFlavor('octopus');
  }).toThrow(); or better .toThrowError('Yueck')
});*/
});

// now look at https://github.com/vuejs/vue-test-utils-jest-example/blob/master/test/List.spec.js

//and watch https://www.youtube.com/watch?v=pqp0PsPBO_0
// looking at : https://github.com/codebryo/vue-testing-with-jest-conf17

//and this later:https://alexjoverm.github.io/2017/08/21/Write-the-first-Vue-js-Component-Unit-Test-in-Jest/