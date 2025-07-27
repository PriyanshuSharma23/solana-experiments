use std::mem;

fn analyze_slice(slice: &[i32]) { 
    println!("First element of the array {}", slice[0]);
    println!("Number of items in slice: {}", slice.len());
}

fn main() {
    let xs: [i32; 5] = [1, 2, 3, 4, 5];
    let ys: [i32; 500] = [0; 500];

    println!("First element of the array {}", xs[0]);
    println!("Second element of the array {}", xs[1]);

    println!("Number of items in xs: {}", xs.len());
    println!("Arrays are stack allocated: {}", mem::size_of_val(&xs));

    analyze_slice(&ys);
    analyze_slice(&xs[0..3]);


    println!("\nPrinting items of the array xs");
    for i in 0..xs.len()+1 { 
        match xs.get(i) { 
            Some(xval) => println!("{}: {}", i, xval),
            None => println!("Slow down! {i} is too far"),
        }
    }


    println!("");
    // println!("Value of xs at 5th index: {}", xs[5]);
    println!("Value of xs at 5th index: {}", xs[..][5]);
}
