const ceils = [];

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    ceils.push({
      x: i,
      y: j,
      touched: false
    })
  }
}

console.log(ceils);

const freeCeils = ceils.filter((ceil) => ceil.touched === false);
console.log(freeCeils.length);