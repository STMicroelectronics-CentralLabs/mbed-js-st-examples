var IKS01A2Demo = require('./iks01a2');
var mqtt = require('./mqtt');

function main(){
    var self = this;
    self.demo = null;

    self._mqtt = null;

    self.iv = null;
    
    self.sensor_data = null;
    self.acc = null;
    self.gyr = null;
    self.mag = null;

    self.button = InterruptIn(BUTTON1);
    self.isDemoRunning = false;
    
    self.init = function(){
        if(self.demo == null){
            self.demo = new IKS01A2Demo();
            self.demo.init();
            self.isDemoRunning = false;
        }
        if(self._mqtt == null){
            self._mqtt = new mqtt();
            self._mqtt.run();
        }

        self.button.fall(function() {
            if(!self.isDemoRunning){
                self.isDemoRunning = true;
                print("Demo Running!");
            }
            else{
                self.isDemoRunning = false;
                print("Demo Stopped!");
            }

        });
    }
    
    self.test_mqtt = function(){
        //print('Sending: ' + JSON.stringify(self.sensor_data["HTS221"]));
        
        if(self._mqtt.publish(JSON.stringify(self.sensor_data["HTS221"])) == 0){
            print("\33[32mPublished successfully!\33[0m");
        }
        else{
            print("\33[31mPublishing failed!\33[0m");
        }
    }

    

    self.run = function(){
        
        if(self.iv == null){
            self.iv = setInterval(function() {
                if(self.isDemoRunning){
                    //ST Sensor Demo
                    self.sensor_data = self.demo.readData();
                    self.acc = self.sensor_data["LSM6DSL"]["Accelerometer"];
                    self.gyr = self.sensor_data["LSM6DSL"]["Gyroscope"];
                    self.mag = self.sensor_data["LSM303AGR"]["Magnetometer"];
                    
                    print("\33[35m");
                    
                    print ("[Accelerometer] | x: " + self.acc.x + " y: " + self.acc.y + " z: " + self.acc.z);
                    print ("[Gyroscope] | x: " + self.gyr.x + " y: " + self.gyr.y + " z: " + self.gyr.z);
                    print ("[Magnetometer] | x: " + self.mag.x + " y: " + self.mag.y + " z: " + self.mag.z);
                    
                    print ("[LPS22HB] | Temperature: " + self.sensor_data["LPS22HB"]["Temperature"] + " Pressure: " + self.sensor_data["LPS22HB"]["Pressure"]);
                    
                    print("\33[0m");

                self.test_mqtt();
                }

            }, 5000);
        }
            
        
        
        
    };

    // Stops the demo interval
    self.stop = function(){
        // Call this function to clear the interval started above
        if(self.iv){
            clearInterval(self.iv);
            self.iv = null;
        }
    };
}

var _main = new main();
_main.init();
_main.run();   

print("Press button for demo.\r");
    