public with sharing class LWC_ContactController{
    @AuraEnabled
    public static List<Contact> getImperativeContactList(){
        return [SELECT Id, Name, Email FROM Contact LIMIT 2];
    }
}