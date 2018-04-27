# mbed-js-st-examples
Contains ST examples for JavaScript on Mbed OS.


## To build:


```
// Clone this repository:
git clone https://github.com/STMicroelectronics-CentralLabs/mbed-js-st-examples.git

// Now, open the example you would like to build, for example: mbed-js-x-nucleo-iks01a2-example
cd mbed-js-st-examples/mbed-js-x-nucleo-iks01a2-example

// Now run npm install to download all required dependencies
npm install

// Use gulp to build the project using target argument e.g. --target=TARGET_NAME
gulp --target=NUCLEO_F429ZI
```

Copy build/out/NUCLEO_F429ZI/mbedos5.bin to your target device.


__where NUCLEO_F429ZI is an example of target device__
