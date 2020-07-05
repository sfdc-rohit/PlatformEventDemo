({
    
    doSomething : function(component, event, helper) {        
        console.log('The selected Record Type is: ' +component.get("v.selRecType"));
    },
    onClick : function(component, event, helper) {
        
        var wholeValue = component.find("selectItem").get("v.value");
        console.log(wholeValue);
        console.log('The selected Record Type is: ' +component.get("v.selRecType"));
        
        var action = component.get("c.getAccessToken");
        action.setParams({ "message" : component.find("wholeValue").get("v.value"),
                          "uName" : component.get("v.selRecType")
                         });
        
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                //alert("From server: Message Sent"  );
                component.find("wholeValue").set("v.value",'');
                component.set("v.selRecType",'');
                // You would typically fire a event here to trigger 
                // client-side notification that the server-side 
                // action is complete
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