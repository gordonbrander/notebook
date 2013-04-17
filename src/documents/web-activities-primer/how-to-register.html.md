---
classname: 'slide-content slide-type-1'
order: '3'
---

How do I register an app to handle an activity?
==================================

There are two ways.

Declaratively, through the manifest file:

    {
        "name": "My App",
        "description": "Doing stuff",
        "activities": {
           "view": {
                "filters": {
                    "type": "url",
                    "url": {
                        "required": true, 
                        "regexp":"/^https?:/"
                    }
                }
            }
        }
    }

Or via JavaScript (this approach is still in development):

    var register = navigator.mozRegisterActivityHandler({
        name: "view", 
        disposition: "inline", 
        filters: {
            type: "image/png"
        }     
    }); 
    
    register.onerror = function () {
        console.log("Failed to register activity");
    }

...and then handle the activity:

    navigator.mozSetMessageHandler("activity", function (a) {
        /*
          Call a.postResult() or a.postError() if
          the activity should return a value    
        */
    });