import { mount, shallow } from '@vue/test-utils' // see https://vue-test-utils.vuejs.org
import ListOfConnections from './../components/ListOfConnections'
import { createRenderer } from 'vue-server-renderer'

jest.mock('./../ApiService');
import ApiService from './../ApiService';

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    //ApiServiceMock.mockReset();
});

describe('ListOfConnectionsComponent', () => {

    test('is a Vue instance', () => {
        const wrapper = mount(ListOfConnections);
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    test('should fails on purpose', function () {
        ApiService.forceFailsGetUserDatabaseConnections = true;
        const wrapper = shallow(ListOfConnections);
        // Match Object
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connections: [],
            error: 'Error on purpose getting UserDatabaseConnections.'
        });
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        });
        ApiService.forceFailsGetUserDatabaseConnections = false;
    });

    test('should fetch SUCCESS without any props', function () {
        const wrapper = shallow(ListOfConnections);
        // Match Object
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connections: [
                {
                    db_connection_disabled: false,
                    db_connection_name: 'nice_test_db_connection_name',
                    db_id: 123
                },
                {
                    db_connection_disabled: true,
                    db_connection_name: 'nice_too_test_db_connection_name',
                    db_id: 456
                }
            ],
            error: null
        });
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        });
    });

    test('should delete success', function () {
        const wrapper = shallow(ListOfConnections);
        const deleteButton = wrapper.find('.deleteConnectionClass');
        deleteButton.trigger('click');

        expect(wrapper.vm._data).toEqual({
            loading: false,
            connections: [
                {
                    db_connection_disabled: false,
                    db_connection_name: 'nice_test_db_connection_name',
                    db_id: 123
                },
                {
                    db_connection_disabled: true,
                    db_connection_name: 'nice_too_test_db_connection_name',
                    db_id: 456
                }
            ],
            error: null
        });

        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should delete fails', function () {
        const wrapper = shallow(ListOfConnections);
        wrapper.vm.deleteConnection(-1);
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connections: [
                {
                    db_connection_disabled: false,
                    db_connection_name: 'nice_test_db_connection_name',
                    db_id: 123
                },
                {
                    db_connection_disabled: true,
                    db_connection_name: 'nice_too_test_db_connection_name',
                    db_id: 456
                }
            ],
            error: 'Error on purpose deleting connection data'
        });
    });
});