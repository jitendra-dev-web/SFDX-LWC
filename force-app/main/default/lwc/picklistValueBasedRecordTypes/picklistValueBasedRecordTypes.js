import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
 
export default class FetchPicklistFromLDS extends LightningElement {
    @track lstRecordTypes; // to store account record type list
    @track lstRatings;     // to store Rating field values (picklist)
    recordTypeId = '';     // property to store selected Record Type Id
 
    // get Account Object All Information from 'getObjectInfo' imported library 
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    wireAccount({ data, error }) {
        if (data) {
            let getData = data;
            let tempRecordTypes = [];
            // run a for-in loop and process all account record types
            for (let obj in getData.recordTypeInfos) {
                if (!getData.recordTypeInfos[obj].master) { // skip master record type
                    // create picklist values in object formate with label and value
                    let oRecType = {
                        'label': getData.recordTypeInfos[obj].name,
                        'value': getData.recordTypeInfos[obj].recordTypeId
                    };
                    tempRecordTypes.push(oRecType);
                }
            }
            // set lstRecordTypes property with record type list    
            this.lstRecordTypes = tempRecordTypes;
        }
        else if (error) {
            console.log("Error Occured ---> " + error);
        }
    }
 
    // fetch account object all picklist fields based on recordTypeId
    @wire(getPicklistValuesByRecordType, {
        objectApiName: ACCOUNT_OBJECT,
        recordTypeId: '$recordTypeId'
    })
    wiredRecordTypeInfo({ data, error }) {
        if (data) {
            // set lstRatings property with Rating field Picklist values from returned data
            this.lstRatings = data.picklistFieldValues.Rating.values;
        }
        else if (error) {
            console.log("field Error Occured ---> " + JSON.stringify(error));
        }
    }
 
    // update recordType Id variable/property on record Type picklist change 
    onValueSelection(event) {
        let recTypeId = event.target.value;
        if (recTypeId === '') {
            this.lstRatings = [];
        }
        this.recordTypeId = recTypeId;
    }
}