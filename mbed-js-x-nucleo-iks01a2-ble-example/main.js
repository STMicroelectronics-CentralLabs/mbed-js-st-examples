var IKS01A2Demo = require('./iks01a2');
var BLE = require('./ble');


function main(){
    var self = this;
    self.iks01a2 = null;
    self.ble = null;

    /*
    self.led1 = null;
    self.led1 = DigitalOut(LED1);
    self.led1.write(1);
    */

    self.iv = null;
    
    self.sensor_data = null;
    self.acc = null;
    self.gyr = null;
    self.mag = null;

    self.startTime = null;
    self.endTime = null;
    
    //self.button = InterruptIn(BUTTON1);
    self.isDemoRunning = false;
    
    self.init = function(){
        
        if(self.iks01a2 == null){
            self.iks01a2 = new IKS01A2Demo();
            self.iks01a2.init();
            self.isDemoRunning = false;
        }
        
        if(self.ble == null){
            self.ble = new BLE("BLE JS");
            self.ble.init();
            print("\33[32mBLE initialised!\33[0m");
        }
        
    }

    self.printData = function(){
        print("\33[35m");
                    
        print ("[Accelerometer] | x: " + self.acc.x + " y: " + self.acc.y + " z: " + self.acc.z);
        print ("[Gyroscope] | x: " + self.gyr.x + " y: " + self.gyr.y + " z: " + self.gyr.z);
        print ("[Magnetometer] | x: " + self.mag.x + " y: " + self.mag.y + " z: " + self.mag.z);
        
        print ("[LPS22HB] | Temperature: " + self.sensor_data["LPS22HB"]["Temperature"] + " Pressure: " + self.sensor_data["LPS22HB"]["Pressure"]);
        
        print("\33[0m");
    }

    self.run = function(){
        if(self.iv == null){
            self.iv = setInterval(function() {
                if(self.isDemoRunning){
                    
                    self.startTime = Date.now(); //new Date().getTime();
                    //print("Start time: " + self.startTime);
                    
                    self.sensor_data = self.iks01a2.readData();
                    self.acc = self.sensor_data["LSM6DSL"]["Accelerometer"];
                    self.gyr = self.sensor_data["LSM6DSL"]["Gyroscope"];
                    self.mag = self.sensor_data["LSM303AGR"]["Magnetometer"];
                    
                    // To print data:
                    //self.printData();

                    if(self.ble != null && self.ble.isConnected()){
                        //print ("Sending data: count = " + self.count);
                        //self.ble.sendData(parseInt(self.sensor_data["LPS22HB"]["Temperature"]));    
                        //self.ble.sendAsciiData([Math.round(parseInt(self.sensor_data["HTS221"]["Temperature"]))]);
                        self.ble.sendThreeAxisData(self.acc, self.gyr, self.mag);
                        self.endTime = Date.now(); //new Date().getTime();
                        //print("\33[32mData sent!\33[0m  Total time taken: " + (self.endTime - self.startTime) + " ms.\n");
                        //print("\33[32m " + (self.endTime - self.startTime) + " ms.\33[0m\n");
                    }
                    else{
                        self.endTime = Date.now(); //new Date().getTime();
                        //print("BLE not connected! Total time taken: " + (self.endTime - self.startTime) + " ms.\n");
                    }

                    //self.endTime = Date.now(); //new Date().getTime();
                    //print("End time: " + self.endTime);
                    //print("Total Time taken: " +  (self.endTime - self.startTime) + " milliseconds.\n-------------------------------\n");
                }
            }, 1);
        }
    }

    // Stops the demo interval
    self.stop = function(){
        // Call this function to clear the interval started above
        if(self.iv){
            clearInterval(self.iv);
            self.iv = null;
        }
    };

}

print("Demo Running on L476RG!");

var _main = new main();
//self.isDemoRunning = true;
_main.init();
_main.run();   

_main.isDemoRunning = true;
    


//print("Demo Running on F429ZI!");

/*
var led1 = DigitalOut(0x6c);

var iv = setInterval(function() {
    led1.write(led1.read() == 1? 0: 1);
}, 100);

*/


//print("Press button for demo.\r");
