---
classname: 'slide-content slide-type-1'
order: '2'
---

How do I call web activities from my app?
=========================================

Let’s say you have an app that needs to get a picture – either from the Gallery, Camera or any other app in Firefox OS that supports that activity. To get one, you can call the pick activity, like this:

    var pick = new MozActivity({
       name: "pick",
       data: {
           type: ["image/png", "image/jpg", "image/jpeg"]
       }
    });

We specify the name `pick` and the data to be PNG or JPEG images.

As a user, you choose the app you want to pick an image from. Once you’ve done so, the result will be posted back to the requesting app (Note: the app handling the activity chooses what will be returned).

Like most WebAPIs, a Web Activity has onsuccess and onerror event handlers. In the case of an image/file the `onsuccess` handler gets a blob. It can then represent the returned image visually in the app:

    pick.onsuccess = function () {    
        // Create image and set the returned blob as the src
        var img = document.createElement("img");
        img.src = window.URL.createObjectURL(this.result.blob);
     
        // Present that image in your app
        var imagePresenter = document.querySelector("#image-presenter");
        imagePresenter.appendChild(img);
    };
     
    pick.onerror = function () {
        // If an error occurred or the user canceled the activity
        alert("Can't view the image!");
    };
