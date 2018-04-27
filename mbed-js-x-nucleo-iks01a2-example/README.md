# mbed-js-x-nucleo-iks01a2-example
Example project for using X-NUCLEO-IKS01A2 sensors expansion board.

## Description
This example project explains the following:
* Use X-NUCLEO-IKS01A2 expansion board for temperature, pressure and other environmental data in Javascript.
* Read sensors data
* Print sensors data

## To build:
Example script for building the project for Nucleo-F429ZI board, replace it with your target board
```
git clone https://github.com/STMicroelectronics-CentralLabs/mbed-js-st-examples
cd mbed-js-st-examples/mbed-js-x-nucleo-iks01a2-example
npm install
gulp --target=NUCLEO_F429ZI
```
See build/out/NUCLEO_F429ZI/mbedos5.bin.

## Errors building:
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

