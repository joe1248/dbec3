import { mount } from '@vue/test-utils' // see https://vue-test-utils.vuejs.org
import Loader from './../components/Loader'

describe('LoaderComponent', () => {
    const wrapper = mount(Loader);

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    test('should have no default data', function () {
        expect(wrapper.vm._data).toEqual({});
    });

    test('should have default html', function () {
        expect(wrapper.html()).toBe(
            "<div class=\"preloader-wrapper big active\"><div class=\"spinner-layer spinner-blue-only\"><div class=\"circle-clipper left\"><div class=\"circle\"></div></div><div class=\"gap-patch\"><div class=\"circle\"></div></div><div class=\"circle-clipper right\"><div class=\"circle\"></div></div></div></div>"
        );
    });

    test('should have no default props', function () {
        expect(wrapper.props()).toEqual({});
    });
});