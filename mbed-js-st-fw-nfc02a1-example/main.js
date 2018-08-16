var js_manager = require('./js_manager');
var serial_interface = new SerialInterface();

var button = InterruptIn(BUTTON1);

var security_key = 'F38sZ2a9';

write_nfc_tag = function(){
    var i2c = DevI2C(D14, D15);
    var nfc = NFC02A1();
    nfc.init(i2c);
    nfc.write_tag("F38sZ2a9,F4Jq6yc2D6yxKqW");
}

process_nfc = function(){
    var i2c = DevI2C(D14, D15);
    var nfc = NFC02A1();
    nfc.init(i2c);
    tag_data = nfc.read_tag();
    tag_array = tag_data.split(",");
    if(security_key.localeCompare(tag_array[0]) == 0){
        print("\33[32mSecurity key matched!\33[0m");
        print('\33[32mDownloading file: ' + tag_array[1] + '\33[0m');
        load_nfc_program(tag_array[1]);
    }
    else{
        print("\33[31mSecurity key mismatched!\33[0m");
    }    
}

button.fall(function() {
    process_nfc();
    //gg();
});

print('Running in 5 seconds...')
setTimeout(function(){
    print('')
    run_program_from_flash();
    button.fall(function() {
        process_nfc();
        //gg();
    });
}, 5000);

print("Press button for demo.\r");

