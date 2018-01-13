<?php

namespace App\Business\Cloning;

class ConfigObfuscationCatalog
{
    const MAX_NB_PARAM_PER_DB_COLUMN = 4;
    const NB_PEOPLE = 2; // -1 so less risky for arrays !
    
    public $Adatatypes = array  (
        // STRINGS
        'string'    =>  array(  'char',     'varchar',      'tinytext', 'text','mediumtext', 'longtext',
                                'binary',   'varbinary',    'tinyblob', 'blob','mediumblob', 'longblob',
                                'json'
                                ),
        'enum'      =>  array('enum', 'set'),//   WARNING  remember that SET is like ENUM but it can have 0 to n vales from the ist provided !
        
        // NUMBERS
        'float'         =>  array(
                                // 12.2.1 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT
                                'integer', 'int', 'smallint', 'tinyint', 'mediumint', 'bigint',
                                // 12.2.2 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC
                                'decimal', 'dec', 'numeric',
                                // 12.2.3 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE
                                'float', 'double', 'double precision', 'real',
                                // 12.2.4 Bit-Value Type - BIT
                                'bit'
                                 ),
        'bool'      =>  array('bool','boolean'),
        
        // DATES / TIME
        'date'      =>  array('date', 'year', 'month', 'day'),
        'time'      =>  array('time', 'timestamp'),
        'datetime'  =>  array('datetime'),
    );
    
