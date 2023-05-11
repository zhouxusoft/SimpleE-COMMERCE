const cities = [
    { name: '上海', population: 24256800 },
    { name: '北京', population: 21516000 },
    { name: '广州', population: 14043500 },
    { name: '深圳', population: 12528300 }
];

console.log(cities);

cities.sort((a, b) => {
    return b.population - a.population
})

console.log(cities);