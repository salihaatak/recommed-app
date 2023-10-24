function selectContactsCallback (params){
  window.selectContactsCallbackJS.zone.run(() => {window.selectContactsCallbackJS.componentFn(params);})
}

function selectContactsJS(){
  WebView.postMessage(JSON.stringify({
        type: "selectContacts",
        title: "Telefon Rehberim",
        max: 20,
        text: "Seçtiğiniz kişilerin numaraları işletmeye iletilecektir. Bu numaraları paylaşarak Kullanım Koşullarımızı kabul etmiş oluyorsunuz. Tek seferden en fazla 20 tane numara seçebilirsiniz.",
        buttonText: "Gönder"
    }))
}
