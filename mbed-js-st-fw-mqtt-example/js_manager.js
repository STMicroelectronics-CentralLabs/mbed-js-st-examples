var js_manager = new JSManager();

//print("\r\njs_manager.js has finished executing.");

run_program_from_flash = function(){
    print('\33[36mRunning js from flash...\33[0m'); // color back to normal
    var result = js_manager.run_js_flash();
    
    if(result == 0){
        print("\33[32mProgram execution successful!\33[0m");
    }
    else if(result == 1){
        print("\33[35mFlash is empty!\33[0m");
    }
    else if(result == 2){
        print("\33[31mProgram execution failed! Error parsing code.\33[0m");
    }
    else if(result == 3){
        print("\33[31mProgram execution failed! Error in execution.\33[0m");
    }
     
}

load_http_program = function(code){
    var result = js_manager.load_http_program(code);

    if(result == 0){
        print("\33[32mProgram downloaded successfully!\33[0m");
    }
    else if(result == 1){
        print("\33[31mServer could not be located!\33[0m");
    }
    else if(result == 2){
        print("\33[31mProgram not found!\33[0m");
    }
    else if(result == 3){
        print("\33[31mInvalid Program file! Contains errors.\33[0m");
    }
    else if(result == 4){
        print("\33[31mNetwork could not be initalized!\33[0m");
    }
    return result;
};

gg = function(){
    // Change the url if not.
    print("Open js_manager.js file and edit the url from www.example.com/code.js to your url address.");
    
    // Symbol '/' is causing problems sometimes in a string so we get it this way 
    var s = String.fromCharCode(47);
    
    var protocol =  'http:';
    var div = s + s;
    var website = 'www.example.com';
    var file = 'code.js';
    var link = protocol + div + website + s + file;
    // It is 'http:' + '//' + 'www.example.com' + '/' + 'code.js'
    
    print('Opening: ' + link);
    var result = js_manager.load_http_program(link);

    if(result == 0){
        print("\33[32mProgram downloaded successfully!\33[0m");
    }
    else if(result == 1){
        print("\33[31mServer could not be located!\33[0m");
    }
    else if(result == 2){
        print("\33[31mProgram not found!\33[0m");
    }
    else if(result == 3){
        print("\33[31mInvalid Program file! Contains errors.\33[0m");
    }
    else if(result == 4){
        print("\33[31mNetwork could not be initalized!\33[0m");
    }
    return result;
};

erase_flash = function(){
    var result = js_manager.erase_flash();
    if(result == 0 ){
        return ('Flash erased successfully!');
    }
    else{
        return ('Flash erasing failed with error code: ' + result);
    }
};

reboot = function(){
    return js_manager.reboot();
}

module.exports = js_manager;

print('js_manager.js has finished executing.');
