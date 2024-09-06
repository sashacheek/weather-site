function processIcon(category){
    switch(category) {
        case "Thunderstorm":
            return "/img/storm.svg"
            break;
        case "Drizzle":
            return "/img/drizzle.svg"
            break;
        case "Rain":
            return "/img/rainy.svg"
            break;
        case "Snow":
            return "/img/snowy.svg"
            break;
        case "Clouds":
            return "/img/cloudy.svg"
            break;
        case "Clear":
            return "/img/sunny.svg"
            break;
        default:
            return "/img/fog.svg"
            break;
    }
}

function convertCityToCoordinates(city, state, country) {

}

module.exports={processIcon}