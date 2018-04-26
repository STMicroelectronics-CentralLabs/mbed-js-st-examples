var js_manager = require('./js_manager');
var serial_interface = new SerialInterface();

var button = InterruptIn(BUTTON1);

/*
setTimeout(function(){
    load_http_program('h')
    print('')
   reboot();
    run_program_from_flash();
}, 300000);
*/

button.fall(function() {
    gg();
});

print('Running in 5 seconds...')
setTimeout(function(){
    print('')
    run_program_from_flash();
    button.fall(function() {
        gg();
    });
}, 5000);

print("Press button for demo.\r");

