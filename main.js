const UI = {
    loadSelector() {
        const cityElm = document.querySelector('#city')
        const cityInfoElm = document.querySelector('#w-city')
        const iconElm = document.querySelector('#w-icon')
        const temperatureElm = document.querySelector('#w-temp')
        const pressureElm = document.querySelector('#w-pressure')
        const humidityElm = document.querySelector('#w-humidity')
        const feelElm = document.querySelector('#w-feel')
        const formElm = document.querySelector('#form')
        const countryElm = document.querySelector('#country')
        const messageElm = document.querySelector('#messageWrapper')
        return {
          cityElm,
          countryElm,
          iconElm,
          cityInfoElm,
          temperatureElm,
          pressureElm,
          humidityElm,
          feelElm,
          formElm,
          messageElm
        }
      },
      hideMessage() {
        const { messageElm } = this.loadSelector()
        setTimeout(() => {
          messageElm.innerHTML = ''
        }, 2000)
      },
      showMessage(msg) {
        const { messageElm } = this.loadSelector()
        const elm = `<div class='alert alert-danger'>${msg}</div>`
        messageElm.innerHTML = elm
        //hiding message
        this.hideMessage()
      },
      validateInput(city, country) {
        if (city === '' || country === '') {
          this.showMessage('please provide necessary information')
          return false
        }
        return true
      },
      getInput() {
        const { cityElm, countryElm } = this.loadSelector()
        const city = cityElm.value
        const country = countryElm.value
     
        //validation of input
        const isValidated = this.validateInput(city, country)
     
        return { city, country, isValidated }
      },
    clearInput(){
        const {cityElm,countryElm} = this.loadSelector()
        cityElm.value  = ''
        countryElm.value  = ''
    },
    getIcon(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
      },
      async getAndPopulateUI() {
        console.log(this)
        //load data from localStorage
        const { city, country } = storage.getData()
        // setting to weatherData
        weatherData.city = city
        weatherData.country = country
        //calling API
        const data = await weatherData.getData()
        //populate to UI
        this.populateUI(data)
      },
      populateUI(data) {
        const {
          iconElm,
          cityInfoElm,
          temperatureElm,
          pressureElm,
          humidityElm,
          feelElm
        } = this.loadSelector()
     
        const { weather, main, name: cityName } = data
     
        const url = this.getIcon(weather[0].icon)
     
        //setting element
        cityInfoElm.textContent = cityName
        temperatureElm.textContent = `Temperature: ${main.temp}°C`
        pressureElm.textContent = `Pressure: ${main.pressure} kpa`
        humidityElm.textContent = `Humidity: ${main.humidity}`
        feelElm.textContent = weather[0].main
        iconElm.setAttribute('src', url)
      },
    init(){
       const {formElm} = this.loadSelector()
       formElm.addEventListener('submit', async e =>{
           e.preventDefault()
           const {city, country, isValidated}  = this.getInput()

           this.clearInput()

           if(isValidated){
               weatherData.city  = city
               weatherData.country = country


               storage.city = city
               storage.country = country

               storage.saveData()

               const data = await weatherData.getData()

               if(data){
                   this.populateUI(data)
               }
           }
       })
       window.addEventListener('DOMContentLoaded', () =>{
        this.getAndPopulateUI()
       } )
    }
}
UI.init()


const weatherData = {
    city:'',
    country: '',
    APP_ID: 'b156534ca5bf0c545411e707d579611f',
    async getData(){

        try{
            const res =   await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.APP_ID}`)
       const data = await res.json()


       if(data.cod >= 400){
           UI.showMessage(data.message)
           return false
       }else{
           return data
       }
        }catch(err){
            UI.showMessage('Problem in fetching weather')
        }
       
    }
}

const storage = {
    city:'',
    country: '',
    saveData(){
        localStorage.setItem('bd_weather_city',this.city)
        localStorage.setItem('bd_weather_country',this.country)
    },
    getData(){
        const city = localStorage.getItem('bd_weather_city' ) || 'Chittagong'
        const country =localStorage.getItem('bd_weather_country') || 'BD'
        return {city,country}
    }
}