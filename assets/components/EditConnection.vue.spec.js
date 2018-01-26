import { mount } from 'vue-test-utils' // see https://vue-test-utils.vuejs.org
import EditConnection from './EditConnection'

describe('EditConnectionComponent', () => {

    const wrapper = mount(EditConnection);

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

/*    test('should have default data', function () {
        let wrapper = mount(EditConnection);
        expect(wrapper.vm).toMatchObject({
            "show": true
        });
    });

    test('should have default html', function () {
        let wrapper = mount(EditConnection);
        expect(wrapper.html()).toBe('<div class="EditConnection"><p></p></div>');
    });

    test('should have 2 default props empty', function () {
        let wrapper = mount(EditConnection);
        expect(wrapper.props()).toMatchObject({
            "msg": undefined,
            "type": undefined
        });
    });

    test('render success properly', function () {
        const wrapper = shallow(EditConnection, {
            propsData: {
                "msg": 'Well done',
                "type": 'success'
            }
        });
        expect(wrapper.html()).toBe('<div class="EditConnection EditConnection-Success"><p>Well done</p></div>');
    });

    test('render error properly', function () {
        const wrapper = shallow(EditConnection, {
            propsData: {
                "msg": 'Unexpected problem',
                "type": 'error'
            }
        });
        expect(wrapper.html()).toBe('<div class="EditConnection EditConnection-Error"><p>Unexpected problem</p></div>');
    });
    */
});