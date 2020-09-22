import { LightningElement, track } from 'lwc';
import getAccountList from '@salesforce/apex/AccountHelper.getAccountList';
export default class LightningSpinnerLWCExample extends LightningElement {
    @track accounts;
    @track error;
    @track isLoading = false;
    handleLoad() {
        this.isLoading = true;
        getAccountList()
            .then(result => {
                this.accounts = result;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.isLoading = false;
            });
    }
}