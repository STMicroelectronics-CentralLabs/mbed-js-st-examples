# mbed-js-st-fw-nfc02a1-example
Example project for using Flash storage to store JS code and NFC tag reading and writing.

## Description
This example project explains the following:
* Reading and writing NFC tag
* Use Flash storage to store Javascript source code which can be executed when the board is turned on.
* Downloading JavaScript program from url.

## To build:

```
git clone https://github.com/STMicroelectronics-CentralLabs/mbed-js-st-examples
cd mbed-js-st-examples/mbed-js-st-fw-nfc02a1-example
npm install
gulp --target=NUCLEO_F429ZI
```
See build/out/NUCLEO_F429ZI/mbedos5.bin.

## Errors building:
When you will try to build, you will receive errors building the project, it is because you have not defined a few parameters. Try the following tasks:
### * Configuration error

Open build/jerryscript/targets/mbedos5/mbed_app.json and modify the file as follows:

```
{
    "config": {
        "network-interface": {
            "help": "options are ETHERNET,WIFI_ESP8266,WIFI_ODIN,MESH_LOWPAN_ND,MESH_THREAD",
            "value": "ETHERNET"
        },
        "mesh_radio_type": {
        	"help": "options are ATMEL, MCR20",
        	"value": "ATMEL"
        },
        "esp8266-tx": {
            "help": "Pin used as TX (connects to ESP8266 RX)",
            "value": "D1"
        },
        "esp8266-rx": {
            "help": "Pin used as RX (connects to ESP8266 TX)",
            "value": "D0"
        },
        "esp8266-debug": {
            "value": false
        },
        "wifi-ssid": {
            "value": "\"SSID\""
        },
        "wifi-password": {
            "value": "\"Password\""
        }
    },
    "macros": ["MBEDTLS_NO_DEFAULT_ENTROPY_SOURCES",
               "JERRY_JS_PARSER 1", "JSMBED_USE_RAW_SERIAL", "JSMBED_OVERRIDE_JERRY_PORT_CONSOLE"],
    "target_overrides": {
        "*": {
            "target.features_add": ["NANOSTACK", "LOWPAN_ROUTER"],
            "mbed-mesh-api.6lowpan-nd-channel-page": 0,
            "mbed-mesh-api.6lowpan-nd-channel": 12,
            "mbed-trace.enable": 0,
            "mbed-http.http-buffer-size": 2048,
            "platform.stdio-baud-rate": 115200,
            "platform.stdio-convert-newlines": true
        },
        "NUCLEO_F429ZI": {
            "target.restrict_size": "0x80000"
        }
    }
}

```
where target.restrict_size is the size reserved for binary, the rest of the space will be used for Flash storage.

### * Pin generation error
For some boards e.g. NUCLEO_F429ZI, pin generation is failing in Jerryscript. For the time being, you can skip some pin expressions in configuration to build for most boards by following these steps:

Open build/jerryscript/targets/mbedos5/tools/generate_pins.py

Find this line:
```
        pins[pin.name] = evaluator.eval(expr.strip())
```
Put this line in try statement:
```
        try:
            pins[pin.name] = evaluator.eval(expr.strip())
        except:
            print("[Warning] Skipping pin name: " + expr.strip())
```

### * Easy-connect error
If easy-connect fails, try updating mbed-os library.

Open terminal (in Linux, Mac OS X) or command prompt (in Windows) and run the following commands:
```
cd build/jerryscript/targets/mbedos5/mbed-os
mbed update ca661f9d28526ca8f874b05432493a489c9671ea
```

### * Error initializing X-NUCLEO-NFC02A1 expansion board
if you see this error on serial terminal:
```
Failed to init XNucleoNFC02A1 expansion board!
Error:0x1
```

You have to move the 'X_NUCLEO_NFC02A1' library from 'mbed-js-st-fw-nfc02a1-example/node_modules/mbed-js-st-x-nucleo-nfc02a1/NFC02A1/X_NUCLEO_NFC02A1' to 'mbed-js-st-fw-nfc02a1-example/build/jerryscript/targets/mbedos5/X_NUCLEO_NFC02A1'

Remember to Move, not Copy.

## Serial port Testing
Open any serial port terminal application of your choice using settings of 115200-8N1 and try the following functions:
```js
// To load a js source code from HTTP url and save in Flash storage, type the following command and press Ctrl+R to run.
load_http_program('http://mysite.com/source.js');

// To erase the Flash storage, type the following command and press Ctrl+R to run.
erase_flash();

// To reboot device,, type the following command and press Ctrl+R to run.
reboot();
```
## Writing to flash from terminal
If you want to write a JS program to Flash storage offline. Open any serial port terminal application of your choice and write JS code as you like and then press Ctrl+F to flash the code. If you want to test the code only, press Ctrl+R.
