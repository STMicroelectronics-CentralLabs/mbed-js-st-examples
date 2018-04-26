
function mqtt(){
    var self = this;
    self.mqtt = null;
    self.led_2 = DigitalOut(LED2);

    self.init = function(){
        self.mqtt = new MQTT_JS();
        //self.demo.init();

        self.mqtt.onSubscribe(function(i) {
            // write to a characteristic
            print("onSubscribe result: " + i);
            //sendByte();
        });
        return self.mqtt.init('hsojbpev', '4H5vbg1KAhYi', 'm20.cloudmqtt.com', '10023');

    }
    
    self.connect = function(){
        var attempts = 0;
        var connection_result = 1;
        while(connection_result != 0 && attempts < 5){
            attempts = attempts + 1;
            print('\33[36mConnecting MQTT... attempt: ' + attempts +'/5\33[0m');
            connection_result = self.mqtt.connect();
            if(connection_result == 0){
                return 0;
                print("\33[32mConnected successfully!\33[0m");
            }
            else{
                print("\33[31mConnection failed!\33[0m");    
            }
        }
        return connection_result;
    }

    self.subscribe = function(){
        self.mqtt.onSubscribe(function(data) {
            // write to a characteristic
            print("onSubscribe result: " + data);
            load_http_program(data);
            //sendByte();
        });
        return self.mqtt.subscribe("NucleoMQTT");
    }

    self.publish = function(data){
        var result = self.mqtt.publish(data);
        if(result == 1){
            return result;
        }
        self.led_2.write(1);
        self.yield(500);
        self.led_2.write(0);
        return result;
    }

    self.test_publish = function(){
        // Symbol / is causing problems sometimes in a string so we get it this way 
        var s = String.fromCharCode(47);
        
        var protocol =  'http:'; //http:' + '/' + '/' + 'www' + '.indigost' + '.com' + '/' + 'code.js';
        var div = s + s;
        var website = 'www.indigost.com';
        var file = 'code.js';
        var link = protocol + div + website + s + file;
        return self.publish(link);
    }

    self.yield = function(time){
        return self.mqtt.yield(time);
    }

    self.run = function(){
        print('Running...');
        if(self.init() == 0){
            print("\33[32mInit successfully!\33[0m");
        }
        else{
            print("\33[31mInit failed!\33[0m");
            return 1;
        }

        if(self.connect() == 0){
            print("\33[32mConnected successfully!\33[0m");
        }
        else{
            print("\33[31mError connecting to MQTT! Aborted.\33[0m");
            return 2;
        }

        if(self.subscribe() == 0){
            print("\33[32mSubscribed successfully!\33[0m");
        }
        else{
            print("\33[31mSubscription failed!\33[0m");
            return 3;
        }
        
        
        //self.mqtt.run();
        
        print("Running MQTT demo.");
        
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

/*
setTimeout(function(){
    var _mqtt = new mqtt();
    _mqtt.run();    
}, 1000);

*/


module.exports = mqtt;


print("mqtt.js has finished executing.\r");
//*/