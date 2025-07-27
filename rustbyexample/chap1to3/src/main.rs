use std::fmt;

struct City { 
    name: &'static str,
    lat: f32,
    lon: f32,
}

impl fmt::Display for City { 
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { 
        let lat_c = if self.lat >= 0.0  { 'N' } else { 'S' };
        let lon_c = if self.lon >= 0.0  { 'E' } else { 'W' };

        write!(f, "{}: {:.3}°{} {:.3}°{}",
            self.name, self.lat.abs(), lat_c, self.lon.abs(), lon_c)
    }
}

#[derive(Debug)]
struct Complex { 
    real: f32,
    imag: f32,
}

impl fmt::Display for Complex { 
    fn fmt(&self, f: &mut fmt::Formatter) -> Result<(), fmt::Error> { 
        write!(f, "{} + {}i", self.real, self.imag)
    }
}

struct List(Vec<i32>);
impl fmt::Display for List { 
    fn fmt(&self, f: &mut fmt::Formatter) -> Result<(), fmt::Error> { 
        write!(f, "[")?;

        for (idx, val) in self.0.iter().enumerate() { 

            if idx != 0 { write!(f, ", ")?; }
            write!(f, "{idx}: {val}")?;
        }

        write!(f, "]")
    }
}

#[derive(Debug)]
struct Color {
    red: u8,
    green: u8,
    blue: u8,
}

impl fmt::Display for Color { 
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { 
        write!(f, "RGB ({red}, {green}, {blue}) 0x{red:0>2x}{green:0>2x}{blue:0>2x}", red=self.red, green=self.green, blue=self.blue)
    }
}


fn main2() {
    let city = City { 
        name: "New Delhi", 
        lat: 28.6139,
        lon: 77.2088,
    };

    println!("{}", city);

    for city in [
        City { name: "Dublin", lat: 53.347778, lon: -6.259722 },
        City { name: "Oslo", lat: 59.95, lon: 10.75 },
        City { name: "Vancouver", lat: 49.25, lon: -123.1 },
    ] {
        println!("{}", city);
    }
    for color in [
        Color { red: 128, green: 255, blue: 90 },
        Color { red: 0, green: 3, blue: 254 },
        Color { red: 0, green: 0, blue: 0 },
    ] {
        // Switch this to use {} once you've added an implementation
        // for fmt::Display.
        println!("{}", color);
    }

    let array: [i32; 5] = [1;5];
    let t = (5u32, 1u8, true, -5.04f32);

    println!("Array: {:?}, Tuple: {:?}", array, t);

    // let too_long_tuple = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);
    // println!("Too long tuple: {:?}", too_long_tuple);
}


#[derive(Debug)]
struct Matrix(f32, f32, f32, f32);


impl fmt::Display for Matrix { 
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { 
        write!(f, "( {} {} )\n( {} {} )", self.0, self.1, self.2 ,self.3)
    }
}

fn transpose(m: Matrix) -> Matrix { 
    let Matrix(a, b, c, d) = m;
    return Matrix(a, c, b, d);
}

fn main() { 
    let m = Matrix(0.0, 1.0, 2.0, 3.0);
    println!("{}", m);
    println!("{}", transpose(m));
}
