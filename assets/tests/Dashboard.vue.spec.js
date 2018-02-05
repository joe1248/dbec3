import { mount, shallow } from '@vue/test-utils' // see https://vue-test-utils.vuejs.org
import Dashboard from './../components/Dashboard'
import {createRenderer} from "vue-server-renderer";

describe('DashboardComponent', () => {
    const wrapper = mount(Dashboard);

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    test('should have no default data', function () {
        expect(wrapper.vm._data).toEqual({});
    });

    test('should have default html', function () {
        const wrapper = shallow(Dashboard);
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should have no default props', function () {
        expect(wrapper.props()).toEqual({});
    });
});