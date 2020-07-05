public class IntegrationNotifications {
        @AuraEnabled	
        public static void getAccessToken(String message, String uName){
            String endpoint = 'https://login.salesforce.com/services/oauth2/token';
            String username = 'rohit@amu.com';
            String password = 'cloudcertitude1';
            String CONSUMER_KEY = '3MVG9d8..z.hDcPJEC9rJuLOJGkZCbRFn.a3OmrNx0q3yxLn8YuEf0fosmD3DlhNDffpF37extAf_5ynqGBPm';
            String CONSUMER_SECRET = 'B5A6810E8FE48BF2EE719705EB42C9DA7A1EC3C64A73A79DE900CEC2F568C770';
            String requestBody = 'grant_type=password&client_id='+CONSUMER_KEY+'&client_secret='+CONSUMER_SECRET+'&username='+username+'&password='+password;
            
            HttpRequest request = new HttpRequest();
            request.setMethod('POST');
            request.setEndpoint(endpoint);
            request.setBody(requestbody);
            request.setHeader('Content-Type','application/x-www-form-urlencoded'); // get authentication token 
            
            Http http = new Http();
            HttpResponse response = new HttpResponse();
            response = http.send(request);
            //System.debug('Access_Token' + parseResponseForAccessToken(response.getBody()));
            query(parseResponseForAccessToken(response.getBody()),message,uName);
        }
        private static String parseResponseForAccessToken(String responseBody) {
            String accessToken;
            
            JSONParser parser = JSON.createParser(responseBody);
            while (parser.nextToken() != null) {
                if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'access_token')) {
                    parser.nextToken();
                    accessToken = parser.getText();
                }
            }
            return accessToken;
        } 
        private static void query(String accessToken, String message,String uName) {
            // this endpoint allows us to append a SOQL query to retrieve specific data
            // see the documentation for a complete list of endpoints
            //String endpoint = 'https://likesh-dev-ed.my.salesforce.com//services/data/v20.0/query/?q=SELECT+name+from+account+limit+1';
            String endpoint = 'https://rohitgupta-dev-ed.my.salesforce.com/services/data/v45.0/sobjects/Notification__e/';  //salesforce url 
            Httprequest request = new HttpRequest();
            Http http = new Http();
            HttpResponse response;
            
            request.setEndpoint(endpoint);
            request.setMethod('POST');
            // we can use either of the two below lines for content Type.
            request.setHeader('Content-Type','application/json');
            //request.setHeader('Content-Type','application/x-www-form-urlencoded');
            request.setHeader('Authorization','Bearer ' + accessToken);
            Map<String, String> data = new Map<String, String>();            
            data.put('Message__c',message);
            data.put('User_Name__c', uName);
            
            String requestBody = JSON.serialize(data);
            request.setBody(requestBody);
            response = http.send(request);
            System.debug('body: ' + response.getBody());
        }
    }