    public function easy_convert_sql_type_to_pdo_type($Afield_types_for_that_table, $table, $field_name, $debug = '')
    {
        $field_name = str_replace('1 as ', '', $field_name);
        $field_name = trim($field_name);
        
        $field_type_param = $Afield_types_for_that_table[$field_name];

        return $this->convert_sql_type_to_pdo_type($field_type_param, $table, $field_name, $debug = '');
    }
    public function convert_sql_type_to_pdo_type($field_type_param, $table = '', $field_name = '', $debug = '')
    {
        $field_type = $field_type_param;
        $field_type = str_replace(' DBEC_auto_inc', '', $field_type);
        $field_type = trim($field_type);
        
        if (substr($field_type, 0, 7) == 'varchar') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 4) == 'char') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 8) == 'tinytext') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 4) == 'text') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 10) == 'mediumtext') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 8) == 'longtext') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 6) == 'binary') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 9) == 'varbinary') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 4) == 'json') {
            $field_type = 'varchar';
        }

        if (substr($field_type, 0, 4) == 'enum') {
            $field_type = 'varchar';
        }
        if (substr($field_type, 0, 3) == 'set') {
            $field_type = 'varchar';
        }

        if (substr($field_type, 0, 3) == 'bit') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 3) == 'int') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 4) == 'year') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 6) == 'bigint') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 7) == 'tinyint') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 7) == 'integer') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 8) == 'smallint') {
            $field_type = 'integer';
        }
        if (substr($field_type, 0, 9) == 'mediumint') {
            $field_type = 'integer';
        }
        
        if (substr($field_type, 0, 3) == 'dec') {
            $field_type = 'float';
        }
        if (substr($field_type, 0, 4) == 'real') {
            $field_type = 'float';
        }
        if (substr($field_type, 0, 5) == 'float') {
            $field_type = 'float';
        }
        if (substr($field_type, 0, 6) == 'double') {
            $field_type = 'float';
        }
        if (substr($field_type, 0, 16) == 'double precision') {
            $field_type = 'float';
        }
        if (substr($field_type, 0, 7) == 'decimal') {
            $field_type = 'float';
        }
        
        switch ($field_type) {
            case 'float':
            case 'date':
            case 'datetime':
            case 'time':
            case 'timestamp':
            case 'varchar':
                $pdo_type = PDO::PARAM_STR;         // 2
                break;
            case 'bool':
            case 'boolean':
            case 'year':
            case 'month':
            case 'day':
            case 'integer':
                $pdo_type = PDO::PARAM_INT;         // 1
                break;
                                
            case 'tinyblob':
            case 'blob':
            case 'mediumblob':
            case 'longblob':
            case 'blob':
                $pdo_type = PDO::PARAM_LOB;
                break;
                                
            default:
                Error_Class::dbecDie(__FILE__, __LINE__, 'sql type not matched for field type = "' . $field_type_param . '" of length = ' . strlen($field_type_param) .'.'.
                            '<br>From $table='.$table.',$field_name='.$field_name.',<br> $debug='.$debug);
        }
        return $pdo_type;
    }

    public $AoptionsByDatatypes;    // ALL THE SETTINGS OF OBFUSCATION INPUTS and SELECT and related php fct

    // NB : Each param (param1, param2, etc,...) must have a name which is added in the property "needed" of the same array
    private $level_1_mandatory_fields                       = array('label', 'method', 'category', 'php_code', 'need_src');
    private $level_2_param_select_options_mandatory_fields  = array('label', 'method');
    private $param_mandatory_fields                         = array('label', 'name', 'html_type');

    private $realistic_data_fields = array(     array(  'First name',   'Gender'),
                                            array(  'Last name'),
                                            array(  'Street'),
                                            array(  'Zipcode', 'City', 'State code', 'State'),
                                    );
    private $realistic_data_fields_related_values = array();

    // NB : fill param "needed" with the concatenation glued by "," of all the paramX.name contained in that array
    public function __construct()
    {
        $this->AoptionsByDatatypes = array();
        /*Maybe useless, anyhow if really know, try to preselect it based on ??? names among few languages guesses, mostly english..fr, es....
        array(
            'label'        =>    'Known type', 
            'method'    =>    'just_echo_sub_node',
        ),*/
        
        /********************************************************************* STRINGS *****************************************/
        $this->AoptionsByDatatypes['string'] = array();
        /********************************************************************* STRINGS *****************************************/
        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Replace by 8 X',
            'method'    =>  'replace_by_8_x',
            'php_code'  =>  function () {
                return 'XXXXXXXX';
            },
            'need_src'  =>  false,
        );
        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Replace by a fixed string',
            'method'    =>  'replace_by_fixed_string',
            'php_code'  =>  function ($value, $param1) {
                return $param1;
            },
            'needed'    =>  'fixed_str',
            'param1'    =>  array(  'name'      =>  'fixed_str',        'html_type'     =>  'input',    'label'         =>  'Fixed string'),
            'need_src'  =>  false,
        );
        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Replace each char by X',
            'method'    =>  'replace_each_char_by_x',
            'php_code'  =>  function ($value) {
                return str_repeat('X', strlen($value));
            },
            'need_src'  =>  true,
        );
        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Replace each character by ...',
            'method'    =>  'replace_each_char_by_custom',
            'php_code'  =>  function ($value, $param1) {
                return str_repeat($param1, strlen($value));
            },
            'needed'    =>  'char_cst',
            'param1'    =>  array(  'name'      =>  'char_cst',         'html_type'     =>  'input',    'label'         =>  'One character'),
            'need_src'  =>  true,
        );

        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Replace by a random string',
            'method'    =>  'replace_by_random_string',
            'php_code'  =>  function ($value, $param1, $param2) {
                $len = $param1 === 'rand_str_original_length' ? strlen($value) : (int) $param2;
                for ($out = '', $i = 0; $i < $len;
                $i++) {
                    $out .= 'Love'; //str_repeat(9, charFromCode(rand(strcode('A'),strcode('Z'))));
                }return $out;
            },
            'need_src'  =>  true,
            'needed'    =>  'random_str_options',
            'param1'    =>
                array(  'name'      =>  'random_str_options',   'html_type'     =>  'select','label'        =>  'Random STR OPTIONS ?!',
                        'options'   =>  array(
                                            array(  'label'     => 'Keep original length',  'method'=> 'rand_str_original_length'),
                                            array(  'label'     => 'Use a fixed length',    'method'=> 'rand_str_fixed_length',
                                                    'needed'=> 'fixed_length_value',
                                                    'param1'=>  array(
                                                                    'name'      =>  'fixed_length_value',
                                                                    'html_type'     =>  'input',
                                                                    'label'         =>  'Number of characters',
                                                                ),
                                                
                                            )
                                        )
                    ),
        );

        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Generate email',
            'method'    =>  'gnr_email',
            // when you dump, you see THIS, the whole class instead of 1 fct:
            'php_code'  =>  function ($value, $param1, $param2, $param3) {
                                $Adomains = array('gmail.com','yahoo.com','hotmail.com','aol.net','orange.fr');
                                return $param1 . '@' . ($param2 === 'custom_domain' ? $param3 : $Adomains[rand(0, count($Adomains))]);
            }, //str_repeat(9, charFromCode(rand(strcode('A'),strcode('Z'))));
            'need_src'  =>  false,
            'needed'    =>  'char_cst_email,domain_random_custom',
            'param1'    =>
                array(  'name'      =>  'char_cst_email',       'html_type'     =>  'input', 'label'        =>  'Char.'),
            'param2'    =>
                array(  'name'      =>  'domain_random_custom',     'html_type'     =>  'select','label'        =>  'Gmail/yahoo/hotmail etc',
                        'pre_label'     =>  ' @ ',      /// WICKED !! msg in between fields
                        'options'   =>  array(
                                            array(  'label'     => 'Random (gmail, etc)',   'method'=> 'random_domain'),
                                            array(  'label'     => 'Custom domain',             'method'=> 'custom_domain',
                                                    'needed'=> 'custom_domain_value',
                                                    'param1'=>  array(
                                                                    'name'      =>  'custom_domain_value',
                                                                    'html_type'     =>  'input',
                                                                    'label'         =>  'yourowndomain.com',
                                                                ),
                                                
                                            )
                                        )
                    ),
        );
        $this->AoptionsByDatatypes['string'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'File Transfer',
            'method'    =>  'file_transfer_from_db',
            'php_code'  =>  function ($value, $param1, $param2) {
                //if (1) {
                if (empty($value)) {
                    return 'No source file name provided.';
                }
                // Param2 is target folder
                if (!file_exists($param2)) {
                    return 'The local target folder `' . $param2 . '` does not exists.';
                }
                
                // BIG PROBLEM HERE : THE TARGET IS ALLMOST NEVER GONNA BE LOCAL !!! SO ONLY THAT FEAT ONLY IS LOCAL
                // OR IF SSH PASSWORD OR KEY, OTHERWISE, YOU COULD NOT TRANSFER FILE TO A DIFFERENT SERVER if DB is http accessed
                // so checkout IDE or even file_put_contents using stream !
                
                // or try this:http://phpseclib.sourceforge.net/sftp/examples.html#put  but 
                
                // another pb: How do I know from here which type of target it is ???
                // WELL, you could assume, it is NEVER local, so then all you need is a global SFTP connexion you can access here..
                // STILL, A SEPARATE TYPE OF ACTIONS IS NEEDED, so you can also COUNT/report  IT SEPARATELY !!!
                
                if (strpos($param2, 'img_siz') === false) {
                    $source = $param1  . $value; // URL
                    $target = $param2  . $value; // Abs path cos local (cheating a bit...)
                    // skip if file exists in target folder
                    if (!file_exists($target)) {
                        // @todo : curl check 200 that the target file doe exist
                        
                        // Pass arg1: source_URL, arg2: target_file_name
                        $result = $this->download_image1($source, $target);  
                        if (strpos($result,'OK') === false) {

                            return ' Error_here:' . $result;
                        }
                    }

                    return $value;
                }
                
                $folder_names = ['0img_siz', '1img_siz', '5img_siz'];
                foreach ($folder_names as $folder_name) {
                    $source = str_replace('1img_siz', $folder_name, $param1)  . $value; // URL
                    $target = str_replace('1img_siz', $folder_name, $param2)  . $value; // Abs path cos local (cheating a bit...)
                    
                    // skip if file exists in target folder
                    if (!file_exists($target)) {
                        // @todo : curl check 200 that the target file doe exist
                        
                        // Pass arg1: source_URL, arg2: target_file_name
                        $result = $this->download_image1($source, $target);  
                        if (strpos($result,'OK') === false) {
                            //return ' Error_here:' . $result;
                        }
                    }
                }

                return $value;
            },
            'needed'    =>  'file_prefix_url_source, file_prefix_url_target',
            'param1'    =>  array(  'name'      =>  'file_prefix_url_source',    'html_type'     =>  'input',    'label'         =>  'Prefix URL source'),
            'param2'    =>  array(  'name'      =>  'file_prefix_url_target',    'html_type'     =>  'input',    'label'         =>  'Target path', 'pre_label'     =>  ' and '),
            'need_src'  =>  true,
        );
        for ($i = 0; $i < count($this->realistic_data_fields); $i++) {
            $related_fields = $this->realistic_data_fields[$i];
            for ($j = 0; $j < count($related_fields); $j++) {
                $label = $related_fields[$j];
                $method = str_replace(' ', '_', strtolower($label));
                switch ($label) {
                    case 'First name':
                        $guesses = array('first_name', 'firstName', 'prenom', 'nombre');
                        break;
                    case 'Last name':
                        $guesses = array('last_name', 'lastName', 'nom', 'apellido');
                        break;
                    case 'Street':
                        $guesses = array('street', 'address', 'adresse');
                        break;
                    case 'Zipcode':
                        $guesses = array('zip','post');
                        break;
                    case 'Gender':
                        $guesses = array('gender','sex','title','titre');
                        break;
                    case 'City':
                        $guesses = array('city','town','ville','ciudad');
                        break;
                    case 'State code':
                        $guesses = array('state_code','numero_departement');
                        break;
                    case 'State':
                        $guesses = array('state','county','departement','region');
                        break;
                    default:
                        Error_Class::dbecDie(__FILE__, __LINE__, 'Unknown realistic data field : ' . $label);
                }
                $this->AoptionsByDatatypes['string'][] = array(
                    'category'  =>  'ANONYMISATION',        'label'         =>  $label,             'method'    =>  $method,
                    'guesses'   =>  $guesses,
                    'php_code'  =>  function () use ($method, $related_fields) {
                        return $this->getAnonymData($method, $related_fields);
                    },
                    'need_src'  =>  false,
                );
            }
        }
        
        /********************************************************************* FLOATS *****************************************/
        $this->AoptionsByDatatypes['float'] = array();
        /********************************************************************* FLOATS *****************************************/
        $this->AoptionsByDatatypes['float'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random value between...',
            'method'    =>  'random_between',
            'php_code'  =>  function ($value, $param1, $param2) {
                return rand($param1, $param2);
            },
            'need_src'  =>  false,
            'needed'    =>  'value_min,value_max',// either this or name them just param1, param2....
            'param1'    =>  array(  'name'      =>  'value_min',    'html_type'     =>  'input',    'label'         =>  'Min.'),
            'param2'    =>  array(  'name'      =>  'value_max',    'html_type'     =>  'input',    'label'         =>  'Max.', 'pre_label'     =>  ' and '),
        );
        $this->AoptionsByDatatypes['float'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Choose constant value',
            'method'    =>  'constant_value',
            'php_code'  =>  function ($value, $param1) {
                return $param1;
            },
            'need_src'  =>  false,
            'needed'    =>  'value_cst',
            'param1'    =>  array(  'name'      =>  'value_cst',    'html_type'     =>  'input',    'label'         =>  'Value'),
        );
        
        
        /********************************************************************* BOOL *****************************************/
        $this->AoptionsByDatatypes['bool'] = array();
        /********************************************************************* BOOL *****************************************/
        $this->AoptionsByDatatypes['bool'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Constant value',
            'method'    =>  'cst_bool_value',
            'php_code'  =>  function ($value, $param1) {
                return $param1 === 'set_to_true' ? true : false;
            },
            'needed'    =>  'true_or_false',
            'need_src'  =>  false,
            'param1'    =>  array(  'name'      =>  'true_or_false',    'html_type'     =>  'select',   'label'         =>  'Pick true or false',
                                    'options'   =>  array(  'label'     =>  'Set to TRUE',  'method'    =>  'set_to_true'),
                                                    array(  'label'     =>  'Set to FALSE', 'method'    =>  'set_to_false'),
                            ),
        );
        $this->AoptionsByDatatypes['bool'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random value',
            'method'    =>  'rand_bool_value',
            'php_code'  =>  function ($value) {
                return rand(0, 1) === 0 ? true : false;
            },
            'need_src'  =>  false,
        );


        /********************************************************************* ENUM *****************************************/
        $this->AoptionsByDatatypes['enum'] = array();
        /********************************************************************* ENUM *****************************************/
        $this->AoptionsByDatatypes['enum'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Constant value',
            'method'    =>  'cst_enum_value',
            'php_code'  =>  function ($value, $param1) {
                return $param1;
            },
            'need_src'  =>  false,
            'needed'    =>  'one_enum_value',
            'param1'    =>  array(  'name'      =>  'one_enum_value',   'html_type'     =>  'select',   'label'         =>  'Pick one value',
                                    'options'   =>  array(), // DYNAMIC EMUM OPTIONS....
                            ),
        );
        $this->AoptionsByDatatypes['enum'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random value',
            'method'    =>  'rand_enum_value',
            'php_code'  =>  function ($value, $param1) {
                $options = explode(',', $param1);
                                                        return trim($options[rand(0, count($options)-1)], "'");
            },
            'need_src'  =>  false,
            'needed'    =>  'all_enum_values',
            'param1'    =>  array(  'name'      =>  'all_enum_values',  'html_type'     =>  'hidden'),
        );
        
        
        /********************************************************************* DATE *****************************************/
        $this->AoptionsByDatatypes['date'] = array();
        /********************************************************************* DATE *****************************************/
        $this->AoptionsByDatatypes['date'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Choose constant date',
            'method'    =>  'constant_date',
            'php_code'  =>  function ($value, $param1) {
                return date('Y-m-d', strtotime($param1));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_cst',
            'param1'    =>  array(  'name'      =>  'date_cst',             'html_type'     =>  'input',    'label'         =>  'Date'),
        );
        $this->AoptionsByDatatypes['date'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Current date',
            'method'    =>  'current_date',
            'php_code'  =>  function ($value, $param1) {
                return date('Y-m-d');
            },
            'need_src'  =>  false,
        );
        
        $this->AoptionsByDatatypes['date'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random date between...',
            'method'    =>  'date_random_between',
            'php_code'  =>  function ($value, $param1, $param2) {
                return date('Y-m-d', rand(strtotime($param1), strtotime($param2)));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_min0,date_max0',
            'param1'    =>  array(  'name'      =>  'date_min0',            'html_type'     =>  'input',    'label'         =>  'Min. Date'),
            'param2'    =>  array(  'name'      =>  'date_max0',            'html_type'     =>  'input',    'label'         =>  'Max. Date',    'pre_label'     =>  ' and '),
        );
        
        $this->AoptionsByDatatypes['date'][] =
        array(
            'category'  =>  'ANONYMISATION',
            'label'         =>  'Birth date between...',
            'method'    =>  'birth_date_random_between',
            'guesses'   =>  array('birth', 'naissance', 'nacimiento'),
            'php_code'  =>  function ($value, $param1, $param2) {
                return date('Y-m-d', rand(strtotime($param1), strtotime($param2)));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_min1,date_max1',
            'param1'    =>  array(  'name'      =>  'date_min1',            'html_type'     =>  'input',    'label'         =>  'Min. Date',    'default'   =>  '1920-01-01'),
            'param2'    =>  array(  'name'      =>  'date_max1',            'html_type'     =>  'input',    'label'         =>  'Max. Date',    'default'   =>  '1996-01-01',   'pre_label'     =>  ' and '),
        );
        
        
        /********************************************************************* TIME *****************************************/
        $this->AoptionsByDatatypes['time'] = array();
        /********************************************************************* TIME *****************************************/
        $this->AoptionsByDatatypes['time'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Choose constant time',
            'method'    =>  'constant_time',
            'php_code'  =>  function ($value, $param1) {
                return date('H:i:s', strtotime($param1));
            },
            'need_src'  =>  false,
            'needed'    =>  'time_cst',
            'param1'    =>  array(  'name'      =>  'time_cst',             'html_type'     =>  'input',    'label'         =>  'Time'),
        );
        $this->AoptionsByDatatypes['time'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Current time',
            'method'    =>  'current_time',
            'php_code'  =>  function ($value, $param1) {
                return date('H:i:s');
            },
            'need_src'  =>  false,
        );
        $this->AoptionsByDatatypes['time'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random time between...',
            'method'    =>  'time_random_between',
            'php_code'  =>  function ($value, $param1, $param2) {
                return date('H:i:s', rand(strtotime($param1), strtotime($param2)));
            },
            'need_src'  =>  false,
            'needed'    =>  'time_min,time_max',
            'param1'    =>  array(  'name'      =>  'time_min',             'html_type'     =>  'input',    'label'         =>  'Min. Time'),
            'param2'    =>  array(  'name'      =>  'time_max',             'html_type'     =>  'input',    'label'         =>  'Max. Time',    'pre_label'     =>  ' and '),
        );
        
        
        /********************************************************************* DATE_TIME *****************************************/
        $this->AoptionsByDatatypes['datetime'] = array();
        /********************************************************************* DATE_TIME *****************************************/
        $this->AoptionsByDatatypes['datetime'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Constant date-time',
            'method'    =>  'constant_date_time',
            'php_code'  =>  function ($value, $param1) {
                return date('Y-m-d H:i:s', strtotime($param1));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_time_cst',
            'param1'    =>  array(  'name'      =>  'date_time_cst',    'html_type'     =>  'input',    'label'         =>  'Date Time'         ,'default'  =>  date('Y-m-d H:i:s')),
        );
        $this->AoptionsByDatatypes['datetime'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Current date-time',
            'method'    =>  'current_date_time',
            'php_code'  =>  function ($value, $param1) {
                return date('Y-m-d H:i:s');
            },
            'need_src'  =>  false,
        );
        $this->AoptionsByDatatypes['datetime'][] =
        array(
            'category'  =>  'OBFUSCATION',
            'label'         =>  'Random date-time between...',
            'method'    =>  'date_time_random_between',
            'php_code'  =>  function ($value, $param1, $param2) {
                return date('Y-m-d H:i:s', rand(strtotime($param1), strtotime($param2)));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_time_min0,date_time_max0',
            'param1'    =>  array(  'name'      =>  'date_time_min0',   'html_type'     =>  'input',    'label'         =>  'Min. Date Time'    ,'default'  =>  date('2015-m-d H:i:s')),
            'param2'    =>  array(  'name'      =>  'date_time_max0',   'html_type'     =>  'input',    'label'         =>  'Max. Date Time'    ,'default'  =>  date('Y-m-d H:i:s'),     'pre_label'     =>  ' and '),
        );
        $this->AoptionsByDatatypes['datetime'][] =
        array(
            'category'  =>  'ANONYMISATION',
            'label'         =>  'Birth date between..',
            'method'    =>  'birth_datetime_random_between',
            'guesses'   =>  array('birth', 'naissance', 'nacimiento'),
            'php_code'  =>  function ($value, $param1, $param2) {
                return date('Y-m-d', rand(strtotime($param1), strtotime($param2)));
            },
            'need_src'  =>  false,
            'needed'    =>  'date_time_min1,date_time_max1',
            'param1'    =>  array(  'name'      =>  'date_time_min1',   'html_type'     =>  'input',    'label'         =>  'Min. Date Time',   'default'   =>  '1910-01-01 00:00:00'),
            'param2'    =>  array(  'name'      =>  'date_time_max1',   'html_type'     =>  'input',    'label'         =>  'Max. Date Time',   'default'   =>  '1996-01-01 00:00:00',  'pre_label'     =>  ' and '),
        );
        
        $this->checkObfuscationAoptionsByDatatypes();
    }
    
    /********************************************************* END OF PARAMETERS ****************************************************/
    
    private function getAnonymData($column_wanted, $related_columns)
    {
        // Check if value requested already in memory, like a related city if postcode has just been requested before. (or the opposite)
        foreach ($related_columns as $index => $column_label) {
            $column_name = str_replace(' ', '_', strtolower($column_label));
            $related_columns[$index] = $column_name;
            if ($column_wanted === $column_name && isset($this->realistic_data_fields_related_values[$column_name])) {
                $back = $this->realistic_data_fields_related_values[$column_name];
                unset($this->realistic_data_fields_related_values[$column_name]);
                return $back;
            }
        }
        global $Oide;
        $data_id = rand(0, self::NB_PEOPLE - 1);
        $related_columns = implode(', ', $related_columns);
        $sql = 'SELECT ' . $related_columns . ' FROM dbec_anonym_data LIMIT 1 OFFSET '.$data_id;
        $results = $Oide->sqlQueryPdoBiding($sql, 'select', 'fake_query_name_get_first_name', array());
    //      public fction sqlQueryPdoBiding($sql, $sqlGroup, $idQuery, $parameters, $endOfQuery = ''){

        $one_result = $results->fetch();
        foreach ($one_result as $key => $value) {
            if ($key != $column_wanted) { // We do not store the requested column value because it is being used immediately.
                $this->realistic_data_fields_related_values[$key] = $value;
            }
        }
        return $one_result[$column_wanted];
    }

    public function is_src_value_needed_for_method($the_method)
    {
        $AeasyTypes = array_keys($this->Adatatypes);
        foreach ($AeasyTypes as $easyType) {
            $Amethods = $this->AoptionsByDatatypes[$easyType];
            foreach ($Amethods as $i => $one_method) {
                if ($one_method['method'] === $the_method) {
                    return $this->AoptionsByDatatypes[$easyType][$i]['need_src'];
                    break;
                }
            }
        }
        if (is_null($f)) {
            Error_Class::dbecDie(__FILE__, __LINE__, 'Error Obfusctaion method not found in is_src_value_needed_for_method: ' . $the_method);
        }
    }
    public function get_obfuscted_value($value, $the_method, $param1, $param2, $param3, $param4)
    {
        $f = null;
        $AeasyTypes = array_keys($this->Adatatypes);
        foreach ($AeasyTypes as $easyType) {
            $Amethods = $this->AoptionsByDatatypes[$easyType];
            foreach ($Amethods as $i => $one_method) {
                if ($one_method['method'] === $the_method) {
                    $f = $this->AoptionsByDatatypes[$easyType][$i]['php_code'];
                    break;
                }
            }
        }
        if (is_null($f)) {
            Error_Class::dbecDie(__FILE__, __LINE__, 'Error Obfusctaion method not found in get_obfuscted_value: ' . $the_method);
        }
        $v = $f($value, $param1, $param2, $param3, $param4);
        //die($v . ' from ' . $value . ' : ' . $the_method . ' : ' . $param1 . ' : ' . $param2 . ' : ' . $param3);
        return $v;
    }

    public function checkObfuscationAoptionsByDatatypes()
    {
        $Aerrors = array();
        foreach ($this->AoptionsByDatatypes as $dataType => $array_of_methods) {
            foreach ($array_of_methods as $method_index => $method_properties) {
                $Aerrors = array_merge($Aerrors, $this->checkObfuscationAoptionsForOneMethod($dataType, $method_properties));
            }
        }
        if (count($Aerrors) !== 0) {
            Error_Class::dbecDie(__FILE__, __LINE__, 'Errors prog in obfuscation settings file : <br>'.implode('<br>', $Aerrors));
        } else {
            //Error_Class::dbecDie(__FILE__, __LINE__,'PERFECT NO Error prog in obfuscation settings file.');
        }
    }
    
    /************************************************************** END OF PUBLICs ************************************************/
    
    
    

    
    private $Afields_needed_for_that_type = array();// ALL UNIQUE
    // THIS SHOULD REALLY BE RECURSIVE !!! to find sub-params like in gnr_email.
    private function checkObfuscationAoptionsForOneMethod($dataType, $method_properties)
    {
        ///$Afields_needed_for_that_type = array();// ALL UNIQUE
        $Aerrors = array();
    /*private $level_1_mandatory_fields                         = array('label', 'method', 'category', 'php_code', 'need_src');
    private $level_2_param_select_options_mandatory_fields     = array('label', 'method');
    private $param_mandatory_fields                         = array('label', 'name', 'html_type');
    */
        foreach ($this->level_1_mandatory_fields as $param_name) {
            if (!isset($method_properties[$param_name])) {
                $Aerrors[] = 'For the type ' . $dataType . ', Missing property "' . $param_name . '" for the method called ' . print_r($method_properties, true);
                return $Aerrors;
            }
        }
        
        $Afields_needed_for_that_method = array();// MUST LIST ALL FIELDS defined in paramX
        for ($i = 1; $i < self::MAX_NB_PARAM_PER_DB_COLUMN; $i++) {
            if (isset($method_properties['param' . $i])) {
                if (!isset($method_properties['param' . $i]['name'])) {
                    $Aerrors[] = 'For the type ' . $dataType . ', Missing property "name" for the "param' . $i . '" of the method labelled ' . $method_properties['label'];
                    continue;
                }
                if (!isset($method_properties['needed'])) {
                    $Aerrors[] = 'For the type ' . $dataType . ', Missing property "needed" for the method labelled ' . $method_properties['label'] . ' to list its parmamX.name separated per commas';
                    continue;
                }
                if (strpos($method_properties['needed'], ' ') !== false) {
                    $method_properties['needed'] = str_replace(' ', '', $method_properties['needed']);
                    continue;
                }
                $Afields_needed_for_that_method = explode(',', $method_properties['needed']);
                $param_name = $method_properties['param' . $i]['name'];
                // Checked param names ARE INDEED in the needed property
                if (!in_array($param_name, $Afields_needed_for_that_method)) {
                    $Aerrors[] = 'For the type ' . $dataType . ', Missing param'.$i.'[name] : "'.$param_name.'" in the property "needed", listing all parmamX.name separated per commas, of the method labelled ' . $method_properties['label'] . '.';
                    continue;
                }
                if (in_array($param_name, $this->Afields_needed_for_that_type)) {
                    $Aerrors[] = 'For the type ' . $dataType . ', DUPLICATE param'.$i.'[name] : "'.$param_name.'" for the method labelled ' . $method_properties['label'] . '. (ALL PARAMS NAMES MUST BE UNIQUE)';
                    continue;
                }
                $this->Afields_needed_for_that_type[] = $param_name;
            }
        }
        return $Aerrors;
    }
    public function getEasyDataType($sql_type, $column_name ='', $debug = '')
    {
        $easy_type_found = '';
        foreach ($this->Adatatypes as $easy_type => $Asql_types) {
            if (in_array($sql_type, $Asql_types)) {
                $easy_type_found = $easy_type;
            }
        }
        if ($easy_type_found === '') {
            if (in_array(strtolower($column_name), array('key'))) {
                return 'INVALID_COLUMN_NAME';
            }
            //Error_Class::sendErrorToGlobalLo
            die('in config_bfuscation line 503 Error cos mysql type not defined in easyTypes ::::::' . $sql_type . ':::: in ' .$debug);
        }
        return $easy_type_found;
    }
    // small image
    private function download_image1($image_url, $image_file){
        $target_folder = dirname($image_file);
        $cmd = 'cd ' . $target_folder . ' && wget ' . $image_url .  ' 2>&1';
        $result = shell_exec($cmd);

        return $result;
        /*  WGET easy to use but if not good enough : https://curl.haxx.se/docs/comparison-table.html
        Wget enables more features by default: cookies, redirect-following, time stamping from the remote resource etc. With curl most of those features need to be explicitly enabled.
        There are many tools that can download like curl ,snarf , wget, pavuk, fget, fetch, lftp ,aria2 , HTTrack etc
        */
    }
    // BIG image
    /*private function download_image2($image_url){
        $ch = curl_init($image_url);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // enable if you want
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);      // some large value to allow curl to run for a long time
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        curl_setopt($ch, CURLOPT_WRITEFUNCTION, "curl_callback");
        // curl_setopt($ch, CURLOPT_VERBOSE, true);   // Enable this line to see debug prints
        curl_exec($ch);    
        curl_close($ch);                              // closing curl handle
    }*/
}
    
/* callback function for curl
function curl_callback($ch, $bytes){
    global $fp;
    $len = fwrite($fp, $bytes);
    // if you want, you can use any progress printing here
    return $len;
}*/
