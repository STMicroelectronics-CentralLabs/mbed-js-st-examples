
function BLE(advertisingID) {
    var self = this;
    
    self.led1 = null;

    self.advertisingName = advertisingID;

    // instantiate BLEDevice, only do this once
    self.ble = null;
    self.characteristic = null;
    self.service = null;
    self.characteristicUUID = '0x00E00000-0001-11e1-ac36-0002a5d5c51b';
    self.serviceUUID = '';
    self.count = 0;
    
    self.led1 = DigitalOut(0x6c);
    
    //long
    self.longToByteArray = function(long) {
        // we want to represent the input as a 8-bytes array
        var byteArray = [0, 0];

        for ( var index = 0; index < byteArray.length; index ++ ) {
            var byte = long & 0xff;
            byteArray [ index ] = byte;
            long = (long - byte) / 256 ;
        }

        return byteArray;
    };
    
    //byte[]
    self.byteArrayToLong = function(byteArray) {
        var value = 0;
        for ( var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }

        return value;
    };

    self.addService = function(){
        // takes in an array of BLEService objects
        self.ble.addServices([
            self.service
        ]);
    };
    
    self.startAdvertising = function(){
        print ("Using advertising name: " + self.advertisingName);
        // takes: name to advertise, array of UUIDs (strings), advertisement interval (default: 1000)
        print("Start advertising using UUID: " +  self.service.getUUID());
        self.ble.startAdvertising(self.advertisingName, [
            self.service.getUUID()
        ], 100, '018000E00000');
    };
    

    self.init = function(){
        print("Initializing BLE...");
        
        self.led1.write(1);
        
        // instantiate BLEDevice, only do this once
        self.ble = BLEDevice();
        // takes in: characteristic UUID (16 bit only), array of properties (r/w/n), data size
        self.characteristic = BLECharacteristic('00e00000-0001-11e1-ac36-0002a5d5c51b', ['read', 'write', 'notify'], 1);
        //self.characteristic = BLECharacteristic('9101', ['read', 'write', 'notify'], 1);
        
        // takes in: service UUID (16 bit only), array of BLECharacteristic objects
        self.service = BLEService('00e10000-aaa1-11e1-ac36-0002a5d5c51b', [ self.characteristic ]);

        // receiving updates when written over GATT
        self.characteristic.onUpdate(function (newValue) {
            // newValue is an array (same value as read() returns)
            var data = [];
            var strData= "";
            newValue.forEach(function(item) {
                data.push(String.fromCharCode(item));
                strData = strData + String.fromCharCode(item);
            }, this);
            
            print("Updated! New value is " + newValue.length + ", first element is " + newValue[0] + ", whole data is " + newValue );
            print("Updated! New value is " + data.length + ", first element is " + data[0] + ", whole data is " + data );
            print("Received data is: " + strData);
            self.sendData("OKAY!");
        });

        
        
        // connection callback
        self.ble.onConnection(function() {
            // write to a characteristic
            print("GATT connection established");
            //sendByte();
        });

        
        // disconnection callback
        self.ble.onDisconnection(function() {
            print("GATT disconnected, restarting advertisements");

            // call without parameters to use the last used set
            self.ble.startAdvertising();
        });

        
        // ready callback, wait before interacting with the API
        self.ble.ready(function() {
            self.addService();
            self.startAdvertising();

        });

        

        self.led1.write(0);
        return 0;
    };
    
    
    self.sendData = function(data){
        if(self.ble && self.ble.isConnected()){
            print ("sending: [" + data + "]");
            var decoded = [];
            for (var index = 0; index < data.length; index++) {
                decoded.push(data.charCodeAt(index));
            }
            self.characteristic.write(decoded);
        }
        else{
            print("BLE not connected!");
        }
    };
    
    self.sendAsciiData = function(data){
        if(self.ble && self.ble.isConnected()){
            for (var index = 0; index < data.length; index++) {
                print ("Sending character: " + data[index] + " Hex: " + data[index].toString(16));
            }
            self.characteristic.write(data);
        }
        else{
            print("BLE not connected!");
        }
    };

    self.sendAxisData = function(axis){
        if(self.ble && self.ble.isConnected()){
            self.count = self.count + 1;
            var t = self.longToByteArray(parseInt(self.count));
            var x = self.longToByteArray(parseInt(axis.x));
            var y = self.longToByteArray(parseInt(axis.y));
            var z = self.longToByteArray(parseInt(axis.z));
            var data = t.concat(x.concat(y.concat(z)));

            for (var index = 0; index < data.length; index++) {
            //    print ("Sending character: " + data[index] + " Hex: " + data[index].toString(16));
            }
            self.characteristic.write(data);
        }
        else{
            print("BLE not connected!");
        }
    };

    self.sendThreeAxisData = function(axis1, axis2, axis3){
        if(self.ble && self.ble.isConnected()){
            self.count = self.count + 1;
            var t = self.longToByteArray(parseInt(self.count));
            
            var x1 = self.longToByteArray(parseInt(axis1.x));
            var y1 = self.longToByteArray(parseInt(axis1.y));
            var z1 = self.longToByteArray(parseInt(axis1.z));
            
            var x2 = self.longToByteArray(parseInt(axis2.x));
            var y2 = self.longToByteArray(parseInt(axis2.y));
            var z2 = self.longToByteArray(parseInt(axis2.z));
            
            var x3 = self.longToByteArray(parseInt(axis3.x));
            var y3 = self.longToByteArray(parseInt(axis3.y));
            var z3 = self.longToByteArray(parseInt(axis3.z));
            
            var data = t.concat(x1.concat(y1.concat(z1.concat(x2.concat(y2.concat(z2.concat(x3.concat(y3.concat(z3)))))))));

            //print ("Sending: " + data); 
            //for (var index = 0; index < data.length; index++) {
            //    print ("Sending character: " + data[index] + " Hex: " + data[index].toString(16));
            //}
            self.characteristic.write(data);
        }
        else{
            print("BLE not connected!");
        }
    };
    self.isConnected = function(){
        // is connected? returns Boolean
        if(self.ble && self.ble.isConnected()){
            return true;
        }
        else{
            return false;
        }
    };
};

//print("ble.js has finished executing.\r");

module.exports = BLE;
