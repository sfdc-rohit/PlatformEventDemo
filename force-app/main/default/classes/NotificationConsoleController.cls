public class NotificationConsoleController {
    
    @AuraEnabled    
    public static List<Notifications__c> getMessages(){
        return [select id, name ,message__c, Received_Date__c from Notifications__c  order by Received_Date__c DESC];
    }
}