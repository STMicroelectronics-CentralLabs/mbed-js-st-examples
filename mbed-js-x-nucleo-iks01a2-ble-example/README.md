# mbed-js-x-nucleo-iks01a2-ble-example
Example project for using BLE and X-NUCLEO-IKS01A2 sensors expansion board.

## Description
This example project explains the following:
* Use [X-NUCLEO-IKS01A2](https://os.mbed.com/components/X-NUCLEO-IKS01A2/) expansion board for temperature, pressure and other environmental data in Javascript.
* Use [X-NUCLEO-IDB0XA1](https://os.mbed.com/components/X-NUCLEO-IDB05A1-Bluetooth-Low-Energy/) BLE expansion board to send data.

## To build:

```
git clone https://github.com/STMicroelectronics-CentralLabs/mbed-js-st-examples
cd mbed-js-st-examples/mbed-js-x-nucleo-iks01a2-ble-example
npm install
gulp --target=NUCLEO_F429ZI
```
See build/out/NUCLEO_F429ZI/mbedos5.bin.

## Errors building:
When you will try to build, you will receive errors building the project, it is because you have not defined a few parameters. Try the following tasks:
### * Configuration error
To use X-Nucleo-IDB0XA1 BLE exansion or the BLE might not work even if you had no error, you have to configure the Nucleo board's SPI pins and add an extra label for ST_BLUENRG.

Open build/jerryscript/targets/mbedos5/mbed_app.json and modify the file as follows (For example, Nucleo-F429ZI):

```
{
	"macros": ["JERRY_JS_PARSER 1"],
	"target_overrides": {
		"NUCLEO_F429ZI": {
			"target.macros_add": [
				"BLUENRG_PIN_SPI_SCK=D13", 
				"BLUENRG_PIN_SPI_MOSI=PB_5"
			],
        		"target.extra_labels_add": ["ST_BLUENRG"]
        	}
    	}
}

```

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
