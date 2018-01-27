import { mount, shallow } from 'vue-test-utils' // see https://vue-test-utils.vuejs.org
import EditConnection from './../components/EditConnection'

jest.mock('./../ApiService');

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    //ApiServiceMock.service.mockClear();
});

describe('EditConnectionComponent', () => {

    const wrapper = mount(EditConnection);

    test('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    test('should have default data', function () {
        let wrapper = mount(EditConnection);
        expect(wrapper.vm).toMatchObject({
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
        })
        expect(wrapper.findAll('input[type="button"]')).toHaveLength(numberOfButtons);
        expect(wrapper.findAll('input[type="password"]')).toHaveLength(numberOfPasswords);
        expect(wrapper.findAll('input[type="text"]')).toHaveLength(numberOfInputs);

        //expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
        //expect(mockGetConnection).not.toBeCalled();// toHaveBeenCalledTimes(1);
    });

    test('should fetch data', function () {
        //const wrapper = shallow(EditConnection, { propsData: { id: 555 } });
        const wrapper = mount(EditConnection, { propsData: { id: 555 } });
        expect(wrapper.vm._data).toMatchObject({
            loading: true,
            connection: null,
            error: null,
            successMessage: ''
        });
        //console.log("\n\n\n\n\n\n\n----------------------------ApiService----------------------------\n\n\n");
        //console.log(ApiService);

        //expect(mockGetConnection).toHaveBeenCalledTimes(1);
   //     expect(mockGetConnection).toHaveBeenCalledWith(55);
    });

    /*    test('should have 2 default props empty', function () {
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