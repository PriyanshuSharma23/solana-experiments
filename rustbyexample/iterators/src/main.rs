fn main() {
    let v1 = vec![1, 3, 5];

    let v1_iter = v1.iter();

    for el in v1_iter {
        println!("Got: {el}");
    }
}
