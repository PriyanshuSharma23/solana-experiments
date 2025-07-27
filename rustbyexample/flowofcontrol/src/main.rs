
fn fizzbuzz(n: usize) { 
    for i in 1..=n {
        if i % 15 == 0 { 
            println!("fizzbuzz");
        } else if i % 3 == 0 { 
            println!("fizz");
        } else if i % 5 == 0 { 
            println!("buzz");
        } else { 
            println!("{}", i);
        }
    }
}

fn main() {
    fizzbuzz(15);
}
