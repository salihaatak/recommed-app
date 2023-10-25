function selectContactsCallback (params){
  window.selectContactsCallbackTS.zone.run(() => {window.selectContactsCallbackTS.componentFn(params);})
}

function getLocationCallback(params) {
  window.getLocationCallbackTS.zone.run(() => {window.getLocationCallbackTS.componentFn(params);})
}
