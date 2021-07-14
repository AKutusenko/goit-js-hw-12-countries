export default fetch('https://restcountries.eu/rest/v2/name/ukr')
    .then(response => {
        return response.json();
    })
    .then(country => { console.log(country);});
