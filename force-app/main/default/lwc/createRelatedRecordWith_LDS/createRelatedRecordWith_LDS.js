 import { LightningElement, track } from 'lwc';
 import { createRecord } from 'lightning/uiRecordApi';
 // import toast event reference 
 import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 // import Account objects and its fields reference
 import ACCOUNT_OBJECT from '@salesforce/schema/Account';
 import NAME_FIELD from '@salesforce/schema/Account.Name';
 // import Contact objects and its fields reference
 import CONTACT_OBJECT from '@salesforce/schema/Contact';
 import CONTACTNAME_FIELD from '@salesforce/schema/Contact.LastName';
 import ACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';
 
export default class createRelatedRecord extends LightningElement {
    @track accountName;
    @track accountId; // to store account recordId
    @track contactId; // to store contact recordId
   
    handleNameChange(event){
        this.accountName = event.target.value;
    }
 
   // save called on click of save to insert account and contact record with LDS
    save() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.accountName;
        const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields};
       // create account record 
        createRecord(accRecordInput)
            .then(account => {
                this.accountId = account.id;
               // display success toast msg for account
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created',
                        variant: 'success',
                    }),
                );
               
                // create related contact
                const fields_Contact = {};
                fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.accountName + "'s contact"; // set contact Name same as account name
                fields_Contact[ACCOUNTID_FIELD.fieldApiName] = this.accountId;  //set account Id (parentId) in contact
                const recordInput_Contact = { apiName: CONTACT_OBJECT.objectApiName,
                                              fields : fields_Contact};
                 // create contact record using Lightning Data service
                  createRecord(recordInput_Contact)
                    .then(contact => {
                        this.contactId = contact.id;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Contact created',
                                variant: 'success',
                            }),
                        );
 
                       this.accountName = ''; // reset account name field on UI
                    })
 
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}