function IKS01A2Demo() {
    var self = this;

    self.timeOut = 100;
    self.timeStatus = self.timeOut/10;

    self.led1 = null;

    self.i2c = null;
    self.spi = null;
    self.hts221 = null;
    self.lps22hb = null;
    self.lsm6dsl = null;
    self.lsm303agr = null;
    self.acc = null;
    self.gyr = null;
    self.acc2 = null;
    self.mag2 = null;

    self.init = function(){
        self.i2c = DevI2C(D14, D15);
        self.led1 = DigitalOut(LED1);
        print("Loading HTS221 sensor...");
        self.hts221 = HTS221_JS();
        self.hts221.init_i2c(self.i2c);
        print("Loading complete.");
        print("Loading LPS22HB sensor...");
        self.lps22hb = LPS22HB_JS();
        self.lps22hb.init_i2c(self.i2c);
        print("Loading complete.");
        print("Loading LSM6DSL sensor...");
        self.lsm6dsl = LSM6DSL_JS();
        self.lsm6dsl.init_i2c(self.i2c);
        print("Loading complete.");
        print("Loading LSM303AGR sensor...");
        self.lsm303agr = LSM303AGR_JS();
        self.lsm303agr.init_acc_i2c(self.i2c);
        self.lsm303agr.init_mag_i2c(self.i2c);
        print("Loading complete.");
        
        self.led1.write(0);
    }

    
    self.readData = function(){
        self.led1.write(self.led1.read()? 0: 1);
        
        var data = {};
        data["HTS221"] = {};
        data["HTS221"]["Temperature"] = self.hts221.get_temperature();
        data["HTS221"]["Humidity"] = self.hts221.get_humidity();
        
        data["LPS22HB"] = {};
        data["LPS22HB"]["Temperature"] = self.lps22hb.get_temperature();
        data["LPS22HB"]["Pressure"] = self.lps22hb.get_pressure();
        
        data["LSM6DSL"] = {};
        data["LSM6DSL"]["Accelerometer"] = JSON.parse(self.lsm6dsl.get_accelerometer_axes());
        data["LSM6DSL"]["Gyroscope"] = JSON.parse(self.lsm6dsl.get_gyroscope_axes());
        
        data["LSM303AGR"] = {};
        data["LSM303AGR"]["Accelerometer"] = JSON.parse(self.lsm303agr.get_accelerometer_axes());
        data["LSM303AGR"]["Magnetometer"] = JSON.parse(self.lsm303agr.get_magnetometer_axes());
        
        self.led1.write(self.led1.read()? 0: 1);
        
        return data;

        //setTimeout(function(){ self.led1.write(self.led1.read()? 0: 1) }, self.timeStatus);
    };

    self.printData= function(data){
    
        print("HTS221: [Temperature] " + data["HTS221"]["Temperature"] + " C,   [Humidity] " + data["HTS221"]["Humidity"] + "%");
        print("LPS22HB: [Temperature] " + data["LPS22HB"]["Temperature"] + " C,   [Pressure] " + data["LPS22HB"]["Pressure"] + " mbar");
        
        print("LSM6DSL: [Gyroscope]: " + data["LSM6DSL"]["Gyroscope"].x + ", " + data["LSM6DSL"]["Gyroscope"].y + ", " + data["LSM6DSL"]["Gyroscope"].z + 
        "   [Accelerometer]: " + data["LSM6DSL"]["Accelerometer"].x + ", " + data["LSM6DSL"]["Accelerometer"].y + ", " + data["LSM6DSL"]["Accelerometer"].z);
        
        print("LSM303AGR: [Magnetometer]: " + data["LSM303AGR"]["Magnetometer"].x + ", " + data["LSM303AGR"]["Magnetometer"].y + ", " + data["LSM303AGR"]["Magnetometer"].z + 
        "   [Accelerometer]: " + data["LSM303AGR"]["Accelerometer"].x + ", " + data["LSM303AGR"]["Accelerometer"].y + ", " + data["LSM303AGR"]["Accelerometer"].z);
        
        print("");
        
    };
};

module.exports = IKS01A2Demo;
