// This program is for Nucleo-F476RG, you might have to change the pins and protocol depending on your Nucleo board

function IKS01A2Demo() {
    var self = this;

    // Use LED1 for status
    self.led1 = null;

    // Instantiate all variables
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

    // Initialize
    self.init = function(){
        
        // Initialize SPI for Nucleo-F476RG
        self.spi = SPI(PB_15, NC, PB_13);
        
        // Initialize LED1
        self.led1 = DigitalOut(0x6C);
        
        // Initialize LPS22HB sensor
        print("Loading LPS22HB sensor...");
        self.lps22hb = LPS22HB_JS();
        self.lps22hb.init_spi(self.spi, PA_3, NC, 3);
        print("Loading complete.");
        
        // Initialize LSM6DSL sensor
        print("Loading LSM6DSL sensor...");
        self.lsm6dsl = LSM6DSL_JS();
        self.lsm6dsl.init_spi(self.spi, PB_12, NC, PA_2, 3);
        print("Loading complete.");
        
        // Initialize LSM303AGR sensor
        print("Loading LSM303AGR sensor...");
        self.lsm303agr = LSM303AGR_JS();
        self.lsm303agr.init_acc_spi(self.spi, PC_4);
        self.lsm303agr.init_mag_spi(self.spi, PB_1);
        print("Loading complete.");
        
        // Toggle LED to indicate loading complete
        self.led1.write(0);
    }

    // Read data from sensors
    self.readData = function(){
        
        // Toggle LED to indicate start of reading
        self.led1.write(self.led1.read()? 0: 1);
        
        // Initialize data variable
        var data = {};
        
        // Read LPS22HB sensor
        data["LPS22HB"] = {};
        data["LPS22HB"]["Temperature"] = self.lps22hb.get_temperature();
        data["LPS22HB"]["Pressure"] = self.lps22hb.get_pressure();
        
        // Read LSM6DSL sensor
        data["LSM6DSL"] = {};
        data["LSM6DSL"]["Accelerometer"] = JSON.parse(self.lsm6dsl.get_accelerometer_axes());
        data["LSM6DSL"]["Gyroscope"] = JSON.parse(self.lsm6dsl.get_gyroscope_axes());
        
        // Read LSM303AGR
        data["LSM303AGR"] = {};
        data["LSM303AGR"]["Accelerometer"] = JSON.parse(self.lsm303agr.get_accelerometer_axes());
        data["LSM303AGR"]["Magnetometer"] = JSON.parse(self.lsm303agr.get_magnetometer_axes());
        
        // Toggle LED to indicate reading complete
        self.led1.write(self.led1.read()? 0: 1);
        
        // Return data
        return data;

    };

    // Print the sensors data
    self.printData= function(data){
        
        // Print LPS22HB data
        print("LPS22HB: [Temperature] " + data["LPS22HB"]["Temperature"] + " C,   [Pressure] " + data["LPS22HB"]["Pressure"] + " mbar");
        
        // Print LSM6DSL data
        print("LSM6DSL: [Gyroscope]: " + data["LSM6DSL"]["Gyroscope"].x + ", " + data["LSM6DSL"]["Gyroscope"].y + ", " + data["LSM6DSL"]["Gyroscope"].z + 
        "   [Accelerometer]: " + data["LSM6DSL"]["Accelerometer"].x + ", " + data["LSM6DSL"]["Accelerometer"].y + ", " + data["LSM6DSL"]["Accelerometer"].z);
        
        // Print LSM303AGR data
        print("LSM303AGR: [Magnetometer]: " + data["LSM303AGR"]["Magnetometer"].x + ", " + data["LSM303AGR"]["Magnetometer"].y + ", " + data["LSM303AGR"]["Magnetometer"].z + 
        "   [Accelerometer]: " + data["LSM303AGR"]["Accelerometer"].x + ", " + data["LSM303AGR"]["Accelerometer"].y + ", " + data["LSM303AGR"]["Accelerometer"].z);
        
        // Print jsut a blank line
        print("");
        
    };
};

// Export this module to be used in main.js
module.exports = IKS01A2Demo;
