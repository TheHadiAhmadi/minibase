import {get} from 'svelte/store'

import {
    showAlert, 
    showError, 
    showWarning, 
    showInfo, 
    showSuccess, 
    closeAlerts
} from '$lib/alerts'

import { alerts } from '$lib/stores'

describe('alerts', () => {
    it('should show Alert in screen', () =>{
        closeAlerts()
        showAlert('this is test');

        showAlert();
        
        expect(get(alerts)).toHaveLength(2)
        expect(get(alerts)[0]).toMatchObject({type: 'warning', text: "this is test"});
        expect(get(alerts)[1]).toMatchObject({type: 'warning', text: "Something went wrong!"});

        showAlert('this is error', "error");
        expect(get(alerts)[2]).toMatchObject({type: 'error', text: "this is error"});
        
        showError('another error')
        expect(get(alerts)).toHaveLength(4)
        expect(get(alerts)[3]).toMatchObject({type: 'error', text: "another error"});
    })

    it('should close all alerts', () => {
        closeAlerts()
        expect(get(alerts)).toHaveLength(0)
    })
    
    it('should support alert types', () => {
        closeAlerts()

        showError('another error')
        expect(get(alerts)[0]).toMatchObject({type: 'error', text: 'another error'})

        showWarning('this is warning')
        expect(get(alerts)[1]).toMatchObject({type: 'warning', text: 'this is warning'})

        showInfo('this is info')
        expect(get(alerts)[2]).toMatchObject({type: 'info', text: 'this is info'})

        showSuccess('this is success')
        expect(get(alerts)[3]).toMatchObject({type: 'success', text: 'this is success'})

        closeAlerts() 
        expect(get(alerts)).toHaveLength(0)
    })
})
