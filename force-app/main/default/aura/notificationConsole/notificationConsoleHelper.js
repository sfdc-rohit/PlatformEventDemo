({
    // Client-side function that invokes the subscribe method on the
    // empApi component.
    subscribe: function (component, event, helper) {
        // Get the empApi component.
        const empApi = component.find('empApi');
        console.log('@@ '+empApi)
        // Get the channel from the attribute.
        const channel = component.get('v.channel');
        // Subscription option to get only new events.
        const replayId = -1;
        // Callback function to be passed in the subscribe call.
        // After an event is received, this callback prints the event
        // payload to the console. A helper method displays the message
        // in the console app.
        const callback = function (message) {
            console.log('Event Received : ' + JSON.stringify(message));
            helper.onReceiveNotification(component, message);
        };
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
            console.log('Subscribed to channel ' + channel);
            component.set('v.subscription', newSubscription);
        }));
    },
    // Client-side function that invokes the unsubscribe method on the
    // empApi component.
    unsubscribe: function (component, event, helper) {
        // Get the empApi component.
        const empApi = component.find('empApi');
        // Get the channel from the component attribute.
        const channel = component.get('v.subscription').channel;
        // Callback function to be passed in the unsubscribe call.
        const callback = function (message) {
            console.log('Unsubscribed from channel ' + message.channel);
        };
        // Unsubscribe from the channel using the subscription object.        
        empApi.unsubscribe(component.get('v.subscription'), $A.getCallback(callback));
    },
    // Client-side function that displays the platform event message
    // in the console app and displays a toast if not muted.
    onReceiveNotification: function (component, message) {
        this.retrieveMessages(component);
        // Extract notification from platform event
        const newNotification = {
            time: $A.localizationService.formatDateTime(
                message.data.payload.CreatedDate, 'HH:mm'),
            message: message.data.payload.Message__c,
            user:message.data.payload.User_Name__c
        };
        
        
        
        // Save notification in history
        //const notifications = component.get('v.notifications');
        //notifications.push(newNotification);
        //component.set('v.notifications', notifications);
        //console.log('%% '+  newNotification.user)
        // Display notification in a toast
        //this.displayToast(component, 'info', newNotification.message);
        
        //var modalBody = newNotification.message;
        var modalBody;
        var modalFooter;
        $A.createComponents([
            ["c:modalContent",{"message": newNotification.message}],
            ["c:modalFooter",{}]
        ],  function(components, status){
            if (status === "SUCCESS") {
                modalBody = components[0];
                modalFooter = components[1];
                component.find('overlayLib').showCustomModal({
                    header: "New Message",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "my-modal,my-custom-class,my-other-class,cModalOpener",
                    closeCallback: function() {
                        //alert('You closed the alert!');
                    }
                })
            }
        }
                           );
        //alert()
        //confirm(newNotification.message);
        //confirm();
    },
    // Displays the given toast message.
    displayToast: function (component, type, message) {
        const toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            type: type,
            message: message
        });
        toastEvent.fire();
    },
    retrieveMessages: function (component) {
        var action = component.get("c.getMessages");       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                console.log('# '+ JSON.stringify(response.getReturnValue()));
                var obj = response.getReturnValue();
                component.set('v.notifications', []);
                const notifications = component.get('v.notifications');
                for(var i= 0;i< obj.length; i++){                                    
                    const newNotification = {
                        time: $A.localizationService.formatDateTime(obj[i].Received_Date__c, 'HH:mm'),
                        message: obj[i].Message__c,
                        Id: obj[i].Id
                    };
                    notifications.push(newNotification);
                }
                component.set('v.notifications', notifications);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });                
        $A.enqueueAction(action);
    }
})