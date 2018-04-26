
function mqtt(){
    var self = this;
    
    // MQTT object
    self.mqtt = null;
    
    // Use LED2 for status
    self.led_2 = DigitalOut(LED2);

    // Initialize MQTT
    self.init = function(){
        
        // Initialize MQTT oject
        self.mqtt = new MQTT_JS();
        
        // Provide username, password, MQTT broker address, port
        return self.mqtt.init('username', 'password', 'address', 'port');

    }
    
    // Connect to MQTT broker
    self.connect = function(){
        
        // Num. of attempts
        var attempts = 0;
        
        // Connectection result, 1 for error, 0 for success
        var connection_result = 1;
        
        // keep trying to connect for 5 times if not connected
        while(connection_result != 0 && attempts < 5){
            
            // Increment attempt by 1
            attempts = attempts + 1;
            
            // Print message for connecting
            print('\33[36mConnecting MQTT... attempt: ' + attempts +'/5\33[0m');
            
            // Connect
            connection_result = self.mqtt.connect();
            
            // Check if connected
            if(connection_result == 0){
            
                // Success! Return.
                print("\33[32mConnected successfully!\33[0m");
                return 0;
            }
            else{
                
                // Failed!
                print("\33[31mConnection failed!\33[0m");    
            }
        }
        
        // Return result in case of error
        return connection_result;
    }

    // Subscribe to MQTT broker
    self.subscribe = function(){
        
        // Set subscription callback
        self.mqtt.onSubscribe(function(data) {
            
            // Just print what received
            print("onSubscribe result: " + data);
            
        });
        
        // Subscribe to a topic
        return self.mqtt.subscribe("my_topic");
    }

    // Publish to MQTT broker
    self.publish = function(data){
        
        // Publish data
        var result = self.mqtt.publish(data);
        
        // Check if error
        if(result == 1){
            
            // Just return error code
            return result;
        }
        
        // Successful, let's try to yield for 500ms to see if broker replies or not.
        
        // Toggle LED
        self.led_2.write(1);
        
        // Yield for 500ms
        self.yield(500);
        
        // Toggle LED
        self.led_2.write(0);
        
        // Return result
        return result;
    }

    
    // Yield, which means wait to receive MQTT broker data
    self.yield = function(time){
        
        // Yield and return result
        return self.mqtt.yield(time);
    }

    // Run MQTT
    self.run = function(){
        
        print('Running...');
        
        // Initialize MQTT
        if(self.init() == 0){
            
            // Success!
            print("\33[32mInit successfully!\33[0m");
        }
        else{
            
            // Error! Return 1 which means error while initializing
            print("\33[31mInit failed!\33[0m");
            return 1;
        }

        // Connect to MQTT broker
        if(self.connect() == 0){
            
            // Success!
            print("\33[32mConnected successfully!\33[0m");
        }
        else{
            
            // Error! Return 2 which means error while connecting
            print("\33[31mError connecting to MQTT! Aborted.\33[0m");
            return 2;
        }

        // Subscribe to MQTT broker
        if(self.subscribe() == 0){
            
            // Success!
            print("\33[32mSubscribed successfully!\33[0m");
        }
        else{
            
            // Error! Return 3 which means error while subscribing
            print("\33[31mSubscription failed!\33[0m");
            return 3;
        }
        
    };
}

module.exports = mqtt;
