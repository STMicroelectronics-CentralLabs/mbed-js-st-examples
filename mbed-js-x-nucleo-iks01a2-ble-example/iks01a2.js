function IKS01A2Demo() {
    var self = this;

    self.led1 = null;

    self.spi = null;
    
    self.lps22hb = null;
    self.lsm6dsl = null;
    self.lsm303agr = null;
    
    self.acc = null;
    self.gyr = null;
    self.acc2 = null;
    self.mag2 = null;

    self.init = function(){
        self.spi = SPI(PB_15, NC, PB_13);
        self.led1 = DigitalOut(0x6C);
        
        self.led1.write(1);
    
        print("Loading LPS22HB sensor...");
        self.lps22hb = LPS22HB_JS();
        self.lps22hb.init_spi(self.spi, PA_3, NC, 3);
        print("Loading complete.");
        
        print("Loading LSM6DSL sensor...");
        self.lsm6dsl = LSM6DSL_JS();
        self.lsm6dsl.init_spi(self.spi, PB_12, NC, PA_2, 3);
        print("Loading complete.");
        
        print("Loading LSM303AGR sensor...");
        self.lsm303agr = LSM303AGR_JS();
        self.lsm303agr.init_acc_spi(self.spi, PC_4);
        self.lsm303agr.init_mag_spi(self.spi, PB_1);
        print("Loading complete.");
        
        self.led1.write(0);
    }
    
    self.readData = function(){
        // To read LED Status:
        // self.led1.read();

        self.led1.write(1);
        
        var data = {};
        data["LPS22HB"] = {};
        data["LPS22HB"]["Temperature"] = self.lps22hb.get_temperature();
        data["LPS22HB"]["Pressure"] = self.lps22hb.get_pressure();
        
        data["LSM6DSL"] = {};
        data["LSM6DSL"]["Accelerometer"] = JSON.parse(self.lsm6dsl.get_accelerometer_axes());
        data["LSM6DSL"]["Gyroscope"] = JSON.parse(self.lsm6dsl.get_gyroscope_axes());
        
        data["LSM303AGR"] = {};
        data["LSM303AGR"]["Accelerometer"] = JSON.parse(self.lsm303agr.get_accelerometer_axes());
        data["LSM303AGR"]["Magnetometer"] = JSON.parse(self.lsm303agr.get_magnetometer_axes());
        
        self.led1.write(0);
        
        return data;

    };

    self.printData= function(data){
    
        print("LPS22HB: [Temperature] " + data["LPS22HB"]["Temperature"] + " C,   [Pressure] " + data["LPS22HB"]["Pressure"] + " mbar");
        
        print("LSM6DSL: [Gyroscope]: " + data["LSM6DSL"]["Gyroscope"].x + ", " + data["LSM6DSL"]["Gyroscope"].y + ", " + data["LSM6DSL"]["Gyroscope"].z + 
        "   [Accelerometer]: " + data["LSM6DSL"]["Accelerometer"].x + ", " + data["LSM6DSL"]["Accelerometer"].y + ", " + data["LSM6DSL"]["Accelerometer"].z);
        
        print("LSM303AGR: [Magnetometer]: " + data["LSM303AGR"]["Magnetometer"].x + ", " + data["LSM303AGR"]["Magnetometer"].y + ", " + data["LSM303AGR"]["Magnetometer"].z + 
        "   [Accelerometer]: " + data["LSM303AGR"]["Accelerometer"].x + ", " + data["LSM303AGR"]["Accelerometer"].y + ", " + data["LSM303AGR"]["Accelerometer"].z);
        
        print("");
        
    };
};

module.exports = IKS01A2Demo;
