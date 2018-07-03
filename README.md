# pa11y-full-report
Create pa11y full reports for web based softwares or websites. This will generate complete single report

##How to Use
1. Change the appropriate settings on config/conf.toml

```
product = "API Manager"
version = "2.2.0"
standard = "WCAG2AA" #Supported specifications are WCAG2A, WCAG2AA, WCAG2AAA, Section508
 ```
 
 2. Add tasks to page_script/index.json
 
 ```javascript
    {
        "taskName": "logged in default",
        "description": "APIM Store Page - Logged in view",
        "pageURL": "https://localhost:9443/store/site/pages/login.jag",
        "actions" : [
            "set field #username to admin",
            "set field #password to admin",
            "click element #loginBtn",
            "wait for url to be https://localhost:9443/store/"
        ]
    }
```
 
 **taskname**: Page identifier for the report
 
 **description**: Description of the task
 
 **pageURL**: Starting URL for the actions, if actions are empty, this will use as the testable link
 
 **actions**: Actions needs to perform before the test done
 
 3. Type ```npm install```
 
 4. Type ```node index.js```
 
