trigger NotificationTrigger on Notification__e (after insert) {
    List<Notifications__c> NotificationsList = new List<Notifications__c>();
    
    for(Notification__e e : Trigger.New){
        //System.debug('22@ '+e.id);
        System.debug('22@@ '+e.message__c);
        Notifications__c notification = new Notifications__c();        
        notification.message__c = e.message__c;
        notification.Received_Date__c = e.CreatedDate;
        NotificationsList.add(notification);
    }
    if(NotificationsList.size() > 0){
        insert NotificationsList;
    }
}