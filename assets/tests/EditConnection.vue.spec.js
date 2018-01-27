import { mount, shallow } from 'vue-test-utils' // see https://vue-test-utils.vuejs.org
import EditConnection from './../components/EditConnection'
import { createRenderer } from 'vue-server-renderer'

jest.mock('./../ApiService');

describe('EditConnectionComponent', () => {

    test('is a Vue instance', () => {
        const wrapper = mount(EditConnection);
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    test('should have default data', function () {
        const wrapper = mount(EditConnection);
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connection: {
                db_connection_disabled: false,
                db_connection_name: '',
                db_id: null,
                db_pass_word: '',
                db_port_number: '',
                db_selected_ftp_id: null,
                db_url_host: '',
                db_user_name: '',
                ftp_connection_name: '',
                ftp_pass_word: '',
                ftp_port_number: '',
                ftp_url_host: '',
                ftp_user_name: '',
                select_db_protocol: ''
            },
            error: null,
            successMessage: ''
        })
    });

    test('should have default html', function () {
        const numberOfButtons = 6; // 4 on top + 2 to view passwords in clear.
        const numberOfPasswords = 2;
        const numberOfInputs = 8;


        const wrapper = shallow(EditConnection, {
            propsData: {}
        });
        expect(wrapper.findAll('input[type="button"]')).toHaveLength(numberOfButtons);
        expect(wrapper.findAll('input[type="password"]')).toHaveLength(numberOfPasswords);
        expect(wrapper.findAll('input[type="text"]')).toHaveLength(numberOfInputs);

        //expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
        //expect(mockGetConnection).not.toBeCalled();// toHaveBeenCalledTimes(1);
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should fetch SUCCESS', function () {
        const wrapper = shallow(EditConnection, { propsData: { id: 555 } });
        // Match Object
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connection: {
                db_connection_disabled: false,
                db_connection_name: 'bingo_test_db_connection_name',
                db_id: 555,
                db_pass_word: 'db_password_111',
                db_port_number: '3333',
                db_selected_ftp_id: 777,
                db_url_host: 'db_host',
                db_user_name: 'db_user',
                ftp_connection_name: 'ssh_name',
                ftp_pass_word: 'ssh_pass',
                ftp_port_number: '22',
                ftp_url_host: 'ssh_host',
                ftp_user_name: 'ssh_user',
                select_db_protocol: 'over_ssh'
            },
            error: null,
            successMessage: ''
        });
        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should fetch FAILS', function () {
        const wrapper = shallow(EditConnection, { propsData: { id: -1 } });
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connection: null,
            error: "Error on purpose loading connection data",
            successMessage: ''
        });

        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should save SUCCESS updating', function () {
        const wrapper = shallow(EditConnection, { propsData: { id: 555 } });
        const saveButton = wrapper.find('#button_to_save_one_connection');
        saveButton.trigger('click');
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connection: {
                db_connection_disabled: false,
                db_connection_name: 'bingo_test_db_connection_name',
                db_id: 555,
                db_pass_word: 'db_password_111',
                db_port_number: '3333',
                db_selected_ftp_id: 777,
                db_url_host: 'db_host',
                db_user_name: 'db_user',
                ftp_connection_name: 'ssh_name',
                ftp_pass_word: 'ssh_pass',
                ftp_port_number: '22',
                ftp_url_host: 'ssh_host',
                ftp_user_name: 'ssh_user',
                select_db_protocol: 'over_ssh'
            },
            error: '',
            successMessage: 'All saved!'
        });

        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should save SUCCESS creating', function () {
        const wrapper = shallow(EditConnection, { propsData: { id: null } });
        const saveButton = wrapper.find('#button_to_save_one_connection');
        saveButton.trigger('click');
        expect(wrapper.vm._data).toEqual({
            loading: false,
            connection: {
                db_connection_disabled: false,
                db_connection_name: '',
                db_id: null,
                db_pass_word: '',
                db_port_number: '',
                db_selected_ftp_id: null,
                db_url_host: '',
                db_user_name: '',
                ftp_connection_name: '',
                ftp_pass_word: '',
                ftp_port_number: '',
                ftp_url_host: '',
                ftp_user_name: '',
                select_db_protocol: ''
            },
            error: '',
            successMessage: 'Connection created'
        });

        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });

    test('should save FAILS', function () {
        const wrapper = shallow(EditConnection, { propsData: { id: 555 } });
        const saveButton = wrapper.find('#button_to_save_one_connection');
        wrapper.vm._data.connection.db_id = -1;
        saveButton.trigger('click');
        expect(wrapper.vm._data).toMatchObject({
            loading: false,
            connection: {
                db_id: -1,
                db_connection_name: 'bingo_test_db_connection_name'
            },
            error: 'Error on purpose saving connection data',
            successMessage: ''
        });

        const renderer = createRenderer();
        renderer.renderToString(wrapper.vm, (err, str) => {
            if (err) throw new Error(err.toString());
            expect(str).toMatchSnapshot()
        })
    });
});